// ── Mock Exam Simulation Center ──
(function (root) {
  "use strict";

  function renderMockView(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="margin-bottom: 24px;">
        <div class="setup-hero" style="margin-bottom: 12px;">
          <div class="hero-pill">NTA JEE MAINS COMPUTER-BASED TEST SIMULATOR</div>
          <h2>Full Mock <span class="gradient-text">Exam Testing Center</span></h2>
          <p>
            Standard JEE Mains timed mock testing environment with section navigation, realistic +4 / -1 negative marking, and post-exam worked review.
          </p>
        </div>

        <div class="mock-center-grid">
          <!-- Full Mock Exam -->
          <div class="mock-card">
            <div>
              <span class="mock-card-badge" style="background:var(--accent-indigo-soft); color:var(--accent-indigo); border:1px solid rgba(99,102,241,0.3);">
                FULL SIMULATION
              </span>
              <strong>Full JEE Mains Mock</strong>
              <p>Complete 90-question test session distributed equally across Chemistry, Physics, and Mathematics with standard timer.</p>
            </div>
            <div>
              <div class="mock-meta-row" style="margin-bottom: 16px;">
                <span>90 Questions</span>
                <span>30/Subject</span>
                <span>90s / Q</span>
                <span>+4 / -1 JEE</span>
              </div>
              <button class="btn-launch" id="launchFullMockBtn" type="button" style="width:100%; justify-content:center;">
                <span>Launch Full Mock</span> <span>→</span>
              </button>
            </div>
          </div>

          <!-- 45-Min Sprint Mock -->
          <div class="mock-card">
            <div>
              <span class="mock-card-badge" style="background:var(--accent-cyan-soft); color:var(--accent-cyan); border:1px solid rgba(6,182,212,0.3);">
                SPEED SPRINT
              </span>
              <strong>Rapid 45-Min Sprint</strong>
              <p>Fast-paced 30-question mixed round designed to train speed, immediate formula recall, and rapid option elimination.</p>
            </div>
            <div>
              <div class="mock-meta-row" style="margin-bottom: 16px;">
                <span>30 Questions</span>
                <span>10/Subject</span>
                <span>60s / Q</span>
                <span>+4 / -1 JEE</span>
              </div>
              <button class="btn-launch" id="launchSprintMockBtn" type="button" style="width:100%; justify-content:center; background:linear-gradient(135deg, #06b6d4, #0284c7);">
                <span>Launch Sprint Mock</span> <span>→</span>
              </button>
            </div>
          </div>

          <!-- Advanced Hard Tier -->
          <div class="mock-card">
            <div>
              <span class="mock-card-badge" style="background:var(--accent-amber-soft); color:var(--accent-amber); border:1px solid rgba(245,158,11,0.3);">
                ADVANCED TIER
              </span>
              <strong>Challenger Hard Round</strong>
              <p>Curated set of high-difficulty multi-concept problems across Mechanics, Thermodynamics, and Calculus.</p>
            </div>
            <div>
              <div class="mock-meta-row" style="margin-bottom: 16px;">
                <span>20 Questions</span>
                <span>Hard Only</span>
                <span>90s / Q</span>
                <span>+4 / -1 JEE</span>
              </div>
              <button class="btn-launch" id="launchChallengerBtn" type="button" style="width:100%; justify-content:center; background:linear-gradient(135deg, #f59e0b, #d97706);">
                <span>Launch Challenger</span> <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const playSound = (t) => { if (root.QuizState && root.QuizState.playSound) root.QuizState.playSound(t); };
    const getState = () => (root.QuizState ? root.QuizState.state : {});
    const startQuiz = () => { if (root.QuizUI && root.QuizUI.startQuiz) root.QuizUI.startQuiz(); };

    // Event listeners
    container.querySelector("#launchFullMockBtn")?.addEventListener("click", () => {
      playSound("click");
      const st = getState();
      st.subject = "Mixed";
      st.focus = "any";
      st.difficulty = "any";
      st.count = 30; // 30 per subject = 90 total
      st.mode = "mock";
      st.markingScheme = "jee";
      st.questionLimit = 90;
      startQuiz();
    });

    container.querySelector("#launchSprintMockBtn")?.addEventListener("click", () => {
      playSound("click");
      const st = getState();
      st.subject = "Mixed";
      st.focus = "any";
      st.difficulty = "any";
      st.count = 10; // 10 per subject = 30 total
      st.mode = "mock";
      st.markingScheme = "jee";
      st.questionLimit = 60;
      startQuiz();
    });

    container.querySelector("#launchChallengerBtn")?.addEventListener("click", () => {
      playSound("click");
      const st = getState();
      st.subject = "Mixed";
      st.focus = "any";
      st.difficulty = "hard";
      st.count = 20;
      st.mode = "mock";
      st.markingScheme = "jee";
      st.questionLimit = 90;
      startQuiz();
    });
  }

  root.MockView = {
    render: renderMockView
  };

})(typeof window !== "undefined" ? window : globalThis);
