// ── High-Yield JEE Formula Vault ──
(function (root) {
  "use strict";

  const { getFormulas } = root.QuizTaxonomy;
  const { render: renderMath } = root.QuizMath;

  let activeFormulaSubject = "all";
  let formulaSearchQuery = "";

  function renderFormulasView(container) {
    if (!container) return;

    const records = getFormulas();

    container.innerHTML = `
      <div class="card" style="margin-bottom: 24px;">
        <div class="setup-hero" style="margin-bottom: 20px;">
          <div class="hero-pill">QUICK REFERENCE CHEAT SHEETS</div>
          <h2>High-Yield <span class="gradient-text">Formula Vault</span></h2>
          <p>Instant KaTeX-rendered mathematical and chemical relations categorized by subject and unit for rapid revision.</p>

          <div class="syllabus-controls-row">
            <div class="syllabus-search">
              <span>🔍</span>
              <input type="text" id="formulaSearchInput" placeholder="Filter equations, e.g. projectile, nernst, quadratic, integration..." value="${formulaSearchQuery}">
            </div>
            <div class="filter-pills" id="formulaFilterPills">
              <button class="filter-pill ${activeFormulaSubject === 'all' ? 'active' : ''}" data-filter="all" type="button">All Sections</button>
              <button class="filter-pill ${activeFormulaSubject === 'Physics' ? 'active' : ''}" data-filter="Physics" type="button">⚛️ Physics</button>
              <button class="filter-pill ${activeFormulaSubject === 'Chemistry' ? 'active' : ''}" data-filter="Chemistry" type="button">🧪 Chemistry</button>
              <button class="filter-pill ${activeFormulaSubject === 'Mathematics' ? 'active' : ''}" data-filter="Mathematics" type="button">📐 Mathematics</button>
            </div>
          </div>
        </div>
      </div>

      <div id="formulaCardsContainer"></div>
    `;

    const searchInput = container.querySelector("#formulaSearchInput");
    searchInput.addEventListener("input", (e) => {
      formulaSearchQuery = e.target.value.toLowerCase().trim();
      renderFormulaCards(container, records);
    });

    const filterPills = container.querySelectorAll("#formulaFilterPills .filter-pill");
    filterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        filterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        activeFormulaSubject = pill.getAttribute("data-filter");
        renderFormulaCards(container, records);
      });
    });

    renderFormulaCards(container, records);
  }

  function renderFormulaCards(container, records) {
    const cardContainer = container.querySelector("#formulaCardsContainer");
    if (!cardContainer) return;
    cardContainer.innerHTML = "";

    const filtered = records.filter(rec => {
      if (activeFormulaSubject !== "all" && rec.subject !== activeFormulaSubject) return false;
      if (!formulaSearchQuery) return true;
      const matchesTitle = rec.title.toLowerCase().includes(formulaSearchQuery);
      const matchesSub = rec.subsection.toLowerCase().includes(formulaSearchQuery);
      const matchesFormulas = rec.formulas.some(f => f.label.toLowerCase().includes(formulaSearchQuery));
      return matchesTitle || matchesSub || matchesFormulas;
    });

    if (!filtered.length) {
      cardContainer.innerHTML = `
        <div class="card" style="text-align:center; padding:48px 24px;">
          <p style="font-size:18px; color:#fff; font-weight:600; margin-bottom:8px;">No matching formulas found</p>
          <p style="color:var(--ink-secondary); font-size:14px;">Try searching for "kinematics", "nernst", "calculus", or "quadratic".</p>
        </div>
      `;
      return;
    }

    filtered.forEach(rec => {
      const block = document.createElement("div");
      block.className = "card formula-section";
      block.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:16px; border-bottom:1px solid var(--border-hairline); padding-bottom:12px; flex-wrap:wrap; gap:8px;">
          <div>
            <h3 style="font-size:17px; font-weight:700; color:#fff;">${rec.title}</h3>
            <span style="font-size:12px; color:var(--ink-muted); font-family:var(--font-mono);">${rec.subject} · ${rec.subsection}</span>
          </div>
          <span class="card-tag">${rec.formulas.length} relations</span>
        </div>
        <div class="formula-grid">
          ${rec.formulas.map(f => `
            <div class="formula-card">
              <strong>${f.label}</strong>
              <div class="formula-tex">$$${f.tex}$$</div>
            </div>
          `).join("")}
        </div>
      `;

      renderMath(block);
      cardContainer.appendChild(block);
    });
  }

  root.FormulasView = {
    render: renderFormulasView
  };

})(typeof window !== "undefined" ? window : globalThis);
