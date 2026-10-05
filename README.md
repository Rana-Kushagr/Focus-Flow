# FocusFlow ⚡ — Study with Intention. Get More Done.

> A modern, restrained student productivity web application that unifies task prioritization, deep-work study sessions, markdown notes, calendar scheduling, and data-driven productivity analytics.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-6366f1?style=for-the-badge&logo=github)](https://rana-kushagr.github.io/Focus-Flow/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)

---

## 🌐 Live Application

Explore the deployed, production-ready web application directly in your browser:  
👉 **[https://rana-kushagr.github.io/Focus-Flow/](https://rana-kushagr.github.io/Focus-Flow/)**

*(Includes a **1-Click "Demo Student (Alex)"** button on the Login page for instant, zero-friction evaluation).*

---

## 💡 About the Product

Most student productivity tools suffer from feature bloat, distracting gimmicks, or generic AI templates with superficial gradients. 

**FocusFlow was built with an intentional, restrained design system:**
* **Distraction-Free Aesthetic:** Near-white paper textures in light mode, deep slate/zinc in dark mode, and a single refined violet accent (`#6366f1`).
* **Zero Hollow Mocks:** Every button, filter, countdown, note editor, and data chart is backed by a reactive `localStorage` state store that persists across sessions.
* **Academic-First Workflows:** Designed specifically for university and exam preparation workloads (STEM formulas, Pomodoro chunking, and course time tracking).

---

## ✨ Key Features

### 1. 🎯 Intelligent Task Prioritization (`/dashboard/tasks`)
- Organize assignments and review milestones into **Today**, **Upcoming**, and **Completed** sections.
- Categorize by academic courses (*Mathematics, Physics, Computer Science, Biology, History, Chemistry, Literature*).
- Tag with **High / Medium / Low** priority badges and estimated Pomodoro blocks.
- Real-time search and multi-criteria filters (by subject, priority, and status).
- Strike-through completion with confetti celebration feedback.

### 2. ⏳ Immersive Focus Timer (`/dashboard/focus`)
- Configurable **Pomodoro (25m)**, **Short Break (5m)**, and **Long Break (15m)** intervals.
- Circular SVG elapsed-time progress ring with smooth animations.
- **Task Linker:** Attribute study sessions directly to specific pending assignments.
- **Procedural Web Audio Engine:** Generates soothing ambient soundscapes (*Gentle Rain Pink Noise, White Noise, 10Hz Binaural Alpha Waves*) directly via browser audio synthesis without external MP3 files.
- **Zen Mode:** Distraction-free full-screen environment (keyboard exit with <kbd>ESC</kbd> and toggle with <kbd>Space</kbd>).

### 3. 📝 Split-Pane Study Notes (`/dashboard/notes`)
- Clean two-pane student workspace: filterable notebook on the left, active editor on the right.
- Real-time markdown preview rendering headers, bullet points, code blocks, and mathematical equations.
- Auto-saving state to `localStorage` with character count indicators.
- Quick note pinning and course subject tagging.

### 4. 📅 Academic Schedule & Calendar (`/dashboard/calendar`)
- Full interactive monthly calendar grid with course color-coded task pills.
- Date agenda inspector: click on any date to inspect scheduled deadlines and assign new tasks directly.
- Quick navigation controls (*Previous Month, Next Month, Today*).

### 5. 📊 Empirical Productivity Analytics (`/dashboard/analytics`)
- Built with **Recharts** for crisp, responsive data visualization in both light and dark modes:
  - **Weekly Study Time (Bar Chart):** Daily study hours logged vs. 4h target baseline.
  - **Subject Distribution (Donut Chart):** Visual time allocation across academic disciplines.
  - **14-Day Momentum Trend (Area Chart):** Completed task volume and session velocity over time.
- Metrics dashboard: total study hours, completion percentages, and 7-day study streak tracking.

### 6. 🎨 Workspace Customization & Settings (`/dashboard/settings`)
- Profile editor with student major, university, and daily study targets.
- **Live Background Pattern Switcher:**
  - *Architectural Grid:* Fine technical graph lines with radial falloff.
  - *Dot Matrix:* Modern subtle dot grid.
  - *Minimalist Solid:* Flat, distraction-free canvas.
- Complete data ownership: **Single-click JSON Backup Export** and sample data reset.

### 7. ⌨️ Global Command Palette (<kbd>Ctrl</kbd> + <kbd>K</kbd>)
- Access search across all tasks, notes, routes, and quick actions from anywhere in the application.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Framework** | React 19, TypeScript |
| **Bundler & Tooling** | Vite 8, PostCSS, Autoprefixer |
| **Routing** | React Router (`HashRouter` for robust static hosting) |
| **Styling** | Tailwind CSS 3.4 (with `class` dark mode strategy) |
| **Icons** | Lucide React |
| **Visualizations** | Recharts |
| **Audio Engine** | Web Audio API (procedural synthesis) |
| **Deployment** | GitHub Actions CI/CD $\rightarrow$ GitHub Pages |

---

## 📂 Project Structure

```
focusflow/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions automated Pages deployment
├── public/
│   ├── favicon.svg             # Brand SVG favicon
│   └── icons.svg
├── src/
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces (Task, Note, Session, Settings)
│   ├── data/
│   │   └── mockData.ts         # Realistic STEM starter dataset
│   ├── context/
│   │   ├── AppContext.tsx      # Central reactive state & localStorage sync
│   │   └── ThemeContext.tsx    # Light/Dark mode state provider
│   ├── utils/
│   │   ├── audio.ts            # Web Audio procedural sound synthesizer
│   │   └── formatters.ts       # Dates, durations, and subject color styles
│   ├── components/
│   │   ├── common/             # Button, Badge, Modal, CommandPalette
│   │   └── layout/             # Topbar, Sidebar, NotificationsModal, DashboardLayout
│   ├── pages/
│   │   ├── LandingPage.tsx     # Hero, interactive preview mockup, features, CTA
│   │   ├── AuthPage.tsx        # Login/Sign-up with 1-click evaluator access
│   │   └── dashboard/          # Overview, Tasks, Focus, Notes, Calendar, Analytics, Settings
│   ├── App.tsx                 # Route declarations with HashRouter
│   ├── main.tsx                # React DOM entry point
│   └── index.css               # Tailwind directives & architectural backgrounds
├── tailwind.config.js          # Brand tokens, fonts, and dark mode configuration
├── vite.config.ts              # Vite configuration with GitHub Pages base path
└── package.json
```

---

## 🚀 Running Locally

To run FocusFlow on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rana-Kushagr/Focus-Flow.git
   cd Focus-Flow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 👨‍💻 Author & Evaluation

Developed by **Rana Kushagr** as an advanced frontend UI engineering recruitment demonstration.

* **GitHub Repository:** [https://github.com/Rana-Kushagr/Focus-Flow](https://github.com/Rana-Kushagr/Focus-Flow)
* **Live Web Application:** [https://rana-kushagr.github.io/Focus-Flow/](https://rana-kushagr.github.io/Focus-Flow/)
