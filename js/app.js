// ── Application Entry Point & Event Wiring ──
(function (root) {
  "use strict";

  const { state, loadSettings, saveSettings, getWeakTopics } = root.QuizState;
  const { refreshSetupUI, startQuiz, skipQuestion, nextQuestion, showScreen, renderReviewList } = root.QuizUI;

  document.addEventListener("DOMContentLoaded", () => {
    loadSettings();

    // Date stamp
    const dateStamp = document.getElementById("dateStamp");
    if (dateStamp) {
      dateStamp.textContent = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }

    // Sound toggle
    const soundToggleBtn = document.getElementById("soundToggleBtn");
    if (soundToggleBtn) {
      const updateSoundIcon = () => {
        soundToggleBtn.innerHTML = state.soundEnabled ? '<span>🔊</span> Sound On' : '<span>🔇</span> Muted';
      };
      updateSoundIcon();
      soundToggleBtn.addEventListener("click", () => {
        state.soundEnabled = !state.soundEnabled;
        saveSettings();
        updateSoundIcon();
      });
    }

    // Quick Starts
    document.getElementById("warmupBtn")?.addEventListener("click", () => {
      state.subject = "Mixed";
      state.focus = "any";
      state.difficulty = "any";
      state.count = 10;
      state.mode = "practice";
      startQuiz();
    });

    document.getElementById("weakStartBtn")?.addEventListener("click", () => {
      const weak = getWeakTopics();
      if (weak.length) {
        state.subject = "Mixed";
        state.focus = "any"; // auto-selects from pool
        state.difficulty = "any";
        state.count = 10;
        state.mode = "practice";
        startQuiz();
      }
    });

    document.getElementById("mockStartBtn")?.addEventListener("click", () => {
      state.subject = "Mixed";
      state.focus = "any";
      state.difficulty = "any";
      state.count = 30; // 30 per subject
      state.mode = "mock";
      state.questionLimit = 90;
      startQuiz();
    });

    // Start Quiz Button
    document.getElementById("startBtn")?.addEventListener("click", () => {
      startQuiz();
    });

    // Quiz Action Buttons
    document.getElementById("nextBtn")?.addEventListener("click", () => {
      nextQuestion();
    });

    document.getElementById("skipBtn")?.addEventListener("click", () => {
      skipQuestion(false);
    });

    document.getElementById("quitBtn")?.addEventListener("click", () => {
      if (confirm("Quit current round and return to setup?")) {
        clearInterval(state.timerId);
        showScreen("setup");
        refreshSetupUI();
      }
    });

    // Results Actions
    document.getElementById("reviewBtn")?.addEventListener("click", () => {
      renderReviewList();
      document.getElementById("reviewList")?.scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("restartBtn")?.addEventListener("click", () => {
      showScreen("setup");
      refreshSetupUI();
    });

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      const quizScreen = document.getElementById("quizScreen");
      if (!quizScreen || quizScreen.classList.contains("hidden")) return;

      // 1-4 for options
      if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const options = document.querySelectorAll("#optionsList .option");
        if (options[idx] && options[idx].style.pointerEvents !== "none") {
          options[idx].click();
        }
      } else if (e.key === "Enter" || e.key === " ") {
        const nextBtn = document.getElementById("nextBtn");
        if (nextBtn && !nextBtn.disabled) {
          e.preventDefault();
          nextBtn.click();
        }
      } else if (e.key.toLowerCase() === "s") {
        const skipBtn = document.getElementById("skipBtn");
        if (skipBtn && !skipBtn.disabled) {
          e.preventDefault();
          skipBtn.click();
        }
      }
    });

    // Initial setup refresh
    refreshSetupUI();
  });

})(typeof window !== "undefined" ? window : globalThis);
