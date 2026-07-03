# bullOS ($bOS) - Solana Trenching Engine Console

An advanced, reverse-video CRT mainframe terminal console interface and agent orchestration system for **bullOS** ($bOS)—the next-generation Solana Trenching Engine.

Designed for high-performance quant developers and MEV searchers, this application automates token launches, snipe triggers, and coordinated liquidity routing. It features an immersive retro phosphor-green interface (`#00ff00` background with `#000000` text) matching modern developer telemetry standards.

---

## 🏗️ Architecture Overview

The system consists of three distinct architectural layers aligned with the specifications in [bullos_docs.md](file:///Users/pensht/Desktop/bullOS/bOS-web/src/frontend/assets/.md/bullos_docs.md):

1. **Frontend Web Console (React + Vite + Tailwind CSS)**:
   A retro CRT-style dashboard with typewriter animations, pixel grids, and active dashboards for real-time monitoring of pump.fun bonding curves, Ansem sentiment-to-onchain latency tracking, and wallet node dispersion maps.
2. **Backend SSE Telemetry Server (Node.js + Express)**:
   A lightweight streaming server that broadcasts block scanner alerts, Jito validator block confirmations, coordinate vectors, and node routing actions.
3. **bullOS Agent Runtime Core (TypeScript)**:
   Standardized character definitions (`src/character.ts`) and project entry configuration (`src/index.ts`) matching the formal runtime specifications of the bullOS framework.

---

## 📂 Project Directory Structure

The repository is structured to separate front-end interfaces, back-end servers, and agent configurations:

```text
bOS-web/
├── backend/                   # 🖥️ Express mock telemetry server
│   ├── server.js              # SSE streams and database node routers
│   └── package.json           # Backend dependency configuration
│
├── src/                       # 📂 Source Workspace
│   ├── frontend/              # 🎨 React client source (isolated folder)
│   │   ├── assets/            # Fonts, branding logos, and documents
│   │   ├── components/        # CRT modular panels (Manifesto, Sniper, etc.)
│   │   ├── App.jsx            # Layout manager
│   │   ├── main.jsx           # Vite module bootstrap
│   │   └── index.css          # Phosphor green CRT styles & variables
│   │
│   ├── plugins/               # 🔌 Custom agent extensions
│   │   └── trench-plugin/     # Custom Solana Trenching Plugin
│   │       ├── actions/       # Agent executor triggers (snipeAction.ts)
│   │       ├── providers/     # State modifiers (latencyProvider.ts)
│   │       └── index.ts       # Plugin registry loader
│   │
│   ├── __tests__/             # 🧪 Agent and plugin test specs
│   │   ├── character.test.ts  # Config verify suite
│   │   └── plugin.test.ts     # Action/provider validation suite
│   │
│   ├── character.ts           # 👤 bullOS Agent Character profile config
│   └── index.ts               # 🚀 Project orchestration entry point
│
├── .env.example               # 🔑 Configuration blueprint template
├── .gitignore                 # 🔒 Security filters to prevent credential leaks
├── index.html                 # HTML entry point (points to src/frontend/main.jsx)
├── tsconfig.json              # 🛠️ TypeScript compile options
├── vite.config.js             # Vite building proxy configuration
└── package.json               # Main package dependencies & run scripts
```

---

## 🔑 Secure Environment Configuration

Because the bullOS engine interacts directly with the Solana blockchain, private RPC networks, and AI model APIs, secret keys must never be pushed to public repositories.

1. **`.gitignore` Integration**: 
   The `.gitignore` has been updated with strict filters to ensure local databases (`.bullOS/`), Node modules (`node_modules/`), compiled outputs (`dist/`), and all local secret files (`.env`, `.env.local`, `.env.*`) are never committed to GitHub.
2. **`.env.example` Blueprint**:
   Use the provided [.env.example](file:///Users/pensht/Desktop/bullOS/bOS-web/.env.example) file as a reference for required key mappings.

To configure your workspace:
```bash
cp .env.example .env
# Open .env and add your private RPC links and API tokens
```

---

## 🛠️ Installation and Run Instructions

Ensure you have [Node.js](https://nodejs.org) (v18+) or [Bun](https://bun.sh) installed.

### 1. Install Workspace Dependencies
Execute this command at the project root to install the required packages:
```bash
npm install
```

### 2. Run the Development System
To start both the mock telemetry backend and the frontend client concurrently, run the following:

* **Terminal A (Vite Frontend client)**:
  ```bash
  npm run dev
  ```
  *The app will run at `http://localhost:5173`*

* **Terminal B (Node SSE Server)**:
  ```bash
  npm run server
  ```
  *The backend will run at `http://localhost:5000`*

### 3. Build for Production
To bundle the frontend application into static assets optimized for staging or cloud servers:
```bash
npm run build
```

---

## 🧪 Testing Agent Configurations

Unit tests have been provided to validate the agent and custom plugin specifications. You can configure testing environments using standard runners like `vitest` or `bun test`.

Run tests:
```bash
# Run tests inside the tests directory
npm run test
```

---

## 📜 Core Technical Documents
- [bullOS Specifications & Architecture Guide](file:///Users/pensht/Desktop/bullOS/bOS-web/src/frontend/assets/.md/bullos_docs.md)
- [Website Design & Component Brief](file:///Users/pensht/Desktop/bullOS/bOS-web/src/frontend/assets/.md/website_brief.md)
