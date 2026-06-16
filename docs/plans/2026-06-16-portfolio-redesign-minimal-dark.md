# Portfolio Redesign: Minimal Dark Tech Style

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the portfolio homepage with a Trae-inspired pure-black minimal aesthetic, adding a hero carousel, knowledge graph visualization, and particle network background.

**Architecture:** Single-page static site (3 files: index.html, style.css, main.js). Hero section uses two layered canvases: particle network (bg) + carousel (content). Knowledge graph rendered on a separate canvas in the About section. All interactivity via vanilla JS, zero dependencies.

**Tech Stack:** HTML5, CSS3 (custom properties, backdrop-filter, canvas 2D), Vanilla JS (IntersectionObserver, Canvas API)

---

### Task 1: Rewrite index.html with new structure

**Files:**
- Create: `index.html` (complete rewrite)
- Modify: none

**Step 1: Write the HTML structure**

Create `index.html` with the following sections in order:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>你的名字 | Portfolio</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- Particle canvas (Hero background) -->
  <canvas id="particles" class="hero-canvas"></canvas>

  <!-- Top navigation -->
  <nav class="top-nav">
    <a href="#" class="nav-brand">你的名字</a>
    <div class="nav-links">
      <a href="#about">关于</a>
      <a href="#experience">经历</a>
      <a href="#projects">项目</a>
      <a href="#blog">博客</a>
      <a href="#contact">联系</a>
    </div>
  </nav>

  <main class="content">
    <!-- Hero Section -->
    <section id="hero" class="hero">
      <h1 class="hero-title">技术应该隐形，<br>价值应该显性。</h1>
      <p class="hero-subtitle">全栈开发者 / AI 产品实践者</p>

      <!-- Carousel -->
      <div class="carousel">
        <div class="carousel-track">
          <div class="carousel-slide glass-card">
            <h3>CLI 任务管理工具</h3>
            <p>终端任务管理 CLI，看板视图 + Git 集成，200+ Stars</p>
            <div class="tags"><span>Rust</span><span>CLI</span></div>
          </div>
          <div class="carousel-slide glass-card">
            <h3>实时协作文档平台</h3>
            <p>CRDT 驱动的多人协作文档，延迟 &lt;50ms</p>
            <div class="tags"><span>React</span><span>Go</span><span>CRDT</span></div>
          </div>
          <div class="carousel-slide glass-card">
            <h3>自动化部署平台</h3>
            <p>可视化 CI/CD 编排，部署效率提升 3 倍</p>
            <div class="tags"><span>Vue.js</span><span>Docker</span><span>K8s</span></div>
          </div>
        </div>
        <button class="carousel-btn prev" aria-label="Previous">&#10094;</button>
        <button class="carousel-btn next" aria-label="Next">&#10095;</button>
        <div class="carousel-dots">
          <span class="dot active"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section">
      <h2>关于我</h2>
      <p class="about-text">你好，我是一名热爱技术的全栈开发者。专注于构建高性能、可扩展的 Web 应用，对前端工程化、系统设计和开源社区有浓厚兴趣。目前正在探索 AI 与 Web 技术的结合方向。</p>

      <div class="principles">
        <div class="principle-card glass-card">
          <div class="principle-icon">01</div>
          <h3>AI 是副驾驶</h3>
          <p>不是自动驾驶。工具放大能力，但方向、判断和审美仍然由人决定。</p>
        </div>
        <div class="principle-card glass-card">
          <div class="principle-icon">02</div>
          <h3>体验优先于炫技</h3>
          <p>每个技术决策都应该回答一个问题：这对用户真的有价值吗？</p>
        </div>
        <div class="principle-card glass-card">
          <div class="principle-icon">03</div>
          <h3>简单是终极复杂</h3>
          <p>能用一个文件解决的问题，不用两个。能不用框架，就不用。</p>
        </div>
      </div>

      <!-- Knowledge Graph -->
      <h2 class="graph-title">知识图谱</h2>
      <div class="graph-container">
        <canvas id="knowledge-graph"></canvas>
      </div>
    </section>

    <!-- Experience Section -->
    <section id="experience" class="section">
      <h2>工作经历</h2>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-header">
            <span class="company">某科技公司</span>
            <span class="role">高级前端工程师</span>
            <span class="period">2022 - 至今</span>
          </div>
          <details>
            <summary>查看详情</summary>
            <p>负责核心产品的前端架构设计，主导微前端迁移，将构建速度提升 60%。带领 5 人前端小组，建立代码规范和 CI/CD 流程。</p>
            <div class="tags"><span>React</span><span>TypeScript</span><span>微前端</span><span>CI/CD</span></div>
          </details>
        </div>
        <div class="timeline-item">
          <div class="timeline-header">
            <span class="company">某创业公司</span>
            <span class="role">全栈工程师</span>
            <span class="period">2020 - 2022</span>
          </div>
          <details>
            <summary>查看详情</summary>
            <p>从零搭建产品的前后端架构，独立完成用户系统、支付模块和数据看板。产品上线后月活突破 10 万。</p>
            <div class="tags"><span>Vue.js</span><span>Node.js</span><span>PostgreSQL</span><span>Docker</span></div>
          </details>
        </div>
        <div class="timeline-item">
          <div class="timeline-header">
            <span class="company">某互联网大厂</span>
            <span class="role">前端开发工程师</span>
            <span class="period">2018 - 2020</span>
          </div>
          <details>
            <summary>查看详情</summary>
            <p>参与电商平台前端开发，负责商品详情页和购物车模块的性能优化，LCP 从 3.2s 降至 1.1s。</p>
            <div class="tags"><span>JavaScript</span><span>Webpack</span><span>性能优化</span></div>
          </details>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="section">
      <h2>精选项目</h2>
      <div class="project-grid">
        <article class="project-card glass-card">
          <h3>CLI 任务管理工具</h3>
          <p>一款终端任务管理 CLI，支持看板视图、标签过滤和 Git 集成，已在 GitHub 获得 200+ Stars。</p>
          <div class="tags"><span>Rust</span><span>CLI</span><span>TUIs</span></div>
          <div class="project-links">
            <a href="#" target="_blank" rel="noopener">源码</a>
            <a href="#" target="_blank" rel="noopener">演示</a>
          </div>
        </article>
        <article class="project-card glass-card">
          <h3>实时协作文档平台</h3>
          <p>基于 CRDT 的实时协作文档编辑器，支持 Markdown 和多人同时编辑，延迟低于 50ms。</p>
          <div class="tags"><span>React</span><span>Go</span><span>CRDT</span><span>WebSocket</span></div>
          <div class="project-links">
            <a href="#" target="_blank" rel="noopener">源码</a>
            <a href="#" target="_blank" rel="noopener">演示</a>
          </div>
        </article>
        <article class="project-card glass-card">
          <h3>自动化部署平台</h3>
          <p>可视化 CI/CD 配置工具，通过拖拽编排构建流程，支持多环境部署和回滚，团队部署效率提升 3 倍。</p>
          <div class="tags"><span>Vue.js</span><span>Docker</span><span>Kubernetes</span></div>
          <div class="project-links">
            <a href="#" target="_blank" rel="noopener">源码</a>
            <a href="#" target="_blank" rel="noopener">演示</a>
          </div>
        </article>
        <article class="project-card glass-card">
          <h3>开发者效率 Chrome 扩展</h3>
          <p>集成 API 调试、JSON 格式化和 HTTP 请求记录的浏览器扩展，日活用户 3000+。</p>
          <div class="tags"><span>TypeScript</span><span>Chrome API</span><span>Extension</span></div>
          <div class="project-links">
            <a href="#" target="_blank" rel="noopener">源码</a>
            <a href="#" target="_blank" rel="noopener">演示</a>
          </div>
        </article>
      </div>
    </section>

    <!-- Blog Section -->
    <section id="blog" class="section">
      <h2>博客文章</h2>
      <div class="blog-list">
        <article class="blog-item">
          <span class="blog-date">2026-06-10</span>
          <a href="#" target="_blank" rel="noopener" class="blog-title">深入理解 React Server Components 的渲染模型</a>
          <span class="blog-tag">React</span>
        </article>
        <article class="blog-item">
          <span class="blog-date">2026-05-28</span>
          <a href="#" target="_blank" rel="noopener" class="blog-title">用 Rust 重写 Node.js 工具链的实践与思考</a>
          <span class="blog-tag">Rust</span>
        </article>
        <article class="blog-item">
          <span class="blog-date">2026-05-12</span>
          <a href="#" target="_blank" rel="noopener" class="blog-title">大型项目前端架构演进：从单体到微前端</a>
          <span class="blog-tag">架构</span>
        </article>
        <article class="blog-item">
          <span class="blog-date">2026-04-20</span>
          <a href="#" target="_blank" rel="noopener" class="blog-title">TypeScript 5.x 类型体操：从入门到实战</a>
          <span class="blog-tag">TypeScript</span>
        </article>
        <article class="blog-item">
          <span class="blog-date">2026-03-15</span>
          <a href="#" target="_blank" rel="noopener" class="blog-title">Docker 容器化部署最佳实践</a>
          <span class="blog-tag">DevOps</span>
        </article>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="section">
      <h2>联系我</h2>
      <p class="contact-email"><a href="mailto:you@example.com">you@example.com</a></p>
      <div class="social-links">
        <a href="#" target="_blank" rel="noopener">GitHub</a>
        <a href="#" target="_blank" rel="noopener">掘金</a>
        <a href="mailto:you@example.com">Email</a>
      </div>
    </section>

    <footer>
      <p>HTML + CSS + JS · 无框架 · 零依赖</p>
    </footer>
  </main>

  <script src="main.js"></script>
