// ── KaTeX Math Auto-Renderer ──
(function (root) {
  "use strict";

  function renderMathInElement(elem) {
    if (!elem) return;
    if (typeof window.renderMathInElement === "function") {
      try {
        window.renderMathInElement(elem, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }

  root.QuizMath = {
    render: renderMathInElement
  };

})(typeof window !== "undefined" ? window : globalThis);
