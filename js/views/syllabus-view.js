// ── Syllabus & Module Explorer (Distinct Sections, Bite-Sized Units & Topics) ──
(function (root) {
  "use strict";

  let activeSubjectFilter = "Physics"; // Default to Physics for immediate focused view
  let activeSearchTerm = "";

  function renderSyllabusView(container) {
    if (!container) return;

    const taxonomy = (root.QuizTaxonomy && root.QuizTaxonomy.getTaxonomy) ? root.QuizTaxonomy.getTaxonomy() : [];
    const stats = (root.QuizState && root.QuizState.topicWeaknessSummary) ? root.QuizState.topicWeaknessSummary() : {};
    const icons = root.QuizIcons || { get: () => "" };

    container.innerHTML = `
      <div class="card" style="margin-bottom: 24px;">
        <div class="syllabus-header">
          <div class="hero-pill">JEE 2026 OFFICIAL SYLLABUS MATRIX</div>
          <h2 style="font-size: clamp(1.8rem, 3vw, 2.3rem); font-weight:800; color:#fff; letter-spacing:-0.03em;">
            Explore by <span class="gradient-text">Section, Unit &amp; Topic</span>
          </h2>
          <p style="color:var(--ink-secondary); font-size:14.5px; margin-top:6px;">
            Bite-sized concept summaries, key high-yield formulas, and focused 10-question practice drills. Select a subject below to drill down into its units.
          </p>

          <!-- 3 Distinct Main Subject Cards -->
          <div class="section-switcher-grid" id="syllabusSectionSwitchers" style="margin-top: 24px;">
            <div class="section-switch-card" data-subject="Physics" data-active="${activeSubjectFilter === 'Physics' ? 'true' : 'false'}" role="button" tabindex="0">
              <div class="switch-icon">${icons.get("atom")}</div>
              <div>
                <span class="switch-title">Physics</span>
                <span class="switch-sub">3 Units · 13 Topics</span>
              </div>
            </div>

            <div class="section-switch-card" data-subject="Chemistry" data-active="${activeSubjectFilter === 'Chemistry' ? 'true' : 'false'}" role="button" tabindex="0">
              <div class="switch-icon">${icons.get("flask")}</div>
              <div>
                <span class="switch-title">Chemistry</span>
                <span class="switch-sub">3 Units · 18 Topics</span>
              </div>
            </div>

            <div class="section-switch-card" data-subject="Mathematics" data-active="${activeSubjectFilter === 'Mathematics' ? 'true' : 'false'}" role="button" tabindex="0">
              <div class="switch-icon">${icons.get("pi")}</div>
              <div>
                <span class="switch-title">Mathematics</span>
                <span class="switch-sub">3 Units · 21 Topics</span>
              </div>
            </div>
          </div>

          <!-- Search & Filter Controls -->
          <div class="syllabus-controls-row">
            <div class="syllabus-search">
              <span>${icons.get("search")}</span>
              <input type="text" id="syllabusSearchInput" placeholder="Search topics, e.g. Kinematics, Matrices, Thermodynamics..." value="${activeSearchTerm}">
            </div>
            <div class="filter-pills" id="syllabusFilterPills">
              <button class="filter-pill ${activeSubjectFilter === 'all' ? 'active' : ''}" data-filter="all" type="button">All Sections</button>
              <button class="filter-pill ${activeSubjectFilter === 'Physics' ? 'active' : ''}" data-filter="Physics" type="button">${icons.get("atom")} Physics</button>
              <button class="filter-pill ${activeSubjectFilter === 'Chemistry' ? 'active' : ''}" data-filter="Chemistry" type="button">${icons.get("flask")} Chemistry</button>
              <button class="filter-pill ${activeSubjectFilter === 'Mathematics' ? 'active' : ''}" data-filter="Mathematics" type="button">${icons.get("pi")} Mathematics</button>
              <button class="filter-pill ${activeSubjectFilter === 'weak' ? 'active' : ''}" data-filter="weak" type="button">${icons.get("zap")} Needs Revision</button>
            </div>
          </div>
        </div>
      </div>

      <div id="syllabusSectionsList"></div>
    `;

    // Wire Top Switcher Cards
    const switchCards = container.querySelectorAll("#syllabusSectionSwitchers .section-switch-card");
    switchCards.forEach(card => {
      card.addEventListener("click", () => {
        const sub = card.getAttribute("data-subject");
        activeSubjectFilter = sub;
        updateSwitcherUI(container);
        renderSectionsList(container, taxonomy, stats);
      });
    });

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
        activeSubjectFilter = pill.getAttribute("data-filter");
        updateSwitcherUI(container);
        renderSectionsList(container, taxonomy, stats);
      });
    });

    // Initial render of sections list
    renderSectionsList(container, taxonomy, stats);
  }

  function updateSwitcherUI(container) {
    const switchCards = container.querySelectorAll("#syllabusSectionSwitchers .section-switch-card");
    switchCards.forEach(card => {
      const sub = card.getAttribute("data-subject");
      card.setAttribute("data-active", sub === activeSubjectFilter ? "true" : "false");
    });

    const filterPills = container.querySelectorAll("#syllabusFilterPills .filter-pill");
    filterPills.forEach(pill => {
      const filter = pill.getAttribute("data-filter");
      pill.classList.toggle("active", filter === activeSubjectFilter);
    });
  }

  function renderSectionsList(container, taxonomy, stats) {
    const listContainer = container.querySelector("#syllabusSectionsList");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    const icons = root.QuizIcons || { get: () => "" };

    const weakTopicsSet = new Set(
      Object.keys(stats).filter(t => stats[t].total > 0 && (stats[t].correct / stats[t].total) < 0.6)
    );

    taxonomy.forEach(section => {
      if (activeSubjectFilter !== "all" && activeSubjectFilter !== "weak" && section.name !== activeSubjectFilter) {
        return;
      }

      // Filter subsections & topics
      const filteredSubsections = [];
      section.subsections.forEach(sub => {
        const matchingTopics = sub.topics.filter(t => {
          const tName = typeof t === "string" ? t : t.name;
          const tSummary = t.summary || "";
          const tFormula = t.formula || "";

          // Weak topic filter
          if (activeSubjectFilter === "weak" && !weakTopicsSet.has(tName)) {
            return false;
          }

          // Search term filter
          if (activeSearchTerm) {
            const matchesName = tName.toLowerCase().includes(activeSearchTerm);
            const matchesSummary = tSummary.toLowerCase().includes(activeSearchTerm);
            const matchesFormula = tFormula.toLowerCase().includes(activeSearchTerm);
            const matchesSub = sub.name.toLowerCase().includes(activeSearchTerm);
            return matchesName || matchesSummary || matchesFormula || matchesSub;
          }

          return true;
        });

        if (matchingTopics.length > 0) {
          filteredSubsections.push({
            ...sub,
            topics: matchingTopics
          });
        }
      });

      if (filteredSubsections.length === 0) return;

      const sectionEl = document.createElement("div");
      sectionEl.className = "section-block";
      sectionEl.setAttribute("data-subject", section.name);

      let totalTopicsInSection = 0;
      filteredSubsections.forEach(s => totalTopicsInSection += s.topics.length);

      const sectionIconSvg = section.name === "Physics"
        ? icons.get("atom")
        : section.name === "Chemistry"
        ? icons.get("flask")
        : icons.get("pi");

      sectionEl.innerHTML = `
        <div class="section-header">
          <div class="section-title-wrap">
            <div class="section-icon-box">${sectionIconSvg}</div>
            <div>
              <h3>Section: ${section.name}</h3>
              <span class="section-tagline">${section.tagline || 'CORE SYLLABUS'}</span>
            </div>
          </div>
          <span class="section-progress-pill">${filteredSubsections.length} Units · ${totalTopicsInSection} Topics</span>
        </div>
        <div class="subsections-wrapper"></div>
      `;

      const subWrapper = sectionEl.querySelector(".subsections-wrapper");

      // Subsection Blocks (Level 2) - Collapsible Accordion
      filteredSubsections.forEach((sub, subIdx) => {
        const subGroup = document.createElement("div");
        // Open by default for first unit or when single subject is active
        const isOpen = activeSubjectFilter !== "all" || subIdx === 0 || activeSearchTerm.length > 0;
        subGroup.className = "subsection-group " + (isOpen ? "open" : "");

        subGroup.innerHTML = `
          <div class="subsection-header" role="button" tabindex="0">
            <div>
              <div class="subsection-title">
                <span class="unit-icon">${icons.get("layers")}</span>
                <span>Unit: ${sub.name}</span>
              </div>
              <p class="subsection-desc">${sub.desc}</p>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="card-tag" style="font-size:11px;">${sub.topics.length} Topics</span>
              <span class="unit-chevron">${icons.get("chevronRight")}</span>
            </div>
          </div>
          <div class="subsection-body">
            <div class="sub-subsection-grid"></div>
          </div>
        `;

        // Toggle handler
        const headerEl = subGroup.querySelector(".subsection-header");
        headerEl.addEventListener("click", () => {
          subGroup.classList.toggle("open");
        });
        headerEl.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            subGroup.classList.toggle("open");
          }
        });

        const grid = subGroup.querySelector(".sub-subsection-grid");

        // Sub-subsection Cards (Level 3 - Bite-Sized Topic Nodes)
        sub.topics.forEach(tObj => {
          const tName = typeof tObj === "string" ? tObj : tObj.name;
          const summary = tObj.summary || "High-yield JEE Mains & Advanced problem solving module.";
          const formula = tObj.formula || "";
          const weight = tObj.weight || "Core Fundamental";

          let weightClass = "core";
          let weightIcon = icons.get("zap");
          if (weight === "High Weightage") {
            weightClass = "high-weight";
            weightIcon = icons.get("flame");
          } else if (weight === "High Scoring") {
            weightClass = "scoring";
            weightIcon = icons.get("target");
          }

          const topicStat = stats[tName];
          let accuracyLabel = "No attempts yet";
          let accuracyClass = "";

          if (topicStat && topicStat.total > 0) {
            const acc = Math.round((topicStat.correct / topicStat.total) * 100);
            accuracyLabel = `${acc}% accuracy (${topicStat.correct}/${topicStat.total})`;
            if (acc >= 75) accuracyClass = "mastered";
            else if (acc < 60) accuracyClass = "weak";
          }

          const card = document.createElement("div");
          card.className = "topic-node-card";
          card.innerHTML = `
            <div>
              <div class="topic-node-top">
                <span class="topic-node-name">${tName}</span>
                <span class="topic-weight-badge ${weightClass}">${weightIcon} ${weight}</span>
              </div>
              <p class="topic-summary-text" style="margin-top:6px;">${summary}</p>
              ${formula ? `<div style="margin-top:8px;"><span class="topic-formula-chip"><code>${formula}</code></span></div>` : ''}
            </div>

            <div class="topic-node-bottom">
              <span class="topic-accuracy-label ${accuracyClass}">${accuracyLabel}</span>
              <button class="topic-drill-btn" type="button">
                <span>Practice 10 Qs</span>
                ${icons.get("arrowRight")}
              </button>
            </div>
          `;

          // Quick Drill Handler
          card.querySelector(".topic-drill-btn").addEventListener("click", () => {
            if (root.QuizState && root.QuizState.state) {
              root.QuizState.state.subject = section.name;
              root.QuizState.state.focus = section.name + "|" + tName;
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
