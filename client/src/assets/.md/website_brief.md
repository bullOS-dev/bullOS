# bullOS Terminal Web Brief & Design Specification (React + Tailwind CSS + Node.js)

This document defines the requirements, design aesthetic, and technical specifications for the **bullOS** project website. The website is modeled on a retro mainframe CRT terminal that acts as a live console for a cutting-edge, next-generation Solana Trenching Engine ($bOS).

---

## 1. Core Mandates
1. **Strict Language Policy**: All user-facing text, terminal logs, code snippets, documentation, console commands, and code comments must be written in professional, domain-specific **English**. No Indonesian is allowed anywhere in the code.
2. **Tone & Vocabulary**: The language must sound smart, authoritative, and deeply technical. Use authentic Web3 engineering, quant, and MEV searcher terminology (e.g., *Jito block engine*, *mempool frontrunning*, *sandwich protection wrapper*, *execution latency profiling*, *slippage auto-heuristics*, *multi-sig dispersion routing*).
3. **Interactive Visuals**: The console components must not be static text. They must feature dynamic, interactive dashboards, flashing status matrices, and retro charts reacting to user inputs.
4. **Base Aesthetic Inverse Color Scheme**: 
   * The primary background color is **Phosphor Green (`#00ff00`)**.
   * All text, borders, icons, and active visuals are **Deep Black (`#000000`)**.
   * This mimics an illuminated, fully lit retro green phosphor screen operating in reverse-video mode.

---

## 2. Concept & Vibe Guidelines
The site should resemble an early CRT operating system interface operating in reverse-video. It must feel analog, highly technical, and deliberate, avoiding the smooth curves, soft gradients, and rounded edges of modern Web3/AI landing pages.

* **Color Palette**:
  * Background: `#00ff00` (Matrix Green / Phosphor Green)
  * Primary Text/Accent: `#000000` (Deep Black)
  * Secondary Text: `#003300` (Dimmable dark green for low-priority logs)
  * Terminal Selection Highlight: `#008800` background with `#000000` text
* **Typography**:
  * Monospaced throughout.
  * Custom font directory path: `src/assets/fonts/` (loaded via `@font-face` and mapped in Tailwind config).
* **Visual FX**:
  * CRT monitor scanlines (subtle black horizontal pixel grid overlay).
  * Monochromatic black shadow/glow effects (`text-shadow: 0 0 2px rgba(0, 0, 0, 0.3)`).
  * Ascii Art branding headers in black text.
  * Blinking console cursors (`_` or solid square block `█` in black).
  * Hard borders (`1px solid #000000`) and tabular grids instead of rounded cards.

---

## 3. Technical Stack
* **Frontend**: React.js
* **Styling**: Tailwind CSS (customized for retro theme, fonts, and black-on-green visual rules)
* **Backend**: Node.js + Express (serving mock API endpoints simulating live Solana on-chain data stream)

---

## 4. Page Structure & Components
The frontend operates as a single-page terminal emulator with tabbed views or modular screen panels interacting with the Node.js backend.

### Panel A: System Registry (Left Sidebar / Navigation)
* ASCII logo: `bullOS [v1.0.0]` (Rendered in black text)
* System status readout:
  * `OS: bOS Core v1.0`
  * `ENGINE: Solana Trenching v2.6`
  * `TICKER: $bOS`
  * `X_HANDLE: @usebullOS`
  * `DOMAIN: bullOS.dev`
* Menu navigation folders (The Next-Gen Trenching Suite):
  * `01_MANIFESTO.TXT` (The bOS breakthrough paradigm)
  * `02_AUTO_SNIPER.EXE` (Autonomous Trenching & frontrun monitor)
  * `03_ANSEM_SENTINEL.SH` (Social-to-onchain execution latency tracker)
  * `04_SYNDICATE_WAR_ROOM.DAT` (Black Bulls coordinated liquidity routing)
  * `05_CURVE_PREDICT.CFG` (Bonding Curve migration math & analytics)

### Panel B: Main Console Output (Center Area)
* The active window showing the selected system registry file contents or the active live monitoring UI (black text/visuals on green background).
* Displays dynamic logs streaming from the Node.js backend.
* Contains a typewriter effect when files load.
* CRT screen flicker animation on mount.

