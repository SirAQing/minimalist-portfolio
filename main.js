(function () {
  "use strict";

  // ── 1. Theme Toggle ───
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    root.setAttribute("data-theme", "dark");
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    if (isDark) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      toggle.textContent = "🌙";
    } else {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      toggle.textContent = "☀️";
    }
  });

  // ── 2. Nav Scroll Spy ───
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = document.querySelectorAll(".section[id]");

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.2, rootMargin: "-60px 0px -35% 0px" }
  );

  sections.forEach((s) => spyObserver.observe(s));

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ── 3. Scroll Reveal ───
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          const selectors = [
            ".skill-cell", ".exp-card", ".project-card",
            ".social-card", ".teaching-card", ".formation-item",
            ".cert-item", ".skill-group",
          ];

          selectors.forEach((sel) => {
            const items = entry.target.querySelectorAll(sel);
            items.forEach((item, i) => {
              item.style.setProperty("--stagger-delay", `${i * 70}ms`);
              item.classList.add("stagger-in");
            });
          });
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".section").forEach((el) => revealObserver.observe(el));

  // ── 4. Particle Network (Hero background) ───
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const PARTICLE_COUNT = 50;
    const CONNECTION_DIST = 140;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.size = Math.random() * 1.2 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 115, 22, 0.3)";
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.08 * (1 - dist / CONNECTION_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();
    window.addEventListener("resize", () => { resizeCanvas(); initParticles(); });
  }

  // ── 5. Console Easter Egg ───
  const egg = [
    "%c  ██████╗ ██╗   ██╗███████╗███████╗██████╗ ",
    "%c ██╔═══██╗██║   ██║██╔════╝██╔════╝██╔══██╗",
    "%c ██║   ██║██║   ██║█████╗  █████╗  ██████╔╝",
    "%c ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══╝  ██╔══██╗",
    "%c ╚██████╔╝ ╚████╔╝ ███████╗███████╗██║  ██║",
    "%c  ╚═════╝   ╚═══╝  ╚══════╝╚══════╝╚═╝  ╚═╝",
  ];
  const colors = ["#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12", "#7c2d12"];
  egg.forEach((line, i) => {
    console.log(line, `color: ${colors[i]}; font-size: 14px; font-weight: bold; font-family: monospace;`);
  });
  console.log(
    "%c🚀 数据应该驱动决策，代码应该让数据流动。 → hi@santifer.io",
    "background: #f97316; color: #fff; font-size: 13px; font-weight: bold; padding: 6px 10px; border-radius: 4px;"
  );

  // ── 6. Pet Characters ───
  const petContainer = document.createElement("div");
  petContainer.id = "pet-container";
  petContainer.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;overflow:hidden;";
  document.body.appendChild(petContainer);

  const petImages = [
    { src: "assets/claude-code.png", size: 60 },
  ];

  const petEls = [];

  petImages.forEach((info) => {
    const el = document.createElement("div");
    el.style.cssText = `position:absolute;width:${info.size}px;height:${info.size}px;transition:none;`;
    const img = document.createElement("img");
    img.src = info.src;
    img.style.cssText =
      "width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0 6px rgba(249,115,22,0.15));";
    img.style.pointerEvents = "none";
    el.appendChild(img);
    petContainer.appendChild(el);

    petEls.push({
      el,
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: Math.random() * (window.innerHeight - 100) + 50,
      vx: 0,
      vy: 0,
      targetX: 0,
      targetY: 0,
      hasTarget: false,
    });
  });

  document.addEventListener("click", (e) => {
    petEls.forEach((pet, i) => {
      pet.hasTarget = true;
      pet.targetX = e.clientX + (i === 0 ? -50 : 50);
      pet.targetY = e.clientY;
    });
  });

  function animatePets() {
    petEls.forEach((pet) => {
      if (pet.hasTarget) {
        const dx = pet.targetX - pet.x;
        const dy = pet.targetY - pet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
          pet.hasTarget = false;
          pet.vx = 0;
          pet.vy = 0;
        } else {
          pet.vx += dx * 0.015;
          pet.vy += dy * 0.015;
          pet.vx *= 0.88;
          pet.vy *= 0.88;
          pet.x += pet.vx;
          pet.y += pet.vy;
        }
      }

      const bob = Math.sin(Date.now() * 0.0015 + pet.x * 0.01) * 4;
      pet.el.style.transform = `translate(${pet.x - 30}px, ${pet.y - 30 + bob}px)`;
    });
    requestAnimationFrame(animatePets);
  }
  animatePets();
})();
