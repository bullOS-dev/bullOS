import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory state for mock simulations
let activeSseClients = [];
let syndicateNodes = [
  { id: 1, name: "BULL_NODE_01", status: "ACTIVE", balance: "142.50 SOL", txCount: 154, ip: "102.15.22.101", target: "STAGED" },
  { id: 2, name: "BULL_NODE_02", status: "ACTIVE", balance: "89.15 SOL", txCount: 92, ip: "102.15.22.102", target: "EXECUTED" },
  { id: 3, name: "BULL_NODE_03", status: "ACTIVE", balance: "210.40 SOL", txCount: 201, ip: "102.15.22.103", target: "STAGED" },
  { id: 4, name: "BULL_NODE_04", status: "ACTIVE", balance: "55.80 SOL", txCount: 64, ip: "102.15.22.104", target: "IDLE" },
  { id: 5, name: "BULL_NODE_05", status: "ACTIVE", balance: "178.90 SOL", txCount: 133, ip: "102.15.22.105", target: "EXECUTED" },
  { id: 6, name: "BULL_NODE_06", status: "ACTIVE", balance: "94.65 SOL", txCount: 88, ip: "102.15.22.106", target: "STAGED" },
  { id: 7, name: "BULL_NODE_07", status: "ACTIVE", balance: "120.30 SOL", txCount: 110, ip: "102.15.22.107", target: "IDLE" },
  { id: 8, name: "BULL_NODE_08", status: "ACTIVE", balance: "312.75 SOL", txCount: 290, ip: "102.15.22.108", target: "EXECUTED" }
];

let isDispersionSimulating = false;

// Mock Bonding Curve data (mutates slowly over time)
let curveData = [
  { id: "bos", ticker: "$bOS", name: "bullOS Trenching Engine", progress: 84.6, volume: "12,450 SOL", holders: 3422, etaSeconds: 120, threatLevel: "LOW" },
  { id: "wif2", ticker: "$WIF2", name: "Dogwifhat Reloaded", progress: 96.4, volume: "24,890 SOL", holders: 8123, etaSeconds: 45, threatLevel: "MEDIUM" },
  { id: "ansem", ticker: "$ANSEM", name: "Ansem Sentinel Token", progress: 62.1, volume: "8,920 SOL", holders: 1980, etaSeconds: 420, threatLevel: "LOW" },
  { id: "trench", ticker: "$TRENCH", name: "Trench Raider", progress: 41.8, volume: "5,300 SOL", holders: 1102, etaSeconds: 840, threatLevel: "HIGH" }
];

