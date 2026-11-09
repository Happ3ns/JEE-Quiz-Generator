// ── Syllabus & Module Explorer (Sections, Subsections & Sub-subsections) ──
(function (root) {
  "use strict";

  let activeSubjectFilter = "all";
  let activeSearchTerm = "";

  function renderSyllabusView(container) {
    if (!container) return;

    const taxonomy = (root.QuizTaxonomy && root.QuizTaxonomy.getTaxonomy) ? root.QuizTaxonomy.getTaxonomy() : [];
    const stats = (root.QuizState && root.QuizState.topicWeaknessSummary) ? root.QuizState.topicWeaknessSummary() : {};

    container.innerHTML = `
      <div class="card" style="margin-bottom: 24px;">
        <div class="syllabus-header">
          <div class="hero-pill">JEE 2026 OFFICIAL SYLLABUS MATRIX</div>
          <h2 style="font-size: clamp(1.8rem, 3vw, 2.3rem); font-weight:800; color:#fff; letter-spacing:-0.03em;">
            Explore by <span class="gradient-text">Section, Unit &amp; Topic</span>
          </h2>
          <p style="color:var(--ink-secondary); font-size:14.5px; margin-top:6px;">
            Three-tier hierarchical syllabus breakdown. Track per-topic mastery and launch targeted 10-question drills on any specific sub-subsection.
          </p>

          <!-- Search & Filter Controls -->
          <div class="syllabus-controls-row">
            <div class="syllabus-search">
              <span>🔍</span>
              <input type="text" id="syllabusSearchInput" placeholder="Search topics, e.g. Kinematics, Matrices, Thermodynamics..." value="${activeSearchTerm}">
            </div>
            <div class="filter-pills" id="syllabusFilterPills">
              <button class="filter-pill ${activeSubjectFilter === 'all' ? 'active' : ''}" data-filter="all" type="button">All Sections</button>
              <button class="filter-pill ${activeSubjectFilter === 'Physics' ? 'active' : ''}" data-filter="Physics" type="button">⚛️ Physics</button>
              <button class="filter-pill ${activeSubjectFilter === 'Chemistry' ? 'active' : ''}" data-filter="Chemistry" type="button">🧪 Chemistry</button>
              <button class="filter-pill ${activeSubjectFilter === 'Mathematics' ? 'active' : ''}" data-filter="Mathematics" type="button">📐 Mathematics</button>
              <button class="filter-pill ${activeSubjectFilter === 'weak' ? 'active' : ''}" data-filter="weak" type="button">⚠️ Needs Revision</button>
            </div>
          </div>
        </div>
      </div>

      <div id="syllabusSectionsList"></div>
    `;

    // Wire Search Input
    const searchInput = container.querySelector("#syllabusSearchInput");
    searchInput.addEventListener("input", (e) => {
      activeSearchTerm = e.target.value.toLowerCase().trim();
      renderSectionsList(container, taxonomy, stats);
    });

    // Wire Filter Pills
    const filterPills = container.querySelectorAll("#syllabusFilterPills .filter-pill");
    filterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        filterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        activeSubjectFilter = pill.getAttribute("data-filter");
        renderSectionsList(container, taxonomy, stats);
      });
    });

    renderSectionsList(container, taxonomy, stats);
  }

  function renderSectionsList(container, taxonomy, stats) {
    const listContainer = container.querySelector("#syllabusSectionsList");
    if (!listContainer) return;

    listContainer.innerHTML = "";

    taxonomy.forEach(section => {
      // Filter by subject
      if (activeSubjectFilter !== "all" && activeSubjectFilter !== "weak" && activeSubjectFilter !== section.name) {
        return;
      }

      // Filter subsections & sub-subsections
      const filteredSubsections = [];

      section.subsections.forEach(sub => {
        const filteredTopics = sub.topics.filter(topic => {
          const matchesSearch = !activeSearchTerm || topic.toLowerCase().includes(activeSearchTerm) || sub.name.toLowerCase().includes(activeSearchTerm);
          if (!matchesSearch) return false;

          if (activeSubjectFilter === "weak") {
            const topicStat = stats[topic];
            return topicStat && topicStat.total >= 2 && (topicStat.correct / topicStat.total) < 0.6;
          }
          return true;
        });

        if (filteredTopics.length > 0) {
          filteredSubsections.push({ ...sub, topics: filteredTopics });
        }
      });

      if (!filteredSubsections.length) return;

      // Section Block (Level 1)
      const sectionEl = document.createElement("div");
      sectionEl.className = "section-block";
      sectionEl.setAttribute("data-subject", section.name);

      let totalTopicsInSection = 0;
      filteredSubsections.forEach(s => totalTopicsInSection += s.topics.length);

      sectionEl.innerHTML = `
        <div class="section-header">
          <div class="section-title-wrap">
            <div class="section-icon-box">${section.icon}</div>
            <div>
              <h3>Section: ${section.name}</h3>
              <span style="font-size:12px; color:var(--ink-muted); font-family:var(--font-mono);">${filteredSubsections.length} Units · ${totalTopicsInSection} Topics</span>
            </div>
          </div>
          <span class="section-progress-pill">Core Syllabus</span>
        </div>
        <div class="subsections-wrapper"></div>
      `;

      const subWrapper = sectionEl.querySelector(".subsections-wrapper");

      // Subsection Blocks (Level 2)
      filteredSubsections.forEach(sub => {
        const subGroup = document.createElement("div");
        subGroup.className = "subsection-group";

        subGroup.innerHTML = `
          <div class="subsection-header">
            <div class="subsection-title">
              <span>${sub.icon}</span>
              <span>Unit: ${sub.name}</span>
            </div>
            <span class="subsection-desc">${sub.desc}</span>
          </div>
          <div class="sub-subsection-grid"></div>
        `;

        const grid = subGroup.querySelector(".sub-subsection-grid");

        // Sub-subsection Cards (Level 3 - Topics)
        sub.topics.forEach(topic => {
          const topicStat = stats[topic];
          let statusBadge = '<span class="topic-node-badge">Not tested</span>';
          let accuracyText = "No attempts yet";

          if (topicStat && topicStat.total > 0) {
            const acc = Math.round((topicStat.correct / topicStat.total) * 100);
            accuracyText = `${acc}% accuracy (${topicStat.correct}/${topicStat.total})`;
            if (acc >= 75) {
              statusBadge = '<span class="topic-node-badge mastered">✓ Mastered</span>';
            } else if (acc < 60) {
              statusBadge = '<span class="topic-node-badge weak">⚠️ Revision</span>';
            } else {
              statusBadge = '<span class="topic-node-badge">Progressing</span>';
            }
          }

          const card = document.createElement("div");
          card.className = "topic-node-card";
          card.innerHTML = `
            <div class="topic-node-top">
              <span class="topic-node-name">${topic}</span>
              ${statusBadge}
            </div>
            <div class="topic-node-bottom">
              <span class="topic-accuracy-label">${accuracyText}</span>
              <button class="topic-drill-btn" type="button">Practice 10 Qs →</button>
            </div>
          `;

          // Quick Drill Handler
          card.querySelector(".topic-drill-btn").addEventListener("click", () => {
            if (root.QuizState && root.QuizState.state) {
              root.QuizState.state.subject = section.name;
              root.QuizState.state.focus = section.name + "|" + topic;
              root.QuizState.state.difficulty = "any";
              root.QuizState.state.count = 10;
              root.QuizState.state.mode = "practice";
            }
            if (root.QuizUI && root.QuizUI.startQuiz) {
              root.QuizUI.startQuiz();
            }
          });

          grid.appendChild(card);
        });

        subWrapper.appendChild(subGroup);
      });

      listContainer.appendChild(sectionEl);
    });

    if (!listContainer.children.length) {
      listContainer.innerHTML = `
        <div class="card" style="text-align:center; padding: 48px 24px;">
          <p style="font-size:18px; color:#fff; font-weight:600; margin-bottom:8px;">No matching topics found</p>
          <p style="color:var(--ink-secondary); font-size:14px;">Try searching with a broader keyword or switching filters.</p>
        </div>
      `;
    }
  }

  root.SyllabusView = {
    render: renderSyllabusView
  };

})(typeof window !== "undefined" ? window : globalThis);
