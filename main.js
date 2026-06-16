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

  // ── 6. Pet Characters (Claw + Sparky) ───
  // Using actual pet images, wander freely, converge on click
  // Slower, smoother movement

  const petContainer = document.createElement("div");
  petContainer.id = "pet-container";
  petContainer.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;overflow:hidden;";
  document.body.appendChild(petContainer);

  const petImages = [
    { src: "assets/claude-code.png", size: 60 },
    { src: "assets/codex.png", size: 60 },
  ];

  const petEls = [];
  let petImagesLoaded = 0;

  petImages.forEach((info, i) => {
    const img = new Image();
    img.src = info.src;
    img.onload = () => { petImagesLoaded++; };

    const el = document.createElement("div");
    el.style.cssText = `position:absolute;width:${info.size}px;height:${info.size}px;transition:none;`;
    const inner = document.createElement("img");
    inner.src = info.src;
    inner.style.cssText = "width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0 8px rgba(255,255,255,0.1));";
    inner.style.pointerEvents = "none";
    el.appendChild(inner);
    petContainer.appendChild(el);

    petEls.push({
      el,
      x: Math.random() * (window.innerWidth - 100) + 50,
      y: Math.random() * (window.innerHeight - 100) + 50,
      vx: 0,
      vy: 0,
      mode: "wander",
      targetX: 0,
      targetY: 0,
      waitTimer: 0,
    });
  });

  function pickWanderTarget(pet) {
    const margin = 80;
    pet.targetX = margin + Math.random() * (window.innerWidth - margin * 2);
    pet.targetY = margin + Math.random() * (window.innerHeight - margin * 2);
  }

  petEls.forEach(pickWanderTarget);

  document.addEventListener("click", (e) => {
    petEls.forEach((pet, i) => {
      pet.mode = "goto";
      pet.targetX = e.clientX + (i === 0 ? -30 : 30);
      pet.targetY = e.clientY;
      pet.waitTimer = 200;
    });
  });

  function animatePets() {
    petEls.forEach((pet) => {
      let tx = pet.targetX;
      let ty = pet.targetY;

      if (pet.mode === "goto") {
        pet.waitTimer--;
        if (pet.waitTimer <= 0) {
          pet.mode = "wander";
          pickWanderTarget(pet);
        }
      } else {
        const dx = pet.targetX - pet.x;
        const dy = pet.targetY - pet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) pickWanderTarget(pet);
      }

      const dx = tx - pet.x;
      const dy = ty - pet.y;
      const springForce = pet.mode === "goto" ? 0.004 : 0.001;
      const damping = 0.95;

      pet.vx += dx * springForce;
      pet.vy += dy * springForce;
      pet.vx *= damping;
      pet.vy *= damping;

      pet.x += pet.vx;
      pet.y += pet.vy;

      // Gentle bobbing
      const bob = Math.sin(Date.now() * 0.0015 + pet.x) * 4;

      pet.el.style.transform = `translate(${pet.x - 30}px, ${pet.y - 30 + bob}px)`;
    });

    requestAnimationFrame(animatePets);
  }
  animatePets();

})();