</body>
</html>
```

**Step 2: Verify HTML has all required elements**

Run in browser console: check that `#particles`, `.top-nav`, `.carousel`, `#knowledge-graph`, `.hero-title` all exist.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite HTML with new section structure"
```

---

### Task 2: Rewrite style.css — pure black Trae-style minimal

**Files:**
- Create: `style.css` (complete rewrite)
- Modify: none

**Step 1: Write the CSS**

Create `style.css` with these sections:

```css
/* ── 1. Reset & Custom Properties ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #000000;
  --bg-glass: rgba(255, 255, 255, 0.03);
  --bg-glass-hover: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(0, 229, 160, 0.2);
  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  --text-muted: #555;
  --accent: #00e5a0;
  --accent-dim: rgba(0, 229, 160, 0.1);
  --nav-height: 56px;
  --max-width: 1000px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

html { scroll-behavior: smooth; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  background: var(--bg);
  color: var(--text-primary);
  line-height: 1.7;
  font-size: 15px;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ── 2. Top Navigation ─── */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
}

.nav-brand {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.nav-brand:hover { color: var(--accent); }

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: var(--text-secondary);
  font-size: 0.82rem;
  letter-spacing: 0.2px;
  transition: color 0.2s;
  position: relative;
}

.nav-links a:hover,
.nav-links a.active { color: var(--accent); }

