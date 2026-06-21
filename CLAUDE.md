# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A minimalist, bilingual (EN/ZH) portfolio website built with React 19, Vite 8, TypeScript 6, Tailwind CSS 3, and Framer Motion. Features a floating AI chat assistant, knowledge base with markdown articles, and dark/light theming.

## Commands

All commands run from `portfolio-react/`:

```bash
npm run dev       # Start Vite dev server (default: localhost:5173)
npm run build     # TypeScript check (tsc -b) then Vite production build
npm run lint      # ESLint across the project
npm run preview   # Preview production build locally
```

## Architecture

### Routing

Hash-based client-side routing via `src/hooks/useHashRouter.ts`. Two pages:
- **Home** (`#/` or empty) — the portfolio
- **Knowledge Base** (`#/knowledge`, `#/knowledge/<slug>`) — article listing + reader

`App.tsx` checks `route.page` and renders either `<KnowledgeBase>` or the portfolio layout. No React Router — just `hashchange` events.

### Theming

CSS custom properties in `src/index.css` under `:root` (light) and `:root.dark` (dark). Tailwind references these via `var(--bg-base)`, `var(--text-primary)`, etc. Dark mode toggled by adding/removing the `dark` class on `<html>`. Preference persisted in `localStorage('theme')`.

### i18n

Lightweight, no-dependency i18n via React Context (`src/i18n.tsx`). All translations are in a single `translations` object keyed by `'en' | 'zh'`. The `t()` function falls back to English. Language persisted in `localStorage('lang')`.

### AI Chat Assistant

`FloatingAssistant.tsx` connects to a backend via SSE streaming at `${VITE_API_BASE}/api/chat/stream`. The Vite dev server proxies `/api` → `localhost:8000`. The chat widget opens via:
1. The floating button (bottom-right)
2. The "Ask Me" CTA in HeroSection (dispatches a `'open-chat'` custom event)

Stream protocol: `data: {"type":"conv_id"|"chunk"|"done", ...}` JSON lines. Conversation ID is maintained in state for multi-turn.

### Knowledge Base

Articles live as `.md` files in `src/content/articles/{en,zh}/`, with metadata in `src/content/manifest.json`. Key mechanics:

- **Loading**: `import.meta.glob` eager-imports all `.md` files as raw strings at build time
- **Localization**: `manifest.json` articles have `title`/`titleEn`, `tags`/`tagsEn`, etc. `getLocalizedMeta()` picks fields by current language
- **Markdown rendering**: `react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-slug`. Source is VitePress-flavored markdown — `MarkdownRenderer` preprocesses `::: tip` blocks into blockquotes and strips `<ComponentDemo />` tags
- **Article page layout**: sticky left sidebar with `TreeNav` (extracted from DOM h2/h3 headings after render), main content area, `ProgressRing` reading indicator (bottom-right)
- **Article list**: featured latest article card + remaining articles grouped by category

### Component Hierarchy

```
App
└── I18nProvider
    └── AppContent
        ├── [home route]
        │   ├── HeaderActions (theme toggle, lang toggle, KB link)
        │   ├── SidebarNav (scroll-spy, IntersectionObserver on sections)
        │   ├── HeroSection
        │   ├── ExperienceSection
        │   ├── ProjectsSection
        │   ├── EducationSection / CertificationsSection / SkillsSection
        │   ├── ContactSection / Footer (inline in App.tsx)
        │   └── FloatingAssistant
        └── [knowledge route]
            └── KnowledgeBase
                ├── TreeNav (heading tree nav)
                ├── MarkdownRenderer
                ├── ProgressRing
                └── ArticleList (when no slug)
```

### Shared Component

`SectionTitle` (`src/components/shared/SectionTitle.tsx`) — used by all portfolio sections for consistent heading layout (icon + number + title + subtitle).

### Scroll Spy Pattern

Both `SidebarNav` and `KnowledgeBase` use `IntersectionObserver` with `rootMargin` offsets to track which section/heading is currently visible. The active item gets highlighted styling.

## Key Dependencies

- **framer-motion** — stagger entrance animations, typewriter effect, chat open/close
- **lucide-react** — icon library
- **react-markdown** + **rehype-highlight** + **remark-gfm** + **rehype-slug** — knowledge base article rendering
- **tailwindcss v3** — utility-first CSS with class-based dark mode

## Adding Content

- **Translations**: add keys to `translations.en` and `translations.zh` in `src/i18n.tsx`
- **Articles**: add `.md` to `src/content/articles/{en,zh}/`, add entry to `manifest.json` with slug, title/titleEn, tags/tagsEn, date, category/categoryEn, description/descriptionEn, source, sourceRepo
- **CSS theme tokens**: edit `:root` / `:root.dark` blocks in `src/index.css`
