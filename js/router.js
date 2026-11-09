// ── Client-Side Hash Router & Multi-Page View Switcher ──
(function (root) {
  "use strict";

  const VIEWS = ["practice", "syllabus", "mock", "analytics", "formulas"];
  let currentView = "practice";

  function initRouter() {
    // Wire Nav Tabs
    const navTabs = document.querySelectorAll(".app-nav .nav-tab");
    navTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const targetView = tab.getAttribute("data-view");
        if (targetView && VIEWS.includes(targetView)) {
          navigateTo(targetView);
        }
      });
    });

    // Listen to hash change
    window.addEventListener("hashchange", handleHashChange);

    // Initial route based on URL hash
    handleHashChange();
  }

  function handleHashChange() {
    const rawHash = (window.location.hash || "").replace(/^#/, "").trim();
    if (VIEWS.includes(rawHash)) {
      navigateTo(rawHash, false);
    } else {
      navigateTo("practice", false);
    }
  }

  function navigateTo(viewName, updateHash = true) {
    if (!VIEWS.includes(viewName)) viewName = "practice";
    currentView = viewName;

    if (updateHash && window.location.hash !== "#" + viewName) {
      window.location.hash = viewName;
    }

    // Hide active quiz or results if user manually navigates views
    const quizScreen = document.getElementById("quizScreen");
    const resultsScreen = document.getElementById("resultsScreen");
    if (quizScreen && !quizScreen.classList.contains("hidden")) {
      if (typeof root.QuizState !== "undefined" && root.QuizState.state) {
        clearInterval(root.QuizState.state.timerId);
      }
      quizScreen.classList.add("hidden");
    }
    if (resultsScreen) resultsScreen.classList.add("hidden");

    // Show Nav Bar
    const navBar = document.querySelector(".app-nav");
    if (navBar) navBar.classList.remove("hidden");

    // Update Tab UI
    document.querySelectorAll(".app-nav .nav-tab").forEach(tab => {
      const isTarget = tab.getAttribute("data-view") === viewName;
      tab.classList.toggle("active", isTarget);
      tab.setAttribute("aria-selected", isTarget ? "true" : "false");
    });

    // Switch View Containers
    VIEWS.forEach(v => {
      const viewEl = document.getElementById("view-" + v);
      if (viewEl) {
        viewEl.classList.toggle("hidden", v !== viewName);
      }
    });

    // Render Dynamic Views safely
    try {
      if (viewName === "syllabus" && root.SyllabusView && root.SyllabusView.render) {
        root.SyllabusView.render(document.getElementById("view-syllabus"));
      } else if (viewName === "mock" && root.MockView && root.MockView.render) {
        root.MockView.render(document.getElementById("view-mock"));
      } else if (viewName === "analytics" && root.AnalyticsView && root.AnalyticsView.render) {
        root.AnalyticsView.render(document.getElementById("view-analytics"));
      } else if (viewName === "formulas" && root.FormulasView && root.FormulasView.render) {
        root.FormulasView.render(document.getElementById("view-formulas"));
      } else if (viewName === "practice") {
        if (root.QuizUI && root.QuizUI.refreshSetupUI) {
          root.QuizUI.refreshSetupUI();
        }
      }
    } catch (err) {
      console.error("View rendering error in " + viewName + ":", err);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getCurrentView() {
    return currentView;
  }

  root.QuizRouter = {
    init: initRouter,
    navigateTo,
    getCurrentView
  };

})(typeof window !== "undefined" ? window : globalThis);