.nav-links a.active::after {
  content: "";
  position: absolute;
  bottom: -18px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--accent);
}

/* ── 3. Layout ─── */
.content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: calc(var(--nav-height) + 2rem) 2rem 4rem;
  position: relative;
  z-index: 2;
}

.section { margin-bottom: 6rem; }

/* ── 4. Typography ─── */
h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

p {
  color: var(--text-secondary);
  font-size: 0.88rem;
  line-height: 1.8;
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.2s;
}

a:hover { opacity: 0.7; }

/* ── 5. Hero ─── */
.hero {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
}

.hero-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: var(--text-primary);
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

.hero-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
}

/* ── 6. Carousel ─── */
.carousel {
  position: relative;
  width: 100%;
  max-width: 800px;
  z-index: 2;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s var(--ease);
}

.carousel-slide {
  min-width: 100%;
  padding: 2rem;
  cursor: default;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 3;
}

.carousel-btn:hover {
  border-color: var(--border-hover);
  color: var(--accent);
  background: var(--bg-glass-hover);
}

.carousel-btn.prev { left: -20px; }
.carousel-btn.next { right: -20px; }

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  background: var(--accent);
  box-shadow: 0 0 8px rgba(0, 229, 160, 0.4);
  width: 20px;
  border-radius: 3px;
}

/* ── 7. Glass Card ─── */
.glass-card {
  background: var(--bg-glass);
  backdrop-filter: blur(16px) saturate(1.1);
  -webkit-backdrop-filter: blur(16px) saturate(1.1);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: transform 0.4s var(--ease), border-color 0.3s, box-shadow 0.4s;
}

