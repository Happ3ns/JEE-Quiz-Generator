// ── Performance Analytics & Mastery Dashboard ──
(function (root) {
  "use strict";

  function renderAnalyticsView(container) {
    if (!container) return;

    const history = (root.QuizState && root.QuizState.loadHistory) ? root.QuizState.loadHistory() : [];
    const stats = (root.QuizState && root.QuizState.topicWeaknessSummary) ? root.QuizState.topicWeaknessSummary() : {};
    const icons = root.QuizIcons || { get: () => "" };

    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalScore = 0;
    let totalPossible = 0;

    const subjectStats = {
      Physics: { correct: 0, total: 0 },
      Chemistry: { correct: 0, total: 0 },
      Mathematics: { correct: 0, total: 0 }
    };

    history.forEach(attempt => {
      (attempt.answers || []).forEach(a => {
        totalQuestions++;
        if (a.correct) totalCorrect++;
        if (subjectStats[a.subject]) {
          subjectStats[a.subject].total++;
          if (a.correct) subjectStats[a.subject].correct++;
        }
      });
      totalScore += (attempt.score || 0);
      totalPossible += (attempt.maxScore || attempt.total * 4 || 1);
    });

    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    
    // Estimate percentile rank based on mock performance
    let percentileEstimate = "--";
    if (totalQuestions >= 10) {
      if (overallAccuracy >= 85) percentileEstimate = "99.2+ %ile";
      else if (overallAccuracy >= 75) percentileEstimate = "97.5+ %ile";
      else if (overallAccuracy >= 65) percentileEstimate = "94.0+ %ile";
      else if (overallAccuracy >= 50) percentileEstimate = "88.0+ %ile";
      else percentileEstimate = "75.0+ %ile";
    }

    // Top weak topics
    const weakTopics = Object.keys(stats)
      .filter(t => stats[t].total >= 2)
      .map(t => ({
        topic: t,
        accuracy: Math.round((stats[t].correct / stats[t].total) * 100),
        total: stats[t].total,
        correct: stats[t].correct
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    container.innerHTML = `
      <div class="card" style="margin-bottom: 24px;">
        <div class="setup-hero" style="margin-bottom: 20px;">
          <div class="hero-pill">PERSISTENT DIAGNOSTIC METRICS</div>
          <div style="display:flex; justify-content:center; gap:10px; margin-bottom:14px; flex-wrap:wrap;">
            <button id="exportErrorSheetBtn" type="button" style="background:rgba(99, 102, 241, 0.15); border:1px solid rgba(99, 102, 241, 0.4); color:#a5b4fc; border-radius:8px; padding:6px 14px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              📥 Export Revision Error Sheet (Markdown)
            </button>
            <button id="drillStarredBtn" type="button" style="background:rgba(251, 191, 36, 0.12); border:1px solid rgba(251, 191, 36, 0.35); color:#fde68a; border-radius:8px; padding:6px 14px; font-size:12.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              ★ Practice Starred Questions
            </button>
          </div>
          <h2>Performance <span class="gradient-text">&amp; Analytics Engine</span></h2>
          <p>Comprehensive tracking of test history, subject-by-subject accuracy, and prioritized focus areas stored on this device.</p>
        </div>

        <!-- 4-Stat Strip -->
        <div class="stats-strip" style="margin-bottom: 28px;">
          <div class="stat-box">
            <span class="label">Total Rounds</span>
            <strong>${history.length}</strong>
          </div>
          <div class="stat-box">
            <span class="label">Questions Solved</span>
            <strong>${totalQuestions}</strong>
          </div>
          <div class="stat-box">
            <span class="label">Overall Accuracy</span>
            <strong style="color:var(--accent-emerald);">${overallAccuracy}%</strong>
          </div>
          <div class="stat-box">
            <span class="label">Estimated Standing</span>
            <strong style="color:var(--accent-indigo);">${percentileEstimate}</strong>
          </div>
        </div>

        <!-- Subject Breakdown -->
        <h3 class="section-subhead">Section-by-Section Accuracy</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:14px; margin-bottom: 32px;">
          ${renderSubjectMetricCard("Physics", icons.get("atom"), subjectStats.Physics, "#06b6d4")}
          ${renderSubjectMetricCard("Chemistry", icons.get("flask"), subjectStats.Chemistry, "#10b981")}
          ${renderSubjectMetricCard("Mathematics", icons.get("pi"), subjectStats.Mathematics, "#6366f1")}
        </div>

        <!-- Weak Topics Action Matrix -->
        <h3 class="section-subhead">Targeted Revision Priority</h3>
        <div id="analyticsWeakList" style="margin-bottom: 32px;">
          ${renderWeakList(weakTopics, icons)}
        </div>

        <!-- Past Test History Log -->
        <h3 class="section-subhead">Recent Session Log</h3>
        <div id="analyticsHistoryList">
          ${renderHistoryList(history)}
        </div>
      </div>
    `;

    // Export Error Sheet
    const exportBtn = container.querySelector("#exportErrorSheetBtn");
    if (exportBtn) {
      exportBtn.onclick = () => {
        const hist = (root.QuizState && root.QuizState.loadHistory) ? root.QuizState.loadHistory() : [];
        const mistakes = [];
        hist.forEach(round => {
          (round.answers || []).forEach(ans => {
            if (!ans.correct && !ans.skipped) {
              mistakes.push({ ...ans, roundDate: round.date, roundSubject: round.subject });
            }
          });
        });

        let md = "# JEE Revision Error Sheet\n\n";
        md += "Generated on: " + new Date().toLocaleString() + "\n\n";
        md += "Total Recorded Mistakes: " + mistakes.length + "\n\n";
        md += "---\n\n";

        if (!mistakes.length) {
          md += "### Clean Record!\nNo mistakes recorded on this device. Keep practicing!\n";
        } else {
          mistakes.forEach((m, idx) => {
            const qPrompt = m.q || m.question || "(Question text unavailable for older attempts)";
            const pickedVal = m.picked !== undefined ? m.picked : m.chosen;
            const ansVal = m.answer !== undefined ? m.answer : m.correctAnswer;
            const solText = m.explain || m.explanation || "";
            const letters = ["A", "B", "C", "D"];
            md += "### Question " + (idx + 1) + " [" + (m.subject || "JEE") + " · " + (m.topic || "General") + "]\n\n";
            md += "**Question:**\n" + qPrompt + "\n\n";
            if (pickedVal !== undefined) md += "- **Your Selection:** Option " + (letters[pickedVal] || (pickedVal + 1)) + "\n";
            if (ansVal !== undefined) md += "- **Correct Answer:** Option " + (letters[ansVal] || (ansVal + 1)) + "\n";
            if (solText) md += "\n**Solution & Explanation:**\n" + solText + "\n";
            md += "\n---\n\n";
          });
        }

        const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "jee-revision-error-log.md";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };
    }

    // Drill Starred Questions
    const drillStarBtn = container.querySelector("#drillStarredBtn");
    if (drillStarBtn) {
      drillStarBtn.onclick = () => {
        const starred = (root.QuizState && root.QuizState.getBookmarks) ? root.QuizState.getBookmarks() : [];
        if (!starred.length) {
          alert("You haven't starred any questions yet! Click the ☆ Star button during practice to bookmark tricky questions.");
          return;
        }
        const bank = (typeof root.QuizTaxonomy !== "undefined" && root.QuizTaxonomy.getQuestionBank)
          ? root.QuizTaxonomy.getQuestionBank()
          : (window.JEE_QUESTIONS || []);
        const matching = bank.filter(q => {
          const k = (root.QuizState && root.QuizState.getQuestionKey) ? root.QuizState.getQuestionKey(q) : String(q.id || (q.q || q.question || "").slice(0, 30));
          return starred.includes(String(k));
        });
        if (!matching.length) {
          alert("None of your starred questions match the current local database.");
          return;
        }
        if (root.QuizState && root.QuizState.state) {
          root.QuizState.state.questions = matching;
          root.QuizState.state.count = matching.length;
          root.QuizState.state.index = 0;
          root.QuizState.state.score = 0;
          root.QuizState.state.correctCount = 0;
          root.QuizState.state.wrongCount = 0;
          root.QuizState.state.skippedCount = 0;
          root.QuizState.state.answers = [];
          root.QuizState.state.mode = "practice";
        }
        if (root.QuizRouter && root.QuizRouter.navigate) {
          root.QuizRouter.navigate("quiz");
        }
        if (root.QuizUI && root.QuizUI.renderQuestion) {
          root.QuizUI.renderQuestion();
        }
      };
    }

    // Wire Drill buttons in analytics
    container.querySelectorAll(".drill-topic-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const topic = btn.getAttribute("data-topic");
        if (topic) {
          if (root.QuizState && root.QuizState.state) {
            root.QuizState.state.subject = "Mixed";
            root.QuizState.state.focus = "Mixed|" + topic;
            root.QuizState.state.difficulty = "any";
            root.QuizState.state.count = 10;
            root.QuizState.state.mode = "practice";
          }
          if (root.QuizUI && root.QuizUI.startQuiz) {
            root.QuizUI.startQuiz();
          }
        }
      });
    });
  }

  function renderSubjectMetricCard(name, iconSvg, data, color) {
    const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    return `
      <div class="stat-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-weight:700; color:#fff; font-size:14px; display:inline-flex; align-items:center; gap:8px;">
            ${iconSvg} ${name}
          </span>
          <span style="font-family:var(--font-mono); font-size:13px; font-weight:700; color:${color};">${acc}%</span>
        </div>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width: ${acc}%; background:${color};"></div>
        </div>
        <span style="display:block; font-size:11.5px; color:var(--ink-muted); font-family:var(--font-mono); margin-top:6px;">
          ${data.correct} correct out of ${data.total} attempted
        </span>
      </div>
    `;
  }

  function renderWeakList(topics, icons) {
    if (!topics.length) {
      return '<p style="color:var(--ink-secondary); font-size:13.5px;">Complete a few practice rounds to identify prioritized topics for revision.</p>';
    }

    const priorityTopics = topics.slice(0, 5);
    return `
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${priorityTopics.map(t => `
          <div class="topic-mastery-row">
            <div class="topic-mastery-meta">
              <span class="topic-mastery-name">${t.topic}</span>
              <div class="mastery-bar-track">
                <div class="mastery-bar-fill ${t.accuracy >= 75 ? 'high' : t.accuracy >= 50 ? 'mid' : 'low'}" style="width: ${t.accuracy}%;"></div>
              </div>
            </div>
            <div class="topic-mastery-score">${t.accuracy}%</div>
            <button class="drill-topic-btn" data-topic="${t.topic}" type="button">
              <span>Drill 10 Qs</span>
              ${icons ? icons.get("arrowRight") : "→"}
            </button>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderHistoryList(history) {
    if (!history.length) {
      return '<p style="color:var(--ink-secondary); font-size:13.5px;">No test attempts recorded on this device yet.</p>';
    }

    const recent = history.slice(-8).reverse();
    return `
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${recent.map((attempt, idx) => {
          const dateStr = new Date(attempt.date).toLocaleString(undefined, {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
          });
          const score = attempt.score !== undefined ? attempt.score : 0;
          const max = attempt.maxScore !== undefined ? attempt.maxScore : attempt.total * 4;
          const acc = attempt.accuracy !== undefined ? attempt.accuracy : (attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0);
          return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:#0d111a; border:1px solid var(--border-hairline); border-radius:var(--r-md); flex-wrap:wrap; gap:10px;">
              <div>
                <span style="font-weight:600; color:#fff; font-size:13.5px;">Round #${history.length - idx} · ${attempt.subject}</span>
                <span style="display:block; font-size:11.5px; color:var(--ink-muted); font-family:var(--font-mono);">${dateStr} · ${attempt.markingScheme === 'jee' ? '+4/-1 JEE' : 'Standard'}</span>
              </div>
              <div style="display:flex; align-items:center; gap:16px;">
                <span style="font-family:var(--font-mono); font-weight:700; color:#fff; font-size:14px;">${score} / ${max} pts</span>
                <span style="font-family:var(--font-mono); font-size:12px; padding:3px 9px; border-radius:var(--r-full); background:rgba(255,255,255,0.05); color:var(--accent-indigo); font-weight:600;">${acc}%</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  root.AnalyticsView = {
    render: renderAnalyticsView
  };

})(typeof window !== "undefined" ? window : globalThis);
