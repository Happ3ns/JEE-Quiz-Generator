// ── UI Controller & View Management ──
(function (root) {
  "use strict";

  const { state, playSound, saveAttempt, loadHistory, getWeakTopics, saveSettings } = root.QuizState;
  const { calculateScore } = root.QuizMarking;
  const { render: renderMath } = root.QuizMath;

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function getBank() {
    return (typeof window !== "undefined" && window.JEE_BANK) ? window.JEE_BANK : [];
  }

  function showScreen(name) {
    document.getElementById("setupScreen").classList.toggle("hidden", name !== "setup");
    document.getElementById("quizScreen").classList.toggle("hidden", name !== "quiz");
    document.getElementById("resultsScreen").classList.toggle("hidden", name !== "results");
    document.getElementById("setupRail").classList.toggle("hidden", name === "quiz");
    document.getElementById("quizRail").classList.toggle("hidden", name !== "quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderChipRow(container, values, current, labelFn, onPick) {
    container.innerHTML = "";
    values.forEach(v => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = labelFn(v);
      chip.setAttribute("aria-pressed", v === current ? "true" : "false");
      chip.addEventListener("click", () => {
        playSound("click");
        onPick(v);
      });
      container.appendChild(chip);
    });
  }

  const SUBJECTS = ["Mixed", "Physics", "Chemistry", "Mathematics"];
  const DIFFICULTIES = ["any", "easy", "medium", "hard"];
  const COUNTS = [5, 10, 15, 20, 30, 40];
  const MARKING_SCHEMES = ["jee", "standard"];
  const TIME_LIMITS = [30, 60, 90, 0];
  const MODES = ["practice", "mock"];

  function refreshSetupUI() {
    const bank = getBank();
    const subjectRow = document.getElementById("subjectRow");
    const difficultyRow = document.getElementById("difficultyRow");
    const countRow = document.getElementById("countRow");
    const markingRow = document.getElementById("markingRow");
    const timerRow = document.getElementById("timerRow");
    const modeRow = document.getElementById("modeRow");

    renderChipRow(subjectRow, SUBJECTS, state.subject, s => s, s => { state.subject = s; state.focus = "any"; refreshSetupUI(); });
    renderChipRow(difficultyRow, DIFFICULTIES, state.difficulty, d => d === "any" ? "Any level" : d[0].toUpperCase() + d.slice(1), d => { state.difficulty = d; refreshSetupUI(); });
    renderChipRow(countRow, COUNTS, state.count, c => String(c), c => { state.count = c; refreshSetupUI(); });
    renderChipRow(markingRow, MARKING_SCHEMES, state.markingScheme, m => m === "jee" ? "JEE Mains (+4 / -1)" : "Standard (1 pt)", m => { state.markingScheme = m; saveSettings(); refreshSetupUI(); });
    renderChipRow(timerRow, TIME_LIMITS, state.questionLimit, sec => sec ? sec + "s" : "Off", sec => { state.questionLimit = sec; refreshSetupUI(); });
    renderChipRow(modeRow, MODES, state.mode, mode => mode === "practice" ? "Practice" : "Mock exam", mode => { state.mode = mode; refreshSetupUI(); });

    // Focus Topic dropdown
    const topicSelect = document.getElementById("topicSelect");
    const previousFocus = state.focus;
    const topicChoices = [...new Map(bank
      .filter(q => state.subject === "Mixed" || q.subject === state.subject)
      .map(q => [q.subject + "|" + q.topic, q])).values()]
      .sort((a, b) => a.topic.localeCompare(b.topic) || a.subject.localeCompare(b.subject));

    topicSelect.innerHTML = '<option value="any">Any topic</option>';
    topicChoices.forEach(q => {
      const option = document.createElement("option");
      option.value = q.subject + "|" + q.topic;
      option.textContent = state.subject === "Mixed" ? q.subject + " · " + q.topic : q.topic;
      topicSelect.appendChild(option);
    });

    if (topicChoices.some(q => q.subject + "|" + q.topic === previousFocus)) {
      topicSelect.value = previousFocus;
    } else {
      state.focus = "any";
      topicSelect.value = "any";
    }

    const strictCount = getFilteredPool().length;
    document.getElementById("bankCount").textContent = bank.length;
    document.getElementById("selectionSummary").textContent = [
      state.subject,
      state.focus === "any" ? "Any topic" : state.focus.split("|")[1],
      state.difficulty === "any" ? "Any level" : state.difficulty,
      state.markingScheme === "jee" ? "+4/-1" : "+1/0"
    ].join(" · ");
    document.getElementById("selectionAvailable").textContent = strictCount + " matching questions";

    document.getElementById("modeHelp").textContent = state.mode === "practice"
      ? "Practice mode shows the answer and worked explanation immediately after each response."
      : "Mock exam hides correctness and explanations until your final review.";

    const mockSectionPlan = document.getElementById("mockSectionPlan");
    if (state.mode === "mock") {
      const sections = getMockSections();
      const totalQuestions = sections.reduce((total, section) => total + section.count, 0);
      mockSectionPlan.textContent = "Sections: " + sections.map(s => s.subject + " " + s.count).join(" · ") + " (" + totalQuestions + " total)";
      mockSectionPlan.classList.remove("hidden");
    } else {
      mockSectionPlan.classList.add("hidden");
    }

    document.getElementById("countLabel").textContent = state.mode === "mock"
      ? "Questions per subject section"
      : "Number of questions";

    const weakTopics = getWeakTopics();
    const weakStart = document.getElementById("weakStartBtn");
    weakStart.disabled = !weakTopics.length;
    document.getElementById("weakStartCaption").textContent = weakTopics.length
      ? "Target " + weakTopics[0]
      : "Complete a few quizzes to unlock";

    const note = document.getElementById("weakAreaNote");
    if (weakTopics.length) {
      note.classList.remove("hidden");
      note.innerHTML = "Identified focus topics: <strong>" + weakTopics.slice(0, 3).join(", ") + "</strong>";
    } else {
      note.classList.add("hidden");
    }

    renderPracticeRail();
  }

  function getFilteredPool() {
    const bank = getBank();
    const [focusSubject, focusTopic] = state.focus === "any" ? [] : state.focus.split("|");
    return bank.filter(q =>
      (state.subject === "Mixed" || q.subject === state.subject) &&
      (state.difficulty === "any" || q.difficulty === state.difficulty) &&
      (state.focus === "any" || (q.subject === focusSubject && q.topic === focusTopic))
    );
  }

  function getMockSections() {
    const bank = getBank();
    const subjectOrder = ["Chemistry", "Physics", "Mathematics"];
    const focusedSubject = state.focus === "any" ? null : state.focus.split("|")[0];
    const subjects = state.subject !== "Mixed" ? [state.subject] : focusedSubject ? [focusedSubject] : subjectOrder;

    return subjects
      .map(subject => {
        let available = bank.filter(q =>
          q.subject === subject &&
          (state.focus === "any" || q.topic === state.focus.split("|")[1]) &&
          (state.difficulty === "any" || q.difficulty === state.difficulty)
        ).length;
        if (available < state.count && state.focus !== "any") {
          available = bank.filter(q => q.subject === subject && q.topic === state.focus.split("|")[1]).length;
        } else if (available < state.count && state.difficulty !== "any") {
          available = bank.filter(q => q.subject === subject).length;
        }
        return { subject: subject, count: Math.min(state.count, available) };
      })
      .filter(section => section.count > 0);
  }

  function buildQuizPool() {
    const bank = getBank();
    const strictPool = getFilteredPool();
    let pool = strictPool;

    if (pool.length < state.count) {
      if (state.focus !== "any") {
        const [focusSubject, focusTopic] = state.focus.split("|");
        pool = bank.filter(q => q.subject === focusSubject && q.topic === focusTopic);
      } else if (state.difficulty !== "any") {
        pool = bank.filter(q => state.subject === "Mixed" || q.subject === state.subject);
      }
      if (pool.length < state.count && state.subject !== "Mixed" && state.focus === "any") {
        pool = shuffle([...pool, ...bank.filter(q => !pool.includes(q))]);
      }
    }

    const total = Math.min(state.count, pool.length);
    if (state.mode !== "mock") return shuffle(pool).slice(0, total);

    return getMockSections().flatMap(section => {
      let subjectPool = pool.filter(q => q.subject === section.subject);
      if (subjectPool.length < section.count) {
        subjectPool = bank.filter(q => q.subject === section.subject);
      }
      return shuffle(subjectPool).slice(0, section.count);
    });
  }

  function startQuiz() {
    state.questions = buildQuizPool();
    if (!state.questions.length) return;
    state.index = 0;
    state.activeSubject = state.questions[0].subject;
    state.score = 0;
    state.correctCount = 0;
    state.wrongCount = 0;
    state.skippedCount = 0;
    state.answers = [];
    state.totalTime = 0;
    state.questionStart = 0;

    showScreen("quiz");
    renderQuestion();
  }

  function renderPracticeRail() {
    const history = loadHistory();
    const bestRuns = history.slice().sort((a, b) => {
      const scoreA = a.total ? a.score / a.total : 0;
      const scoreB = b.total ? b.score / b.total : 0;
      return scoreB - scoreA || new Date(b.date) - new Date(a.date);
    }).slice(0, 3);

    const best = bestRuns.length && bestRuns[0].total
      ? Math.round(100 * bestRuns[0].score / bestRuns[0].total) + "%"
      : "--";

    document.getElementById("historyCount").textContent = history.length;
    document.getElementById("personalBest").textContent = best;

    const list = document.getElementById("leaderboardList");
    list.innerHTML = "";
    if (!bestRuns.length) {
      list.innerHTML = '<div class="rail-caption">Complete a round to see your best scores.</div>';
      return;
    }
    bestRuns.forEach((attempt, index) => {
      const row = document.createElement("div");
      const percent = attempt.total ? Math.round(100 * attempt.score / attempt.total) : 0;
      const date = new Date(attempt.date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      row.className = "rail-stat";
      row.innerHTML = '<span>#' + (index + 1) + ' · ' + date + ' (' + attempt.score + '/' + attempt.total + ')</span><strong>' + percent + '%</strong>';
      list.appendChild(row);
    });
  }

  function getAnswerForQuestion(questionIndex) {
    return state.answers.find(answer => answer.questionIndex === questionIndex);
  }

  function updateLiveRail() {
    const answeredCount = state.answers.length;
    document.getElementById("railAnswered").textContent = answeredCount + " / " + state.questions.length;
    document.getElementById("railCorrect").textContent = state.mode === "mock" ? "Hidden" : state.correctCount;
    document.getElementById("railRemaining").textContent = Math.max(0, state.questions.length - answeredCount);

    const subjectNav = document.getElementById("mockSubjectNav");
    const mockMode = state.mode === "mock";
    subjectNav.classList.toggle("hidden", !mockMode);
    subjectNav.innerHTML = "";

    if (mockMode) {
      const subjects = [...new Set(state.questions.map(q => q.subject))];
      subjects.forEach(subject => {
        const subjectIndexes = state.questions
          .map((q, idx) => q.subject === subject ? idx : -1)
          .filter(idx => idx >= 0);
        const answeredInSub = state.answers.filter(a => subjectIndexes.includes(a.questionIndex)).length;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mock-subject-button";
        btn.setAttribute("aria-pressed", subject === state.activeSubject ? "true" : "false");
        btn.innerHTML = '<span>' + subject + '</span><strong>' + answeredInSub + '/' + subjectIndexes.length + '</strong>';
        btn.addEventListener("click", () => {
          const firstIdx = subjectIndexes.find(idx => !getAnswerForQuestion(idx));
          state.activeSubject = subject;
          state.index = firstIdx !== undefined ? firstIdx : subjectIndexes[0];
          renderQuestion();
        });
        subjectNav.appendChild(btn);
      });
    }

    const questionMap = document.getElementById("questionMap");
    questionMap.innerHTML = "";
    state.questions.forEach((q, idx) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "map-cell";
      cell.textContent = String(idx + 1);

      const ans = getAnswerForQuestion(idx);
      if (idx === state.index) cell.classList.add("current");

      if (ans) {
        cell.classList.add("done");
        if (state.mode === "mock") {
          cell.classList.add("answered");
        } else if (ans.skipped) {
          cell.classList.add("skipped");
        } else if (ans.correct) {
          cell.classList.add("correct");
        } else {
          cell.classList.add("incorrect");
        }
      }

      cell.addEventListener("click", () => {
        state.index = idx;
        state.activeSubject = q.subject;
        renderQuestion();
      });
      questionMap.appendChild(cell);
    });
  }

  function startTimer() {
    clearInterval(state.timerId);
    const timerLabel = document.getElementById("timerLabel");
    if (!state.questionLimit) {
      timerLabel.textContent = "Timer: Off";
      timerLabel.classList.remove("alert");
      return;
    }

    let remaining = state.questionLimit;
    timerLabel.textContent = remaining + "s";
    timerLabel.classList.remove("alert");

    state.timerId = setInterval(() => {
      remaining--;
      timerLabel.textContent = remaining + "s";
      if (remaining <= 10) {
        timerLabel.classList.add("alert");
      }
      if (remaining <= 0) {
        clearInterval(state.timerId);
        onTimeExpired();
      }
    }, 1000);
  }

  function onTimeExpired() {
    const existing = getAnswerForQuestion(state.index);
    if (!existing) {
      skipQuestion(true);
    }
  }

  function renderQuestion() {
    const item = state.questions[state.index];
    if (!item) return;

    state.questionStart = Date.now();
    startTimer();

    const progressLabel = document.getElementById("progressLabel");
    const scoreLabel = document.getElementById("scoreLabel");
    const progressFill = document.getElementById("progressFill");
    const qTag = document.getElementById("qTag");
    const qText = document.getElementById("qText");
    const optionsList = document.getElementById("optionsList");
    const explainBox = document.getElementById("explainBox");
    const nextBtn = document.getElementById("nextBtn");
    const skipBtn = document.getElementById("skipBtn");

    progressLabel.textContent = "Question " + (state.index + 1) + " of " + state.questions.length;
    scoreLabel.textContent = state.mode === "mock" 
      ? (state.markingScheme === "jee" ? "JEE Mode" : "Standard")
      : "Score: " + (state.markingScheme === "jee" ? (state.score >= 0 ? "+" + state.score : state.score) : state.score);

    const progressPercent = ((state.index + 1) / state.questions.length) * 100;
    progressFill.style.width = progressPercent + "%";

    qTag.textContent = item.subject + " · " + item.topic + " · " + item.difficulty;
    qText.textContent = item.q;
    renderMath(qText);

    explainBox.classList.remove("show");
    explainBox.textContent = "";

    const existingAnswer = getAnswerForQuestion(state.index);
    optionsList.innerHTML = "";

    const letters = ["A", "B", "C", "D"];
    item.options.forEach((optText, optIdx) => {
      const opt = document.createElement("div");
      opt.className = "option";
      opt.innerHTML = '<span class="letter">' + letters[optIdx] + '</span><span class="option-text">' + optText + '</span>';
      renderMath(opt.querySelector(".option-text"));

      if (existingAnswer) {
        opt.style.pointerEvents = "none";
        if (existingAnswer.skipped) {
          if (optIdx === item.answer && state.mode !== "mock") opt.classList.add("correct");
        } else {
          if (optIdx === existingAnswer.picked) {
            opt.classList.add("selected");
            if (state.mode !== "mock") {
              opt.classList.add(existingAnswer.correct ? "correct" : "incorrect");
            }
          } else if (optIdx === item.answer && state.mode !== "mock") {
            opt.classList.add("correct");
          }
        }
      } else {
        opt.addEventListener("click", () => pickOption(optIdx));
      }
      optionsList.appendChild(opt);
    });

    if (existingAnswer) {
      if (state.mode !== "mock" && item.explain) {
        explainBox.textContent = item.explain;
        renderMath(explainBox);
        explainBox.classList.add("show");
      }
      nextBtn.disabled = false;
      skipBtn.disabled = true;
    } else {
      nextBtn.disabled = true;
      skipBtn.disabled = false;
    }

    nextBtn.textContent = state.index === state.questions.length - 1 ? "Finish Round" : "Next";
    updateLiveRail();
  }

  function pickOption(pickedIndex) {
    const item = state.questions[state.index];
    clearInterval(state.timerId);

    const isCorrect = pickedIndex === item.answer;
    const timeSpent = Math.max(1, Math.round((Date.now() - state.questionStart) / 1000));
    state.totalTime += timeSpent;

    if (isCorrect) {
      state.correctCount++;
      state.score += (state.markingScheme === "jee" ? 4 : 1);
      playSound("correct");
    } else {
      state.wrongCount++;
      state.score += (state.markingScheme === "jee" ? -1 : 0);
      playSound("wrong");
    }

    state.answers.push({
      questionIndex: state.index,
      subject: item.subject,
      topic: item.topic,
      difficulty: item.difficulty,
      picked: pickedIndex,
      correct: isCorrect,
      skipped: false,
      time: timeSpent
    });

    renderQuestion();
  }

  function skipQuestion(isTimeout) {
    const item = state.questions[state.index];
    clearInterval(state.timerId);
    playSound("skip");

    const timeSpent = Math.max(1, Math.round((Date.now() - state.questionStart) / 1000));
    state.totalTime += timeSpent;
    state.skippedCount++;

    state.answers.push({
      questionIndex: state.index,
      subject: item.subject,
      topic: item.topic,
      difficulty: item.difficulty,
      picked: null,
      correct: false,
      skipped: true,
      timedOut: Boolean(isTimeout),
      time: timeSpent
    });

    if (state.index < state.questions.length - 1) {
      state.index++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function nextQuestion() {
    if (state.index < state.questions.length - 1) {
      state.index++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    clearInterval(state.timerId);
    const summary = calculateScore(state.answers, state.questions.length, state.markingScheme);

    saveAttempt({
      date: new Date().toISOString(),
      subject: state.subject,
      markingScheme: state.markingScheme,
      score: summary.score,
      maxScore: summary.maxScore,
      total: state.questions.length,
      accuracy: summary.accuracy,
      answers: state.answers
    });

    // Populate Results Screen
    const badgeContainer = document.getElementById("badgeContainer");
    badgeContainer.className = "achievement-badge " + summary.badge.class;
    badgeContainer.textContent = summary.badge.text;

    document.getElementById("finalScore").textContent = summary.score;
    document.getElementById("finalOf").textContent = "/ " + summary.maxScore + " pts (" + summary.correct + " correct)";
    document.getElementById("resultSummary").textContent = "Completed in " + Math.round(state.totalTime) + "s · Marking Scheme: " + (state.markingScheme === "jee" ? "JEE Mains (+4 / -1)" : "Standard (1 pt)");

    document.getElementById("accuracyMetric").textContent = summary.accuracy + "%";
    document.getElementById("avgTimeMetric").textContent = state.answers.length ? Math.round(state.totalTime / state.answers.length) + "s" : "0s";
    document.getElementById("attemptMetric").textContent = summary.answeredCount;
    document.getElementById("skippedMetric").textContent = summary.skipped;

    // Animate circular gauge
    const gaugeFill = document.getElementById("gaugeFill");
    const gaugePercent = document.getElementById("gaugePercent");
    const circumference = 283;
    const offset = circumference - (summary.overallPercent / 100) * circumference;
    gaugeFill.style.strokeDashoffset = offset;
    gaugePercent.textContent = summary.overallPercent + "%";

    // Confetti celebration if score is high
    if (summary.accuracy >= 75 && typeof window.confetti === "function") {
      try {
        window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }

    renderTopicMastery();
    showScreen("results");
  }

  function renderTopicMastery() {
    const list = document.getElementById("topicMasteryList");
    list.innerHTML = "";

    const perTopic = {};
    state.answers.forEach(a => {
      if (!perTopic[a.topic]) perTopic[a.topic] = { correct: 0, total: 0, subject: a.subject };
      perTopic[a.topic].total++;
      if (a.correct) perTopic[a.topic].correct++;
    });

    const topics = Object.keys(perTopic);
    if (!topics.length) {
      list.innerHTML = '<div class="rail-caption">No topic data recorded.</div>';
      return;
    }

    topics.forEach(tName => {
      const data = perTopic[tName];
      const percent = Math.round((data.correct / data.total) * 100);
      const tier = percent >= 75 ? "high" : percent >= 50 ? "mid" : "low";

      const row = document.createElement("div");
      row.className = "topic-mastery-row";
      row.innerHTML = `
        <div class="topic-mastery-meta">
          <span class="topic-mastery-name">${tName} (${data.subject})</span>
          <div class="mastery-bar-track">
            <div class="mastery-bar-fill ${tier}" style="width: ${percent}%;"></div>
          </div>
        </div>
        <div class="topic-mastery-score">${percent}%</div>
        <button class="drill-topic-btn" type="button">Drill Topic →</button>
      `;

      row.querySelector(".drill-topic-btn").addEventListener("click", () => {
        state.subject = data.subject;
        state.focus = data.subject + "|" + tName;
        state.difficulty = "any";
        state.count = 10;
        state.mode = "practice";
        startQuiz();
      });

      list.appendChild(row);
    });
  }

  function renderReviewList() {
    const reviewList = document.getElementById("reviewList");
    reviewList.innerHTML = "";
    const letters = ["A", "B", "C", "D"];

    state.questions.forEach((q, idx) => {
      const ans = getAnswerForQuestion(idx);
      const item = document.createElement("div");
      item.className = "review-item";

      let verdictHtml = '<span class="verdict right">✓ Correct</span>';
      if (!ans || ans.skipped) {
        verdictHtml = '<span class="verdict skipped">⊘ Skipped</span>';
      } else if (!ans.correct) {
        verdictHtml = '<span class="verdict wrong">✕ Incorrect</span>';
      }

      let optionsHtml = '<div class="review-options">';
      q.options.forEach((optText, optIdx) => {
        let optClass = "review-opt";
        if (optIdx === q.answer) optClass += " is-correct";
        if (ans && !ans.correct && optIdx === ans.picked) optClass += " user-picked-wrong";
        optionsHtml += '<div class="' + optClass + '"><strong>' + letters[optIdx] + '.</strong> ' + optText + '</div>';
      });
      optionsHtml += '</div>';

      item.innerHTML = `
        ${verdictHtml}
        <div class="review-q-text">${idx + 1}. ${q.q}</div>
        ${optionsHtml}
        ${q.explain ? '<div class="explain show">' + q.explain + '</div>' : ''}
      `;

      renderMath(item);
      reviewList.appendChild(item);
    });
  }

  root.QuizUI = {
    showScreen,
    refreshSetupUI,
    startQuiz,
    skipQuestion,
    nextQuestion,
    renderQuestion,
    renderReviewList
  };

})(typeof window !== "undefined" ? window : globalThis);