.glass-card:hover {
  transform: translateY(-3px);
  border-color: var(--border-hover);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

/* ── 8. Principles ─── */
.principles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 4rem;
}

.principle-card {
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.principle-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 229, 160, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.principle-card:hover::before { opacity: 1; }

.principle-icon {
  font-size: 0.7rem;
  color: var(--accent);
  font-family: "SF Mono", "Fira Code", monospace;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
}

.principle-card h3 {
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

.principle-card p {
  font-size: 0.82rem;
  line-height: 1.7;
}

/* ── 9. Knowledge Graph ─── */
.graph-title {
  margin-bottom: 1.5rem;
}

.graph-container {
  width: 100%;
  aspect-ratio: 2.5 / 1;
  min-height: 300px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-glass);
  backdrop-filter: blur(8px);
}

.graph-container canvas {
  width: 100%;
  height: 100%;
}

/* ── 10. Timeline ─── */
.timeline {
  border-left: 1px solid rgba(0, 229, 160, 0.12);
  padding-left: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.timeline-item { position: relative; }

.timeline-item::before {
  content: "";
  position: absolute;
  left: -1.9rem;
  top: 0.4rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px rgba(0, 229, 160, 0.3);
}

.timeline-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  align-items: baseline;
  margin-bottom: 0.2rem;
}

.company { font-weight: 600; color: var(--text-primary); font-size: 0.9rem; }
.role { color: var(--accent); font-size: 0.82rem; }
.period { color: var(--text-muted); font-size: 0.78rem; font-family: "SF Mono", "Fira Code", monospace; }

details { margin-top: 0.5rem; }

summary {
  color: var(--text-muted);
  font-size: 0.78rem;
  cursor: pointer;
  list-style: none;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.2s;
}

summary::before {
  content: "›";
  color: var(--accent);
  transition: transform 0.25s var(--ease);
  font-size: 0.9rem;
}

details[open] summary::before { transform: rotate(90deg); }
summary::marker { display: none; }
summary:hover { color: var(--accent); }
details[open] summary { margin-bottom: 0.75rem; display: inline-flex; }
details p { font-size: 0.85rem; margin-bottom: 0.75rem; }

/* ── 11. Tags ─── */
.tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }

.tags span {
  font-size: 0.68rem;
  padding: 0.2rem 0.55rem;
  border-radius: 5px;
  background: var(--accent-dim);
  color: var(--accent);
  font-family: "SF Mono", "Fira Code", monospace;
  letter-spacing: 0.2px;
  border: 1px solid rgba(0, 229, 160, 0.06);
}

/* ── 12. Project Grid ─── */
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.project-card {
  padding: 1.5rem;
}

.project-card h3 { margin-bottom: 0.5rem; font-size: 0.95rem; }
.project-card p { font-size: 0.84rem; margin-bottom: 1rem; line-height: 1.7; }
.project-links { display: flex; gap: 1.2rem; font-size: 0.8rem; }

/* ── 13. Blog ─── */
.blog-list { display: flex; flex-direction: column; }

.blog-item {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem 1.2rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: padding 0.2s;
}

.blog-item:hover { padding-left: 0.5rem; }
.blog-item:first-child { border-top: 1px solid rgba(255, 255, 255, 0.04); }

.blog-date {
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 0.72rem;
  color: var(--text-muted);
  min-width: 85px;
  letter-spacing: 0.3px;
}

.blog-title {
  flex: 1;
  color: var(--text-primary);
  font-size: 0.88rem;
  font-weight: 500;
}

.blog-title:hover { color: var(--accent); }

.blog-tag {
  font-size: 0.65rem;
  padding: 0.12rem 0.45rem;
  border-radius: 4px;
  background: var(--accent-dim);
  color: var(--accent);
  font-family: "SF Mono", "Fira Code", monospace;
  letter-spacing: 0.3px;
}

/* ── 14. Contact ─── */
.contact-email {
  font-size: 1.2rem;
  font-weight: 600;
  font-family: "SF Mono", "Fira Code", monospace;
  margin-bottom: 1.5rem;
}

