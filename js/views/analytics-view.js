// ── Performance Analytics & Mastery Dashboard ──
(function (root) {
  "use strict";

  const { loadHistory, topicWeaknessSummary, state } = root.QuizState;
  const { startQuiz } = root.QuizUI;

  function renderAnalyticsView(container) {
    if (!container) return;

    const history = loadHistory();
    const stats = topicWeaknessSummary();

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
          ${renderSubjectMetricCard("Physics", "⚛️", subjectStats.Physics, "#06b6d4")}
          ${renderSubjectMetricCard("Chemistry", "🧪", subjectStats.Chemistry, "#10b981")}
          ${renderSubjectMetricCard("Mathematics", "📐", subjectStats.Mathematics, "#6366f1")}
        </div>

        <!-- Weak Topics Action Matrix -->
        <h3 class="section-subhead">Targeted Revision Priority</h3>
        <div id="analyticsWeakList" style="margin-bottom: 32px;">
          ${renderWeakList(weakTopics)}
        </div>

        <!-- Past Test History Log -->
        <h3 class="section-subhead">Recent Session Log</h3>
        <div id="analyticsHistoryList">
          ${renderHistoryList(history)}
        </div>
      </div>
    `;

    // Wire Drill buttons in analytics
    container.querySelectorAll(".drill-topic-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const topic = btn.getAttribute("data-topic");
        if (topic) {
          state.subject = "Mixed";
          state.focus = "Mixed|" + topic;
          state.difficulty = "any";
          state.count = 10;
          state.mode = "practice";
          startQuiz();
        }
      });
    });
  }

  function renderSubjectMetricCard(name, icon, data, color) {
    const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    return `
      <div class="stat-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-weight:700; color:#fff; font-size:14px;">${icon} ${name}</span>
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

  function renderWeakList(topics) {
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
            <button class="drill-topic-btn" data-topic="${t.topic}" type="button">Drill 10 Qs →</button>
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
