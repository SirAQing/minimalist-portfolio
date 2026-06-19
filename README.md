# Minimalist Dark-Themed Portfolio

A modern, highly-polished, and minimalist portfolio template built with **React**, **Vite**, **Tailwind CSS v3**, and **Framer Motion**. It features a clean aesthetic, deep dark mode support, and built-in internationalization (i18n). 

Inspired by the sleek design of [santifer.io](https://santifer.io/).

## ✨ Features

- **Modern Tech Stack**: React 19 + TypeScript + Vite.
- **Minimalist UI**: Clean layout, immersive dark mode, and elegant typography using Tailwind CSS.
- **Smooth Animations**: High-quality interactions and page transitions powered by Framer Motion.
- **i18n Support**: Native bilingual support (English & Chinese) without heavy dependencies.
- **Floating AI Assistant**: An interactive bottom-right AI assistant chat UI.
- **Scroll Spy Sidebar**: An intelligent side navigation that updates automatically based on your scroll position.
- **Fully Responsive**: Flawless experience on both desktop and mobile devices.

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/SirAQing/portfolio-react.git
cd portfolio-react/portfolio-react
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

## 📂 Project Structure

```text
portfolio-react/
├── src/
│   ├── assets/         # Images, icons, and static assets
│   ├── components/     # Reusable React components (Hero, Projects, FloatingAssistant, etc.)
│   ├── i18n.tsx        # Internationalization Context and translations
│   ├── index.css       # Global styles and Tailwind entry (CSS variables for themes)
│   ├── App.tsx         # Main application layout and routing
│   └── main.tsx        # React DOM render entry
├── tailwind.config.js  # Tailwind theme and custom configuration
└── package.json        # Project metadata and dependencies
```

## 🎨 Customization

- **Colors & Themes**: Modify the CSS variables in `src/index.css` under `:root` and `:root.dark` to change the overall color scheme.
- **Translations**: Add or update languages in the `translations` object inside `src/i18n.tsx`.
- **Content**: Update your personal details, experience, and projects directly in the respective component files under `src/components/`.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