.contact-email a { color: var(--accent); }
.contact .social-links { flex-direction: row; gap: 1.5rem; }

/* ── 15. Footer ─── */
footer {
  text-align: center;
  padding: 3rem 0 2rem;
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

/* ── 16. Scroll Reveal ─── */
.section {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}

.section.visible { opacity: 1; transform: translateY(0); }

/* ── 17. Responsive ─── */
@media (max-width: 768px) {
  .top-nav { padding: 0 1.25rem; }
  .nav-links { gap: 1rem; }
  .nav-links a { font-size: 0.75rem; }
  .content { padding-left: 1.25rem; padding-right: 1.25rem; }
  .principles { grid-template-columns: 1fr; }
  .project-grid { grid-template-columns: 1fr; }
  .carousel-btn.prev { left: 5px; }
  .carousel-btn.next { right: 5px; }
}

@media (max-width: 480px) {
  .nav-links { gap: 0.6rem; }
  .nav-links a { font-size: 0.7rem; }
  .hero-title { font-size: 2rem; }
}
```

**Step 2: Verify CSS has no syntax errors**

Run: `node -e "require('fs').readFileSync('style.css','utf8')"` — should output file content without error.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: rewrite CSS with Trae-style minimal dark theme"
```

---

### Task 3: Create main.js — carousel, particles, knowledge graph, scroll

**Files:**
- Create: `main.js` (complete rewrite)
- Modify: none

**Step 1: Write the JavaScript**

Create `main.js` with four modules:

```javascript
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
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
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

          // Stagger child items
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

  // Touch swipe support
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
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();
  window.addEventListener("resize", () => { resizeCanvas(); initParticles(); });

  // ── 5. Knowledge Graph ───
  const kgCanvas = document.getElementById("knowledge-graph");
  const kgCtx = kgCanvas.getContext("2d");
  let kgNodes = [];
  let kgEdges = [];
  let dragNode = null;
  let hoveredNode = null;

  const skills = [
    { label: "React", group: 0 },
    { label: "Vue.js", group: 0 },
    { label: "TypeScript", group: 1 },
    { label: "Rust", group: 2 },
    { label: "Go", group: 2 },
    { label: "Node.js", group: 2 },
    { label: "Docker", group: 3 },
    { label: "K8s", group: 3 },
    { label: "PostgreSQL", group: 3 },
    { label: "GraphQL", group: 1 },
    { label: "WebSocket", group: 1 },
    { label: "CRDT", group: 2 },
  ];

  const connections = [
    [0, 4], [0, 10], [1, 4], [1, 10], [0, 2], [1, 2],
    [2, 9], [2, 10], [3, 5], [3, 11], [4, 5], [5, 9],
    [6, 8], [6, 7], [9, 10], [3, 6], [4, 8],
  ];

  const groupColors = ["#00e5a0", "#64b5f6", "#ffb74d", "#ef5350"];

  function initKnowledgeGraph() {
    const rect = kgCanvas.parentElement.getBoundingClientRect();
    kgCanvas.width = rect.width * window.devicePixelRatio;
    kgCanvas.height = rect.height * window.devicePixelRatio;
    kgCanvas.style.width = rect.width + "px";
    kgCanvas.style.height = rect.height + "px";
    kgCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

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
        vx: 0,
        vy: 0,
        label: skill.label,
        group: skill.group,
        radius: 18,
      };
    });

    kgEdges = connections.map(([a, b]) => ({ source: a, target: b }));

    // Add some force-directed settling
    for (let iter = 0; iter < 100; iter++) {
      kgNodes.forEach((node) => {
        node.vx = 0;
        node.vy = 0;
      });
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
        // Keep in bounds
        node.x = Math.max(30, Math.min(w - 30, node.x));
        node.y = Math.max(30, Math.min(h - 30, node.y));
      });
    }
  }

  function drawKnowledgeGraph() {
    const rect = kgCanvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    kgCtx.clearRect(0, 0, w, h);

    // Draw edges
    kgEdges.forEach((edge) => {
      const a = kgNodes[edge.source];
      const b = kgNodes[edge.target];
      const isHighlighted = hoveredNode &&
        (edge.source === hoveredNode || edge.target === hoveredNode);

      kgCtx.beginPath();
      kgCtx.moveTo(a.x, a.y);
      kgCtx.lineTo(b.x, b.y);
      kgCtx.strokeStyle = isHighlighted
        ? "rgba(0, 229, 160, 0.4)"
        : "rgba(255, 255, 255, 0.06)";
      kgCtx.lineWidth = isHighlighted ? 1.2 : 0.5;
      kgCtx.stroke();
    });

    // Draw nodes
    kgNodes.forEach((node, i) => {
      const isHovered = hoveredNode === i;
      const r = isHovered ? node.radius + 3 : node.radius;
      const color = groupColors[node.group];

      // Glow
      kgCtx.beginPath();
      kgCtx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
      kgCtx.fillStyle = isHovered
        ? color.replace(")", ", 0.15)").replace("rgb", "rgba")
        : "transparent";
      kgCtx.fill();

      // Node circle
      kgCtx.beginPath();
      kgCtx.arc(node.x, node.y, r, 0, Math.PI * 2);
      kgCtx.fillStyle = isHovered ? color : "rgba(20, 20, 20, 0.9)";
      kgCtx.fill();
      kgCtx.strokeStyle = color;
      kgCtx.lineWidth = isHovered ? 2 : 1;
      kgCtx.stroke();

      // Label
      kgCtx.fillStyle = isHovered ? "#fff" : "rgba(255, 255, 255, 0.7)";
      kgCtx.font = `${isHovered ? '600' : '400'} 11px -apple-system, "PingFang SC", sans-serif`;
      kgCtx.textAlign = "center";
      kgCtx.fillText(node.label, node.x, node.y + r + 16);
    });
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
    if (dragNode !== null) {
      kgNodes[dragNode].x = mx;
      kgNodes[dragNode].y = my;
    }
    kgCanvas.style.cursor = hoveredNode !== null ? "pointer" : "default";
    drawKnowledgeGraph();
  });

  kgCanvas.addEventListener("mousedown", (e) => {
    const rect = kgCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    dragNode = getNodeAtPos(mx, my);
  });

  kgCanvas.addEventListener("mouseup", () => { dragNode = null; });
  kgCanvas.addEventListener("mouseleave", () => { hoveredNode = null; drawKnowledgeGraph(); });

  function animateKnowledgeGraph() {
    drawKnowledgeGraph();
    requestAnimationFrame(animateKnowledgeGraph);
  }

  // Initialize knowledge graph when visible
  const kgObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        initKnowledgeGraph();
        animateKnowledgeGraph();
        kgObserver.disconnect();
      }
    },
    { threshold: 0.1 }
  );
  kgObserver.observe(kgCanvas);

  // Handle resize
  window.addEventListener("resize", () => {
    if (kgCanvas.width > 0) {
      initKnowledgeGraph();
    }
  });
})();
```

**Step 2: Verify JS runs without errors**

Open `index.html` in browser, check console for errors. All features should work: carousel auto-advances, particles animate, knowledge graph renders when scrolled into view.

**Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add carousel, particle network, and knowledge graph"
```

---

### Task 4: Visual verification

**Step 1: Open in browser**

Run: `start "" "file:///E:/proCode/6Y/16-Portfolio-Homepage/index.html"`

**Step 2: Verify checklist**

- [ ] Pure black background, no blue tint
- [ ] Top nav with glass effect, active underline on scroll
- [ ] Hero title large and centered with particle network behind
- [ ] Carousel shows 3 slides, auto-advances every 5s
- [ ] Carousel arrows and dots work
- [ ] About section has 3 principle cards in a row
- [ ] Knowledge graph renders with colored nodes and connections
- [ ] Knowledge graph nodes are draggable
- [ ] Hover on graph node highlights connections
- [ ] Timeline, project cards, blog items animate on scroll
- [ ] Mobile: nav links shrink, grid goes single column
- [ ] No console errors

**Step 3: Screenshot and review**

Take screenshots at desktop (1440px) and mobile (375px). If issues found, fix and re-verify.

**Step 4: Final commit**

```bash
git add -A && git commit -m "feat: visual verification and polish"
```

---

Plan complete and saved to `docs/plans/2026-06-16-portfolio-redesign-minimal-dark.md`. Two execution options:

**1. Subagent-Driven (this session)** — I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** — Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