### Panel C: Live Feed / System logs (Bottom Status Bar)
* Simulates live-running processes (e.g., wallet activity, block scanner alerts, or simulated memory scans).
* Blinking terminal input prompt at the bottom: `guest@bullOS:~$ _` (black text on green background).

---

## 5. Interactive Visual Elements & Component Specifications

### 1. `02_AUTO_SNIPER.EXE` (Autonomous Trenching Dashboard)
* **Interactive Element**: A "TRIGGER MANUAL SNIPE" button (black border/fill) that generates a mock transaction on the terminal screen with scrolling execution details.
* **Visual**: A scanning radar sweep effect (black CSS animation) next to the scrolling sniper logs.
* **Logs Stream**:
  ```
  [02:35:10.042] [SCANNER] Detected launch: $PEPE69 | Liquidity: 30 SOL
  [02:35:10.088] [ANALYST] Dev wallet bundle check: PASSED (Low risk index: 0.12)
  [02:35:10.120] [SNIPER] Routing TX via Jito block engine...
  [02:35:10.450] [CONFIRMED] Position secured. Tx: 4z9v...9x2w | Cost: 0.5 SOL | Price Impact: <0.05%
  ```

### 2. `03_ANSEM_SENTINEL.SH` (Social-to-Onchain Latency Profiler)
* **Interactive Element**: An interactive coordinate chart showing Ansem's social events and the corresponding $bOS transaction execution. The user can hover over nodes to see details.
* **Visual**: A retro vector line chart (drawn in black) showing a spike in volume against social media triggers.
* **Latency Profile Log**:
  ```
  [ALERT] Ansem wallet activity detected / X tweet matching trigger: "what token next?"
  [SENTINEL] Parsing context... High probability match for Solana ticker. Target identified.
  [EXECUTION] Automated buy order routed | Latency: 412ms | Position size: 5 SOL.
  ```

### 3. `04_SYNDICATE_WAR_ROOM.DAT` (Black Bulls Coordinated Routing)
* **Interactive Element**: An active grid of 8 nodes representing distributed wallet clusters. Clicking "SIMULATE DISPERSION" triggers a visual flow animation showing liquidity being sent from a central pool to separate nodes.
* **Visual**: Flashing indicators (`ACTIVE / IDLE / EXECUTED`) and animated lines connecting nodes to represent transaction dispersion.
* **Status Readout**:
  ```
  [WAR_ROOM] Distributed Wallet dispersion matrix initialized.
  [STATUS] Node 1: STAGED | Node 2: EXECUTED | Node 3: STAGED | Node 4: IDLE
  ```

### 4. `05_CURVE_PREDICT.CFG` (Bonding Curve Migration Predictor)
* **Interactive Element**: A selector of different trending tokens. Choosing a token renders its current bonding curve status, holder statistics, and a countdown timer representing Raydium migration.
* **Visual**: A segmented retro progress bar (using characters like `[████████████░░░░]` in black) updating in real-time.
* **Analytics Readout**:
  ```
  [PREDICTOR] Token $WIF2 bonding curve progress: 96.4%
  [PREDICTOR] Estimated graduation: 45 seconds | Estimated buy volume: High
  [STRATEGY] Target exit configured at Raydium pool creation block.
  ```

---

## 6. Backend Specifications (Node.js + Express)
The backend server serves API endpoints providing realistic, fast-moving JSON data feeds to populate the interactive React components.

### Endpoints (Strict English Output)
1. **`/api/trench-stream`**: Streams Server-Sent Events (SSE) representing block scanner alerts, Jito bundle routing, and auto-sniping confirmations.
2. **`/api/ansem-sentinel`**: Returns JSON payloads tracking Ansem's mock wallet activity, Twitter webhook states, and reaction times in milliseconds.
3. **`/api/syndicate-nodes`**: Returns the current state, balances, and routing configurations for the Black Bulls multi-wallet nodes.
4. **`/api/curve-data`**: Returns real-time changing bonding curve metrics, graduation estimations, and threat analyses.
