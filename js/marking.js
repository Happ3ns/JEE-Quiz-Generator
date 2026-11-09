// ── Marking Scheme & Scoring Engine ──
(function (root) {
  "use strict";

  function calculateScore(answers, totalQuestions, scheme) {
    let score = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    answers.forEach(a => {
      if (a.skipped) {
        skipped++;
      } else if (a.correct) {
        correct++;
        score += (scheme === "jee" ? 4 : 1);
      } else {
        wrong++;
        score += (scheme === "jee" ? -1 : 0);
      }
    });

    const maxScore = scheme === "jee" ? totalQuestions * 4 : totalQuestions;
    const answeredCount = correct + wrong;
    const accuracy = answeredCount > 0 ? Math.round((correct / answeredCount) * 100) : 0;
    const overallPercent = totalQuestions > 0 ? Math.max(0, Math.round((score / maxScore) * 100)) : 0;

    let badge = { text: "Foundation Building", class: "blue" };
    if (accuracy >= 85 && answeredCount >= Math.min(5, totalQuestions)) {
      badge = { text: "🏆 JEE Advanced Ready", class: "gold" };
    } else if (accuracy >= 65) {
      badge = { text: "🎯 JEE Mains Qualified", class: "green" };
    } else {
      badge = { text: "📚 Focus Revision Needed", class: "blue" };
    }

    return {
      score,
      maxScore,
      correct,
      wrong,
      skipped,
      answeredCount,
      accuracy,
      overallPercent,
      badge
    };
  }

  root.QuizMarking = {
    calculateScore
  };

})(typeof window !== "undefined" ? window : globalThis);
