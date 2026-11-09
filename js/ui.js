// ── Modern UI Controller & View Management (Linear Obsidian Theme) ──
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
    const navEl = document.querySelector(".app-nav");
    const quizEl = document.getElementById("quizScreen");
    const resultsEl = document.getElementById("resultsScreen");
    const views = document.querySelectorAll(".app-view");

    if (name === "quiz") {
      if (navEl) navEl.classList.add("hidden");
      views.forEach(v => v.classList.add("hidden"));
      if (quizEl) quizEl.classList.remove("hidden");
      if (resultsEl) resultsEl.classList.add("hidden");
    } else if (name === "results") {
      if (navEl) navEl.classList.remove("hidden");
      views.forEach(v => v.classList.add("hidden"));
      if (quizEl) quizEl.classList.add("hidden");
      if (resultsEl) resultsEl.classList.remove("hidden");
    } else {
      if (navEl) navEl.classList.remove("hidden");
      if (quizEl) quizEl.classList.add("hidden");
      if (resultsEl) resultsEl.classList.add("hidden");
      if (root.QuizRouter) {
        root.QuizRouter.navigateTo(root.QuizRouter.getCurrentView() || "practice", false);
      } else {
        const practiceView = document.getElementById("view-practice");
        if (practiceView) practiceView.classList.remove("hidden");
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
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

  function refreshSetupUI() {
    const bank = getBank();

    // Status pill
    const bankPill = document.getElementById("liveBankPill");
    if (bankPill) bankPill.textContent = "JEE 2026 Ready";

    // Update Subject Cards
    const subjectCards = document.querySelectorAll("#subjectGrid .subject-card");
    subjectCards.forEach(card => {
      const isSelected = card.getAttribute("data-subject") === state.subject;
      card.setAttribute("aria-checked", isSelected ? "true" : "false");
      card.setAttribute("aria-selected", isSelected ? "true" : "false");
    });

    // Update Segmented Controls
    updateSegmentedControl("difficultyControl", state.difficulty);
    updateSegmentedControl("countControl", String(state.count));
    updateSegmentedControl("markingControl", state.markingScheme);
    updateSegmentedControl("timerControl", String(state.questionLimit));
    updateSegmentedControl("modeControl", state.mode);

    // Update Focus Topic dropdown
    const topicSelect = document.getElementById("topicSelect");
    if (topicSelect) {
      const previousFocus = state.focus;
      const topicChoices = [...new Map(bank
        .filter(q => state.subject === "Mixed" || q.subject === state.subject)
        .map(q => [q.subject + "|" + q.topic, q])).values()]
        .sort((a, b) => a.topic.localeCompare(b.topic) || a.subject.localeCompare(b.subject));

      topicSelect.innerHTML = '<option value="any">Any Topic (Default)</option>';
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
    }

    // Update Summary Pills
    const strictCount = getFilteredPool().length;
    const summaryPill = document.getElementById("selectionSummary");
    const availablePill = document.getElementById("selectionAvailable");
    const mockSectionPlan = document.getElementById("mockSectionPlan");

    if (summaryPill) {
      const diffLabel = state.difficulty === "any" ? "All Levels" : (state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1));
      const topicLabel = state.focus === "any" ? "" : " · " + state.focus.split("|")[1];
      summaryPill.textContent = state.subject + topicLabel + " · " + diffLabel + " · " + state.count + " Qs";
    }

    if (availablePill) {
      if (strictCount > 0) {
        availablePill.textContent = "Adaptive Engine Ready";
        availablePill.style.color = "";
      } else {
        availablePill.textContent = "No questions for this combination";
        availablePill.style.color = "var(--accent-coral)";
      }
    }

    if (mockSectionPlan) {
      if (state.mode === "mock") {
        const sections = getMockSections();
        const totalQuestions = sections.reduce((total, section) => total + section.count, 0);
        mockSectionPlan.textContent = "Sections: " + sections.map(s => s.subject + " " + s.count).join(" · ") + " (" + totalQuestions + " total)";
        mockSectionPlan.classList.remove("hidden");
      } else {
        mockSectionPlan.classList.add("hidden");
      }
    }

    // Weak Topic Quick-Start Button
    const weakTopics = getWeakTopics();
    const weakStart = document.getElementById("weakStartBtn");
    const weakCaption = document.getElementById("weakStartCaption");
    if (weakStart && weakCaption) {
      if (weakTopics.length) {
        weakStart.disabled = false;
        weakCaption.textContent = "Target " + weakTopics[0];
      } else {
        weakStart.disabled = true;
        weakCaption.textContent = "Complete rounds to unlock";
      }
    }

    // Practice stats footer
    const history = loadHistory();
    const historyCount = document.getElementById("historyCount");
    const personalBest = document.getElementById("personalBest");
    const weakAreaSummary = document.getElementById("weakAreaSummary");

    if (historyCount) historyCount.textContent = history.length;

    if (personalBest) {
      const bestRuns = history.slice().sort((a, b) => {
        const scoreA = a.total ? a.score / a.total : 0;
        const scoreB = b.total ? b.score / b.total : 0;
        return scoreB - scoreA;
      });
      personalBest.textContent = (bestRuns.length && bestRuns[0].total)
        ? Math.round((100 * bestRuns[0].score) / bestRuns[0].total) + "%"
        : "--";
    }

    if (weakAreaSummary) {
      weakAreaSummary.textContent = weakTopics.length ? weakTopics.slice(0, 2).join(", ") : "None yet";
    }
  }

  function updateSegmentedControl(id, activeVal) {
    const control = document.getElementById(id);
    if (!control) return;
    control.querySelectorAll(".segment-btn").forEach(btn => {
      const isActive = btn.getAttribute("data-val") === activeVal;
      btn.setAttribute("aria-checked", isActive ? "true" : "false");
    });
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
    if (!state.questions.length) {
      alert("No matching questions found for current selection. Try selecting 'All Levels' or another subject.");
      return;
    }
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

  function getAnswerForQuestion(questionIndex) {
    return state.answers.find(answer => answer.questionIndex === questionIndex);
  }

  function startTimer() {
    clearInterval(state.timerId);
    const timerPill = document.getElementById("timerPill");
    if (!timerPill) return;

    if (!state.questionLimit) {
      timerPill.textContent = "⏱️ Unlimited";
      timerPill.classList.remove("alert");
      return;
    }

    let remaining = state.questionLimit;
    timerPill.textContent = "⏱️ " + remaining + "s";
    timerPill.classList.remove("alert");

    state.timerId = setInterval(() => {
      remaining--;
      timerPill.textContent = "⏱️ " + remaining + "s";
      if (remaining <= 10) {
        timerPill.classList.add("alert");
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

    const qBadge = document.getElementById("qBadge");
    const qTopic = document.getElementById("qTopic");
    const markingBadge = document.getElementById("markingBadge");
    const progressBar = document.getElementById("progressBar");
    const qText = document.getElementById("qText");
    const optionsGrid = document.getElementById("optionsGrid");
    const explainBox = document.getElementById("explainBox");
    const nextBtn = document.getElementById("nextBtn");
    const skipBtn = document.getElementById("skipBtn");
    const breadcrumb = document.getElementById("quizBreadcrumb");

    if (breadcrumb) {
      const subInfo = (typeof root.QuizTaxonomy !== "undefined" && root.QuizTaxonomy.getSubsectionForTopic)
        ? root.QuizTaxonomy.getSubsectionForTopic(item.subject, item.topic)
        : null;
      const subName = subInfo ? subInfo.name : item.subject;
      breadcrumb.innerHTML = `
        <span>Section: ${item.subject}</span>
        <span class="sep">›</span>
        <span>Unit: ${subName}</span>
        <span class="sep">›</span>
        <strong>${item.topic}</strong>
      `;
    }

    if (qBadge) qBadge.textContent = "Question " + (state.index + 1) + " of " + state.questions.length;
    if (qTopic) qTopic.textContent = item.subject + " · " + item.topic + " · " + item.difficulty.toUpperCase();
    if (markingBadge) {
      markingBadge.textContent = state.markingScheme === "jee" ? "+4 / -1 JEE" : "+1 Standard";
    }

    if (progressBar) {
      const percent = ((state.index + 1) / state.questions.length) * 100;
      progressBar.style.width = percent + "%";
    }

    if (qText) {
      qText.textContent = item.q;
      renderMath(qText);
    }

    if (explainBox) {
      explainBox.classList.remove("show");
      explainBox.textContent = "";
    }

    // Mock subject nav if mock mode
    const mockSubjectNav = document.getElementById("mockSubjectNav");
    if (mockSubjectNav) {
      const isMock = state.mode === "mock";
      mockSubjectNav.classList.toggle("hidden", !isMock);
      mockSubjectNav.innerHTML = "";
      if (isMock) {
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
          mockSubjectNav.appendChild(btn);
        });
      }
    }

    // Render Option Cards
    if (optionsGrid) {
      optionsGrid.innerHTML = "";
      const letters = ["A", "B", "C", "D"];
      const existingAnswer = getAnswerForQuestion(state.index);

      item.options.forEach((optText, optIdx) => {
        const row = document.createElement("div");
        row.className = "option-row";
        row.setAttribute("role", "radio");
        row.setAttribute("tabindex", "0");
        row.innerHTML = `<div class="option-key">${letters[optIdx]}</div><div class="option-text">${optText}</div>`;
        renderMath(row.querySelector(".option-text"));

        if (existingAnswer) {
          row.style.pointerEvents = "none";
          if (existingAnswer.skipped) {
            if (optIdx === item.answer && state.mode !== "mock") row.classList.add("correct");
          } else {
            if (optIdx === existingAnswer.picked) {
              row.classList.add("selected");
              if (state.mode !== "mock") {
                row.classList.add(existingAnswer.correct ? "correct" : "incorrect");
              }
            } else if (optIdx === item.answer && state.mode !== "mock") {
              row.classList.add("correct");
            }
          }
        } else {
          row.addEventListener("click", () => pickOption(optIdx));
        }

        optionsGrid.appendChild(row);
      });

      if (existingAnswer) {
        if (state.mode !== "mock" && item.explain && explainBox) {
          explainBox.innerHTML = "<strong>Worked Solution:</strong><br>" + item.explain;
          renderMath(explainBox);
          explainBox.classList.add("show");
        }
        if (nextBtn) nextBtn.disabled = false;
        if (skipBtn) skipBtn.disabled = true;
      } else {
        if (nextBtn) nextBtn.disabled = true;
        if (skipBtn) skipBtn.disabled = false;
      }
    }

    if (nextBtn) {
      nextBtn.textContent = state.index === state.questions.length - 1 ? "Finish Round" : "Next →";
    }
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
    if (badgeContainer) {
      badgeContainer.className = "achievement-badge " + summary.badge.class;
      badgeContainer.textContent = summary.badge.text;
    }

    const finalScore = document.getElementById("finalScore");
    const finalOf = document.getElementById("finalOf");
    const resultSummary = document.getElementById("resultSummary");

    const anim = (typeof root.Interactive3D !== "undefined" && root.Interactive3D.animateNumber) ? root.Interactive3D.animateNumber : null;

    if (finalScore) {
      if (anim) anim(finalScore, 0, summary.score, 800);
      else finalScore.textContent = summary.score;
    }
    if (finalOf) finalOf.textContent = "/ " + summary.maxScore + " pts (" + summary.correct + " correct)";
    if (resultSummary) {
      resultSummary.textContent = "Completed in " + Math.round(state.totalTime) + "s · Marking Scheme: " + (state.markingScheme === "jee" ? "JEE Mains (+4 / -1)" : "Standard (+1 / 0)");
    }

    const accuracyMetric = document.getElementById("accuracyMetric");
    const avgTimeMetric = document.getElementById("avgTimeMetric");
    const attemptMetric = document.getElementById("attemptMetric");
    const skippedMetric = document.getElementById("skippedMetric");

    if (accuracyMetric) {
      if (anim) anim(accuracyMetric, 0, summary.accuracy, 800, "%");
      else accuracyMetric.textContent = summary.accuracy + "%";
    }
    if (avgTimeMetric) avgTimeMetric.textContent = state.answers.length ? Math.round(state.totalTime / state.answers.length) + "s" : "0s";
    if (attemptMetric) attemptMetric.textContent = summary.answeredCount;
    if (skippedMetric) skippedMetric.textContent = summary.skipped;

    // Animate circular gauge
    const gaugeFill = document.getElementById("gaugeFill");
    const gaugePercent = document.getElementById("gaugePercent");
    if (gaugeFill && gaugePercent) {
      const circumference = 283;
      const offset = circumference - (summary.overallPercent / 100) * circumference;
      gaugeFill.style.strokeDashoffset = offset;
      if (anim) anim(gaugePercent, 0, summary.overallPercent, 1000, "%");
      else gaugePercent.textContent = summary.overallPercent + "%";
    }

    // Confetti celebration if score is high
    if (summary.accuracy >= 75 && typeof window.confetti === "function") {
      try {
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }

    renderTopicMastery();
    showScreen("results");
  }

  function renderTopicMastery() {
    const list = document.getElementById("topicMasteryList");
    if (!list) return;
    list.innerHTML = "";

    const perTopic = {};
    state.answers.forEach(a => {
      if (!perTopic[a.topic]) perTopic[a.topic] = { correct: 0, total: 0, subject: a.subject };
      perTopic[a.topic].total++;
      if (a.correct) perTopic[a.topic].correct++;
    });

    const topics = Object.keys(perTopic);
    if (!topics.length) {
      list.innerHTML = '<div style="color:var(--ink-muted); font-size:13px;">No topic data recorded.</div>';
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
    if (!reviewList) return;
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
        ${q.explain ? '<div class="solution-drawer show" style="margin-top:12px;"><strong>Worked Solution:</strong><br>' + q.explain + '</div>' : ''}
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
