(function () {
  "use strict";

  // ── 1. Navigation scroll spy ───
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll(".section, .hero");

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
    { threshold: 0.3, rootMargin: "-60px 0px -40% 0px" }
  );

  sections.forEach((s) => spyObserver.observe(s));

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ── 2. Scroll reveal ───
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          const items = entry.target.querySelectorAll(
            ".timeline-item, .project-card, .blog-item, .principle-card"
          );
          items.forEach((item, i) => {
            item.style.setProperty("--stagger-delay", `${i * 80}ms`);
            item.classList.add("stagger-in");
          });
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".section, .hero").forEach((el) => revealObserver.observe(el));

  // ── 3. Carousel ───
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  let currentSlide = 0;
  let autoplayTimer;

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  prevBtn.addEventListener("click", () => { goToSlide(currentSlide - 1); stopAutoplay(); startAutoplay(); });
  nextBtn.addEventListener("click", () => { goToSlide(currentSlide + 1); stopAutoplay(); startAutoplay(); });
  dots.forEach((dot, i) => dot.addEventListener("click", () => { goToSlide(i); stopAutoplay(); startAutoplay(); }));

  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff > 0 ? 1 : -1));
    startAutoplay();
  });
  startAutoplay();

  // ── 4. Particle Network (Hero background) ───
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const PARTICLE_COUNT = 60;
  const CONNECTION_DIST = 150;
  // Click burst particles
  let burstParticles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 1.5 + 0.5;
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
      ctx.fillStyle = "rgba(0, 229, 160, 0.4)";
      ctx.fill();
    }
  }

  // Click burst particle
  class BurstParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.size = Math.random() * 2.5 + 1;
      this.color = Math.random() > 0.5 ? "0, 229, 160" : "255, 255, 255";
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.life -= this.decay;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.life * 0.8})`;
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
          ctx.strokeStyle = `rgba(0, 229, 160, ${0.12 * (1 - dist / CONNECTION_DIST)})`;
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

    // Draw burst particles
    burstParticles = burstParticles.filter((p) => p.life > 0);
    burstParticles.forEach((p) => { p.update(); p.draw(); });

    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();
  window.addEventListener("resize", () => { resizeCanvas(); initParticles(); });

  // Click burst effect
  document.addEventListener("click", (e) => {
    for (let i = 0; i < 18; i++) {
      burstParticles.push(new BurstParticle(e.clientX, e.clientY));
    }
  });

  // ── 5. Knowledge Graph ───
  const kgCanvas = document.getElementById("knowledge-graph");
  const kgCtx = kgCanvas.getContext("2d");
  let kgNodes = [];
  let kgEdges = [];
  let dragNode = null;
  let hoveredNode = null;
  let kgInitialized = false;

  const skills = [
    { label: "React", group: 0 }, { label: "Vue.js", group: 0 },
    { label: "TypeScript", group: 1 }, { label: "Rust", group: 2 },
    { label: "Go", group: 2 }, { label: "Node.js", group: 2 },
    { label: "Docker", group: 3 }, { label: "K8s", group: 3 },
    { label: "PostgreSQL", group: 3 }, { label: "GraphQL", group: 1 },
    { label: "WebSocket", group: 1 }, { label: "CRDT", group: 2 },
  ];

  const connections = [
    [0, 4], [0, 10], [1, 4], [1, 10], [0, 2], [1, 2],
    [2, 9], [2, 10], [3, 5], [3, 11], [4, 5], [5, 9],
    [6, 8], [6, 7], [9, 10], [3, 6], [4, 8],
  ];

  const groupColors = ["#00e5a0", "#64b5f6", "#ffb74d", "#ef5350"];

  function initKnowledgeGraph() {
    const rect = kgCanvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    kgCanvas.width = rect.width * dpr;
    kgCanvas.height = rect.height * dpr;
    kgCanvas.style.width = rect.width + "px";
    kgCanvas.style.height = rect.height + "px";
    kgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.3;

    kgNodes = skills.map((skill, i) => {
      const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
        y: cy + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
        vx: 0, vy: 0,
        label: skill.label, group: skill.group, radius: 18,
      };
    });

    kgEdges = connections.map(([a, b]) => ({ source: a, target: b }));

    for (let iter = 0; iter < 100; iter++) {
      kgNodes.forEach((node) => { node.vx = 0; node.vy = 0; });
      kgEdges.forEach((edge) => {
        const a = kgNodes[edge.source];
        const b = kgNodes[edge.target];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 120) * 0.01;
        a.vx += (dx / dist) * force;
        a.vy += (dy / dist) * force;
        b.vx -= (dx / dist) * force;
        b.vy -= (dy / dist) * force;
      });
      kgNodes.forEach((node) => {
        node.vx += (cx - node.x) * 0.001;
        node.vy += (cy - node.y) * 0.001;
        node.x += node.vx;
        node.y += node.vy;
        node.x = Math.max(30, Math.min(w - 30, node.x));
        node.y = Math.max(30, Math.min(h - 30, node.y));
      });
    }
    kgInitialized = true;
  }

  function drawKnowledgeGraph() {
    if (!kgInitialized) return;
    const rect = kgCanvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    kgCtx.clearRect(0, 0, w, h);

    kgEdges.forEach((edge) => {
      const a = kgNodes[edge.source];
      const b = kgNodes[edge.target];
      const isHighlighted = hoveredNode !== null && (edge.source === hoveredNode || edge.target === hoveredNode);
      kgCtx.beginPath();
      kgCtx.moveTo(a.x, a.y);
      kgCtx.lineTo(b.x, b.y);
      kgCtx.strokeStyle = isHighlighted ? "rgba(0, 229, 160, 0.4)" : "rgba(255, 255, 255, 0.06)";
      kgCtx.lineWidth = isHighlighted ? 1.2 : 0.5;
      kgCtx.stroke();
    });

    kgNodes.forEach((node, i) => {
      const isHovered = hoveredNode === i;
      const r = isHovered ? node.radius + 3 : node.radius;
      const color = groupColors[node.group];
      kgCtx.beginPath();
      kgCtx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
      kgCtx.fillStyle = isHovered ? "rgba(0, 229, 160, 0.12)" : "transparent";
      kgCtx.fill();
      kgCtx.beginPath();
      kgCtx.arc(node.x, node.y, r, 0, Math.PI * 2);
      kgCtx.fillStyle = isHovered ? color : "rgba(20, 20, 20, 0.9)";
      kgCtx.fill();
      kgCtx.strokeStyle = color;
      kgCtx.lineWidth = isHovered ? 2 : 1;
      kgCtx.stroke();
      kgCtx.fillStyle = isHovered ? "#fff" : "rgba(255, 255, 255, 0.7)";
      kgCtx.font = `${isHovered ? "600" : "400"} 11px -apple-system, "PingFang SC", sans-serif`;
      kgCtx.textAlign = "center";
      kgCtx.fillText(node.label, node.x, node.y + r + 16);
    });
  }

  function animateKnowledgeGraph() {
    drawKnowledgeGraph();
    requestAnimationFrame(animateKnowledgeGraph);
  }

  function getNodeAtPos(mx, my) {
    for (let i = kgNodes.length - 1; i >= 0; i--) {
      const n = kgNodes[i];
      const dx = mx - n.x;
      const dy = my - n.y;
      if (dx * dx + dy * dy < (n.radius + 5) * (n.radius + 5)) return i;
    }
    return null;
  }

  kgCanvas.addEventListener("mousemove", (e) => {
    const rect = kgCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    hoveredNode = getNodeAtPos(mx, my);
    if (dragNode !== null) { kgNodes[dragNode].x = mx; kgNodes[dragNode].y = my; }
    kgCanvas.style.cursor = hoveredNode !== null ? "pointer" : "default";
  });

  kgCanvas.addEventListener("mousedown", (e) => {
    const rect = kgCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    dragNode = getNodeAtPos(mx, my);
  });
  kgCanvas.addEventListener("mouseup", () => { dragNode = null; });
  kgCanvas.addEventListener("mouseleave", () => { hoveredNode = null; });

  const kgObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !kgInitialized) {
        initKnowledgeGraph();
        animateKnowledgeGraph();
        kgObserver.disconnect();
      }
    },
    { threshold: 0.1 }
  );
  kgObserver.observe(kgCanvas);

  window.addEventListener("resize", () => { if (kgInitialized) initKnowledgeGraph(); });

  // ── 6. Pet Characters ───
  // Two pets that follow the cursor with spring physics
  // Claw: ghost/jellyfish (Claude-inspired) — teal color
  // Sparky: robot (Codex-inspired) — blue color

  const petCanvas = document.createElement("canvas");
  petCanvas.id = "pet-canvas";
  petCanvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;";
  document.body.appendChild(petCanvas);
  const pCtx = petCanvas.getContext("2d");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let mouseInHero = false;

  const heroEl = document.getElementById("hero");
  const heroObserver = new IntersectionObserver(
    (entries) => { mouseInHero = entries[0].isIntersecting; },
    { threshold: 0 }
  );
  heroObserver.observe(heroEl);

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function resizePetCanvas() {
    petCanvas.width = window.innerWidth;
    petCanvas.height = window.innerHeight;
  }
  resizePetCanvas();
  window.addEventListener("resize", resizePetCanvas);

  // Pet class with spring physics
  class Pet {
    constructor(offsetX, offsetY, color, type) {
      this.x = mouseX + offsetX;
      this.y = mouseY + offsetY;
      this.targetX = this.x;
      this.targetY = this.y;
      this.vx = 0;
      this.vy = 0;
      this.color = color;
      this.type = type; // "ghost" | "robot"
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.time = Math.random() * 1000;
      this.blinkTimer = Math.random() * 200;
      this.isBlinking = false;
      this.scale = 1;
    }

    update(targetX, targetY) {
      this.targetX = targetX + this.offsetX;
      this.targetY = targetY + this.offsetY;
      this.time += 0.03;

      // Spring physics
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const springForce = 0.08;
      const damping = 0.75;

      this.vx += dx * springForce;
      this.vy += dy * springForce;
      this.vx *= damping;
      this.vy *= damping;

      this.x += this.vx;
      this.y += this.vy;

      // Idle bobbing
      const bob = Math.sin(this.time) * 3;

      // Blink
      this.blinkTimer--;
      if (this.blinkTimer <= 0) {
        this.isBlinking = true;
        if (this.blinkTimer < -8) {
          this.isBlinking = false;
          this.blinkTimer = Math.random() * 200 + 100;
        }
      }

      // Squash/stretch based on velocity
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      this.scale = 1 + Math.min(speed * 0.01, 0.15);

      return { bob, speed };
    }

    drawGhost(ctx, bob) {
      const x = this.x;
      const y = this.y + bob;
      const r = 14;

      // Glow
      const glow = ctx.createRadialGradient(x, y - 5, r * 0.3, x, y, r * 2);
      glow.addColorStop(0, "rgba(0, 229, 160, 0.15)");
      glow.addColorStop(1, "rgba(0, 229, 160, 0)");
      ctx.beginPath();
      ctx.arc(x, y, r * 2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Body (ghost shape)
      ctx.beginPath();
      ctx.moveTo(x - r, y + r * 0.3);
      ctx.quadraticCurveTo(x - r, y - r, x, y - r);
      ctx.quadraticCurveTo(x + r, y - r, x + r, y + r * 0.3);
      // Wavy bottom
      const waveCount = 3;
      const waveWidth = (2 * r) / waveCount;
      for (let i = 0; i < waveCount; i++) {
        const wx = x + r - (i + 0.5) * waveWidth;
        const wy = y + r * 0.3 + (i % 2 === 0 ? r * 0.4 : -r * 0.1);
        ctx.quadraticCurveTo(wx, wy, x + r - (i + 1) * waveWidth, y + r * 0.3);
      }
      ctx.closePath();

      const bodyGrad = ctx.createLinearGradient(x, y - r, x, y + r);
      bodyGrad.addColorStop(0, "rgba(0, 229, 160, 0.25)");
      bodyGrad.addColorStop(1, "rgba(0, 229, 160, 0.08)");
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 229, 160, 0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Eyes
      const eyeY = y - r * 0.15;
      const eyeSpacing = r * 0.35;
      if (!this.isBlinking) {
        // Left eye
        ctx.beginPath();
        ctx.arc(x - eyeSpacing, eyeY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#00e5a0";
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.arc(x + eyeSpacing, eyeY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Blink — lines
        ctx.beginPath();
        ctx.moveTo(x - eyeSpacing - 3, eyeY);
        ctx.lineTo(x - eyeSpacing + 3, eyeY);
        ctx.strokeStyle = "rgba(0, 229, 160, 0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + eyeSpacing - 3, eyeY);
        ctx.lineTo(x + eyeSpacing + 3, eyeY);
        ctx.stroke();
      }
    }

    drawRobot(ctx, bob) {
      const x = this.x;
      const y = this.y + bob;
      const size = 12;

      // Glow
      const glow = ctx.createRadialGradient(x, y, size * 0.3, x, y, size * 2);
      glow.addColorStop(0, "rgba(100, 181, 246, 0.12)");
      glow.addColorStop(1, "rgba(100, 181, 246, 0)");
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Body (rounded square)
      const s = size;
      ctx.beginPath();
      ctx.moveTo(x - s + 4, y - s);
      ctx.lineTo(x + s - 4, y - s);
      ctx.quadraticCurveTo(x + s, y - s, x + s, y - s + 4);
      ctx.lineTo(x + s, y + s - 4);
      ctx.quadraticCurveTo(x + s, y + s, x + s - 4, y + s);
      ctx.lineTo(x - s + 4, y + s);
      ctx.quadraticCurveTo(x - s, y + s, x - s, y + s - 4);
      ctx.lineTo(x - s, y - s + 4);
      ctx.quadraticCurveTo(x - s, y - s, x - s + 4, y - s);
      ctx.closePath();
      const bodyGrad = ctx.createLinearGradient(x - s, y - s, x + s, y + s);
      bodyGrad.addColorStop(0, "rgba(100, 181, 246, 0.2)");
      bodyGrad.addColorStop(1, "rgba(100, 181, 246, 0.06)");
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(100, 181, 246, 0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Antenna
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.lineTo(x, y - s - 5);
      ctx.strokeStyle = "rgba(100, 181, 246, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y - s - 5, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100, 181, 246, 0.7)";
      ctx.fill();

      // Eyes (LED dots)
      const eyeY = y - 1;
      const eyeSpacing = 4;
      const eyeColor = this.isBlinking ? "rgba(100, 181, 246, 0.2)" : "rgba(100, 181, 246, 0.9)";
      if (!this.isBlinking) {
        ctx.beginPath();
        ctx.arc(x - eyeSpacing, eyeY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = eyeColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + eyeSpacing, eyeY, 1.8, 0, Math.PI * 2);
        ctx.fill();
        // Eye glow
        ctx.beginPath();
        ctx.arc(x - eyeSpacing, eyeY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(100, 181, 246, 0.15)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + eyeSpacing, eyeY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Feet
      ctx.fillStyle = "rgba(100, 181, 246, 0.3)";
      ctx.fillRect(x - 5, y + s, 3, 2);
      ctx.fillRect(x + 2, y + s, 3, 2);
    }

    draw(ctx) {
      const { bob } = this.update(this.targetX, this.targetY);
      if (this.type === "ghost") {
        this.drawGhost(ctx, bob);
      } else {
        this.drawRobot(ctx, bob);
      }
    }
  }

  // Create two pets: Claw (ghost) and Sparky (robot)
  const claw = new Pet(-30, 0, "#00e5a0", "ghost");
  const sparky = new Pet(30, 0, "#64b5f6", "robot");

  function animatePets() {
    pCtx.clearRect(0, 0, petCanvas.width, petCanvas.height);

    if (mouseInHero) {
      // Pets follow mouse with offset
      claw.draw(pCtx);
      sparky.draw(pCtx);
    }

    requestAnimationFrame(animatePets);
  }
  animatePets();

})();