// Helper to broadcast to SSE clients
function broadcastLog(log) {
  activeSseClients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(log)}\n\n`);
  });
}

// 1. SSE Trench Stream Endpoint
app.get('/api/trench-stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  activeSseClients.push(newClient);

  // Send greeting/initial status
  const initLog = {
    timestamp: new Date().toLocaleTimeString(),
    sender: "SYSTEM",
    message: "Solana Trenching Engine v2.6 connection established. Scanning Jito block mempool..."
  };
  res.write(`data: ${JSON.stringify(initLog)}\n\n`);

  req.on('close', () => {
    activeSseClients = activeSseClients.filter(c => c.id !== clientId);
  });
});

// Periodic background log generation to simulate activity
setInterval(() => {
  const senders = ["SCANNER", "ANALYST", "SNIPER", "JITO_ENGINE", "MEMPOOL"];
  const tickers = ["$MOUTON", "$GIGA", "$WIF", "$SPX", "$PINE", "$SOLCAT"];
  const selectedSender = senders[Math.floor(Math.random() * senders.length)];
  
  let msg = "";
  switch(selectedSender) {
    case "SCANNER":
      msg = `Detected new pump.fun launch: ${tickers[Math.floor(Math.random() * tickers.length)]} | Initial Liq: 30 SOL. Checking developer history...`;
      break;
    case "ANALYST":
      msg = `Calculated risk metrics: Dev bundle fraction is ${ (Math.random() * 0.25).toFixed(2) } | Sandbox simulation PASSED.`;
      break;
    case "SNIPER":
      msg = `Position lock acquired. Slippage threshold configured at 1.5%. Preparing raw transaction payload...`;
      break;
    case "JITO_ENGINE":
      msg = `Bundling snipe TX with tip 0.01 SOL. Submitting bundle to block engine...`;
      break;
    case "MEMPOOL":
      msg = `Monitored liquidity lock status: SUCCESS. Dynamic anti-sandwich wrapper engaged.`;
      break;
  }

  broadcastLog({
    timestamp: new Date().toLocaleTimeString(),
    sender: selectedSender,
    message: msg
  });
}, 4500);

// Periodically update bonding curve numbers slightly
setInterval(() => {
  curveData = curveData.map(c => {
    if (c.progress < 100) {
      const increment = parseFloat((Math.random() * 0.6).toFixed(2));
      let newProgress = Math.min(100, c.progress + increment);
      let newEta = Math.max(0, c.etaSeconds - Math.round(increment * 5));
      if (newProgress >= 100) {
        newProgress = 15.0; // reset simulation
        newEta = 900;
      }
      return {
        ...c,
        progress: parseFloat(newProgress.toFixed(1)),
        etaSeconds: newEta,
        volume: `${(parseFloat(c.volume.replace(/,/g, '').split(' ')[0]) + Math.random() * 10).toFixed(0)} SOL`
      };
    }
    return c;
  });
}, 2000);

// 2. Manual Snipe Trigger Endpoint
app.post('/api/snipe', (req, res) => {
  const { ticker = "$bOS_MOCK" } = req.body;

  // Send a sequence of fast logs representing the manual snipe
  const sequence = [
    { delay: 100, sender: "SCANNER", message: `[MANUAL TRIGGER] Sniping target initialized: ${ticker}` },
    { delay: 400, sender: "ANALYST", message: `[MANUAL TRIGGER] Evaluating token safety score: 98/100 (Safe)` },
    { delay: 700, sender: "SNIPER", message: `[MANUAL TRIGGER] Fast-path routing transaction via Jito validator nodes...` },
    { delay: 1100, sender: "JITO_ENGINE", message: `[MANUAL TRIGGER] Bundle validated. Landed block: 284902120 | Slot latency: 19ms.` },
    { delay: 1300, sender: "CONFIRMED", message: `[MANUAL TRIGGER] Position SECURED. Swapped 1.00 SOL for 254,921.84 ${ticker} (Impact: 0.01%).` }
  ];

  sequence.forEach(step => {
    setTimeout(() => {
      broadcastLog({
        timestamp: new Date().toLocaleTimeString(),
        sender: step.sender,
        message: step.message
      });
    }, step.delay);
  });

  res.json({ success: true, message: `Manual snipe sequence initiated for ${ticker}` });
});

// 3. Ansem Sentinel Endpoint
app.get('/api/ansem-sentinel', (req, res) => {
  // Generate historical coordinate data representing Social tweets vs Execution Latencies
  const socialTimeline = [
    { id: 1, timestamp: "02:10:05", tweet: "Solana season is here", type: "TWEET", latencyMs: 580, intensity: 4, executionsCount: 15 },
    { id: 2, timestamp: "02:18:44", tweet: "whats the next trench play?", type: "TRIGGER", latencyMs: 412, intensity: 9, executionsCount: 45 },
    { id: 3, timestamp: "02:25:12", tweet: "check out this chart structure", type: "TWEET", latencyMs: 650, intensity: 3, executionsCount: 8 },
    { id: 4, timestamp: "02:38:30", tweet: "bulls are running $bOS", type: "TRIGGER", latencyMs: 290, intensity: 10, executionsCount: 124 },
    { id: 5, timestamp: "02:44:18", tweet: "giga send incoming", type: "TWEET", latencyMs: 490, intensity: 6, executionsCount: 32 },
    { id: 6, timestamp: "02:51:02", tweet: "pump it higher", type: "TRIGGER", latencyMs: 310, intensity: 8, executionsCount: 88 }
  ];

  res.json({
    status: "ACTIVE",
    sentinelLatencyAvg: "389ms",
    activeTriggers: ["$bOS", "trench", "pump", "send"],
    timeline: socialTimeline
  });
});

// 4. Syndicate Nodes Endpoint
app.get('/api/syndicate-nodes', (req, res) => {
  res.json({
    simulating: isDispersionSimulating,
    nodes: syndicateNodes
  });
});

// Post action to trigger Syndicate dispersion simulation
app.post('/api/syndicate-nodes/disperse', (req, res) => {
  if (isDispersionSimulating) {
    return res.status(400).json({ error: "Dispersion simulation already in progress" });
  }

  isDispersionSimulating = true;
  
  // Broadcast a system log via the SSE stream
  broadcastLog({
    timestamp: new Date().toLocaleTimeString(),
    sender: "WAR_ROOM",
    message: "[DISPERSION] Initiating multi-sig liquidity dispersion routing matrix to all 8 nodes..."
  });

  // Cycle the nodes state
  syndicateNodes = syndicateNodes.map(n => ({
    ...n,
    status: "ROUTING",
    balance: (parseFloat(n.balance.split(' ')[0]) - 5).toFixed(2) + " SOL"
  }));

  // Step 2: Finalize dispersion
  setTimeout(() => {
    syndicateNodes = syndicateNodes.map(n => {
      let finalState = n.target;
      let balanceAdded = finalState === "EXECUTED" ? 15.00 : 5.00;
      if (finalState === "IDLE") balanceAdded = 0.00;
      return {
        ...n,
        status: finalState,
        balance: (parseFloat(n.balance.split(' ')[0]) + balanceAdded).toFixed(2) + " SOL",
        txCount: n.txCount + 1
      };
    });
    isDispersionSimulating = false;

    broadcastLog({
      timestamp: new Date().toLocaleTimeString(),
      sender: "WAR_ROOM",
      message: "[DISPERSION] Coordinated liquidity routing complete. Nodes returned to target configurations."
    });
  }, 3500);

  res.json({ success: true, message: "Dispersion routing simulated" });
});

// 5. Bonding Curve Data Endpoint
app.get('/api/curve-data', (req, res) => {
  res.json({
    telemetryTimestamp: new Date().toISOString(),
    metrics: curveData
  });
});

app.listen(PORT, () => {
  console.log(`bullOS Mainframe API running on http://localhost:${PORT}`);
});
