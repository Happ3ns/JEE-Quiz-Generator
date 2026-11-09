// ── 2026 Interactive 3D Realism, Tilt & Reactive Ambient Engine ──
(function (root) {
  "use strict";

  // 1. Interactive 3D Card Tilt with Holographic Cursor Glare
  function init3DTilt() {
    const cardSelectors = [
      ".subject-card",
      ".mock-card",
      ".topic-node-card",
      ".preset-tile",
      ".section-switch-card",
      ".stat-box",
      ".option-row"
    ];

    function attachCardEffects(card) {
      if (card._hasTiltEffect) return;
      card._hasTiltEffect = true;

      // Ensure sheen overlay exists
      if (!card.querySelector(".card-sheen-overlay")) {
        const sheen = document.createElement("div");
        sheen.className = "card-sheen-overlay";
        card.appendChild(sheen);
      }

      let isHovered = false;

      card.addEventListener("mouseenter", () => {
        isHovered = true;
      });

      card.addEventListener("mousemove", (e) => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;  // 0 to 1
        const y = (e.clientY - rect.top) / rect.height;  // 0 to 1

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", mouseX + "px");
        card.style.setProperty("--mouse-y", mouseY + "px");

        // Subtle 3D tilt calculation
        const rotX = (0.5 - y) * 12; // -6 to +6 deg
        const rotY = (x - 0.5) * 12; // -6 to +6 deg

        card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px) scale3d(1.015, 1.015, 1.015)`;
      });

      card.addEventListener("mouseleave", () => {
        isHovered = false;
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)";
      });
    }

    function scanAndAttach() {
      cardSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(attachCardEffects);
      });
    }

    // Initial scan and observer for dynamically inserted nodes
    scanAndAttach();

    const observer = new MutationObserver(() => {
      scanAndAttach();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 2. Magnetic Button Snap Effect
  function initMagneticButtons() {
    const magneticSelectors = [".btn-launch", ".btn-next"];

    function attachMagnetic(btn) {
      if (btn._hasMagnetic) return;
      btn._hasMagnetic = true;

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - btnCenterX) * 0.22;
        const deltaY = (e.clientY - btnCenterY) * 0.22;

        btn.style.transform = `translate(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0px, 0px)";
      });
    }

    document.querySelectorAll(magneticSelectors.join(", ")).forEach(attachMagnetic);

    const observer = new MutationObserver(() => {
      document.querySelectorAll(magneticSelectors.join(", ")).forEach(attachMagnetic);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 3. Subtle Ambient Quantum Particle Canvas
  function initAmbientCanvas() {
    let canvas = document.getElementById("ambientCanvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "ambientCanvas";
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(32, Math.floor((width * height) / 35000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? "rgba(6, 182, 212, " : i % 3 === 1 ? "rgba(16, 185, 129, " : "rgba(99, 102, 241, "
      });
    }

    let mouse = { x: -1000, y: -1000 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function loop() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Mouse subtle attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          p.x += (dx / dist) * 0.4;
          p.y += (dy / dist) * 0.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "0.65)";
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist2 / 110) * 0.08})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(loop);
    }

    loop();
  }

  // 4. Smooth Number Rolling Odometer Animation
  function animateNumber(el, start, end, duration = 800, suffix = "") {
    if (!el) return;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = end + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  // Expose API
  root.Interactive3D = {
    init: function () {
      initAmbientCanvas();
      init3DTilt();
      initMagneticButtons();
    },
    animateNumber: animateNumber
  };

  // Auto initialize on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", root.Interactive3D.init);
  } else {
    root.Interactive3D.init();
  }

})(typeof window !== "undefined" ? window : globalThis);
