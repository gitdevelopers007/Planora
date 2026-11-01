# Planora — AI-Powered Celebration & Event Planner

> **Planning made effortless with AI**

Planora is an intelligent companion for planning unforgettable celebrations. It connects your budget, milestone timeline, and vendor checklists into one unified plan — so when guest count or priorities change, everything updates dynamically.

---

## 🌟 Key Features

- **Smart Budget Allocation:** Real-time distribution across categories with lock protection, per-plate breakdowns, and AI trade-off suggestions.
- **Dynamic Timeline & Milestones:** Phase-grouped task checklist with dependency tracking, venue delay recalculations, and calendar (.ics) export.
- **Vendor Quotation Analyzer:** Paste vendor quotes to automatically extract line items, taxes, and hidden fees for side-by-side comparison.
- **AI Event Coach:** Contextual event advice powered by Gemini to brainstorm themes, optimize schedules, and review plans.
- **Accessible & Responsive:** Full dark/light mode support, WCAG AA 4.5:1+ contrast compliance, and keyboard-first navigation.

---

## 🚀 Quick Start

### 1. Installation

```bash
git clone https://github.com/gitdevelopers007/Planora.git
cd Planora
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: The core planner functions completely offline with built-in presets; the Gemini API key powers real-time AI suggestions and freeform intake parsing).*

### 3. Run Locally

Start the development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Verification & Testing

Run the full automated test suite:

```bash
npm run check
```

Run end-to-end browser tests:

```bash
npm run e2e
```

Build for production:

```bash
npm run build
```

---

## 🔒 Security

Planora keeps all API credentials server-side and never exposes keys to the browser bundle. For security policies and responsible disclosure, please refer to [SECURITY.md](SECURITY.md).
