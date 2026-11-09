// ── Application Entry Point & Event Wiring (Linear Obsidian UI) ──
(function (root) {
  "use strict";

  const { state, loadSettings, saveSettings, playSound, getWeakTopics } = root.QuizState;
  const { refreshSetupUI, startQuiz, skipQuestion, nextQuestion, showScreen, renderReviewList } = root.QuizUI;

  document.addEventListener("DOMContentLoaded", () => {
    loadSettings();

    // Date stamp in header
    const dateStamp = document.getElementById("dateStamp");
    if (dateStamp) {
      dateStamp.textContent = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }

    // Sound toggle button with modern SVG and animated EQ bars
    const soundToggleBtn = document.getElementById("soundToggleBtn");
    if (soundToggleBtn) {
      const updateSoundIcon = () => {
        const iconSvg = (root.QuizIcons && root.QuizIcons.get)
          ? root.QuizIcons.get(state.soundEnabled ? "soundOn" : "soundOff")
          : "";
        const eqHtml = state.soundEnabled
          ? '<span class="sound-eq sound-active"><span class="sound-bar"></span><span class="sound-bar"></span><span class="sound-bar"></span></span>'
          : '<span class="sound-eq"><span class="sound-bar" style="height:2px;"></span></span>';
        soundToggleBtn.innerHTML = `${iconSvg}<span>${state.soundEnabled ? "Sound On" : "Muted"}</span>${eqHtml}`;
      };
      updateSoundIcon();
      soundToggleBtn.addEventListener("click", () => {
        state.soundEnabled = !state.soundEnabled;
        saveSettings();
        updateSoundIcon();
        if (state.soundEnabled) playSound("click");
      });
    }

    // Wire Subject Cards
    const subjectCards = document.querySelectorAll("#subjectGrid .subject-card");
    subjectCards.forEach(card => {
      const selectSubject = () => {
        const sub = card.getAttribute("data-subject");
        if (sub) {
          state.subject = sub;
          state.focus = "any";
          playSound("click");
          refreshSetupUI();
        }
      };
      card.addEventListener("click", selectSubject);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectSubject();
        }
      });
    });

    // Wire Segmented Controls Helper
    function wireSegmented(controlId, onSelect) {
      const control = document.getElementById(controlId);
      if (!control) return;
      control.querySelectorAll(".segment-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const val = btn.getAttribute("data-val");
          playSound("click");
          onSelect(val);
          refreshSetupUI();
        });
      });
    }

    wireSegmented("difficultyControl", (val) => {
      state.difficulty = val;
    });

    wireSegmented("countControl", (val) => {
      state.count = parseInt(val, 10) || 10;
    });

    wireSegmented("markingControl", (val) => {
      state.markingScheme = val;
      saveSettings();
    });

    wireSegmented("timerControl", (val) => {
      state.questionLimit = parseInt(val, 10);
    });

    wireSegmented("modeControl", (val) => {
      state.mode = val;
    });

    // Focus Topic dropdown
    const topicSelect = document.getElementById("topicSelect");
    if (topicSelect) {
      topicSelect.addEventListener("change", () => {
        state.focus = topicSelect.value;
        refreshSetupUI();
      });
    }

    // Quick-Start Preset Buttons
    document.getElementById("warmupBtn")?.addEventListener("click", () => {
      playSound("click");
      state.subject = "Mixed";
      state.focus = "any";
      state.difficulty = "any";
      state.count = 10;
      state.mode = "practice";
      startQuiz();
    });

    document.getElementById("weakStartBtn")?.addEventListener("click", () => {
      playSound("click");
      const weak = getWeakTopics();
      if (weak.length) {
        state.subject = "Mixed";
        state.focus = "any";
        state.difficulty = "any";
        state.count = 10;
        state.mode = "practice";
        startQuiz();
      }
    });

    document.getElementById("mockStartBtn")?.addEventListener("click", () => {
      playSound("click");
      state.subject = "Mixed";
      state.focus = "any";
      state.difficulty = "any";
      state.count = 30; // 30 per subject = 90 total
      state.mode = "mock";
      state.questionLimit = 90;
      startQuiz();
    });

    // Main Start Button
    document.getElementById("startBtn")?.addEventListener("click", () => {
      playSound("click");
      startQuiz();
    });

    // Quiz Navigation Buttons
    document.getElementById("nextBtn")?.addEventListener("click", () => {
      nextQuestion();
    });

    document.getElementById("skipBtn")?.addEventListener("click", () => {
      skipQuestion(false);
    });

    document.getElementById("quitBtn")?.addEventListener("click", () => {
      if (confirm("Are you sure you want to end this session? Progress will be lost.")) {
        clearInterval(state.timerId);
        showScreen("setup");
        refreshSetupUI();
      }
    });

    // Results Actions
    document.getElementById("reviewBtn")?.addEventListener("click", () => {
      playSound("click");
      renderReviewList();
      const revList = document.getElementById("reviewList");
      if (revList) revList.scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("restartBtn")?.addEventListener("click", () => {
      playSound("click");
      showScreen("setup");
      refreshSetupUI();
    });

    // Global Power-User Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      // If typing in an input or select, skip shortcuts
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

      const quizScreen = document.getElementById("quizScreen");
      const isQuizActive = quizScreen && !quizScreen.classList.contains("hidden");

      if (isQuizActive) {
        // Quiz Screen Shortcuts
        const optKeys = ["1", "2", "3", "4", "a", "b", "c", "d"];
        const keyLower = e.key.toLowerCase();
        if (optKeys.includes(keyLower)) {
          let idx = -1;
          if (["1", "2", "3", "4"].includes(keyLower)) {
            idx = parseInt(keyLower, 10) - 1;
          } else {
            idx = ["a", "b", "c", "d"].indexOf(keyLower);
          }
          const options = document.querySelectorAll("#optionsGrid .option-row");
          if (options[idx] && options[idx].style.pointerEvents !== "none") {
            e.preventDefault();
            options[idx].click();
          }
        } else if (e.key === "Enter" || e.key === " ") {
          const nextBtn = document.getElementById("nextBtn");
          if (nextBtn && !nextBtn.disabled) {
            e.preventDefault();
            nextBtn.click();
          }
        } else if (keyLower === "s") {
          const skipBtn = document.getElementById("skipBtn");
          if (skipBtn && !skipBtn.disabled) {
            e.preventDefault();
            skipBtn.click();
          }
        } else if (e.key === "Escape") {
          const quitBtn = document.getElementById("quitBtn");
          if (quitBtn) quitBtn.click();
        }
      } else {
        // Setup Screen Keyboard Shortcuts
        const setupScreen = document.getElementById("setupScreen");
        const isSetupActive = setupScreen && !setupScreen.classList.contains("hidden");
        if (isSetupActive) {
          if (["1", "2", "3", "4"].includes(e.key)) {
            const subjects = ["Physics", "Chemistry", "Mathematics", "Mixed"];
            const sub = subjects[parseInt(e.key, 10) - 1];
            if (sub) {
              e.preventDefault();
              state.subject = sub;
              state.focus = "any";
              playSound("click");
              refreshSetupUI();
            }
          } else if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("startBtn")?.click();
          }
        }
      }
    });

    // Initialize Multi-Page Router
    if (root.QuizRouter && root.QuizRouter.init) {
      root.QuizRouter.init();
    } else {
      refreshSetupUI();
    }
  });

})(typeof window !== "undefined" ? window : globalThis);
