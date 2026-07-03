import React, { useState, useEffect } from 'react';

const defaultSentinelData = {
  status: "ACTIVE",
  sentinelLatencyAvg: "389ms",
  activeTriggers: ["$bOS", "trench", "pump", "send"],
  timeline: [
    { id: 1, timestamp: "02:10:05", tweet: "Solana season is here", type: "TWEET", latencyMs: 580, intensity: 4, executionsCount: 15, log: "Detected tweet activity from ANSEM. Classifying sentiment..." },
    { id: 2, timestamp: "02:18:44", tweet: "whats the next play?", type: "TRIGGER", latencyMs: 412, intensity: 9, executionsCount: 45, log: "Trigger match: next play. Automated buy routing activated." },
    { id: 3, timestamp: "02:25:12", tweet: "check out this chart structure", type: "TWEET", latencyMs: 650, intensity: 3, executionsCount: 8, log: "Detected image link check from ANSEM. Ignored - no buy trigger." },
    { id: 4, timestamp: "02:38:30", tweet: "bulls are running $bOS", type: "TRIGGER", latencyMs: 290, intensity: 10, executionsCount: 124, log: "Trigger match: $bOS. Initiated buy bundle lock via Jito." },
    { id: 5, timestamp: "02:44:18", tweet: "giga send incoming", type: "TWEET", latencyMs: 490, intensity: 6, executionsCount: 32, log: "Detected sentiment tweet. Intensity level 6." },
    { id: 6, timestamp: "02:51:02", tweet: "pump it higher", type: "TRIGGER", latencyMs: 310, intensity: 8, executionsCount: 88, log: "Trigger match: pump. Transacted 5 SOL on bonding curve." }
  ]
};

const logTemplates = [
  "[ALERT] Ansem tweeted: 'sending solana memecoins higher today' | Analyzing sentiment...",
  "[SENTINEL] Ansem social trigger match: 'wif is the play' | Probability score: 94%",
  "[EXECUTION] Firing Jito bundle buy order for Black Bulls target CA | Latency: 280ms",
  "[WAR_ROOM] Coordinated wallet dispersion staging complete | Destination: BULL_NODE_04",
  "[ALERT] Ansem wallet movement: transferred 250 SOL to Pumpswap pool maker",
  "[SENTINEL] Scanning X/Twitter feed for keywords: 'bull', 'ansem', 'graduation'...",
  "[EXECUTION] Custom bonding curve predict engine locked target | Progress: 98.2%",
  "[MEMPOOL] Anti-frontrun wrapper deployed successfully for Black Bulls signature",
  "[WAR_ROOM] Node BULL_NODE_08 balance synced: 312.75 SOL | Handshake SUCCESS",
  "[ALERT] Ansem X post detected: 'bulls are running bOS mainframe' | Latency threshold: 84ms",
  "[SENTINEL] NLP intent classify: BUY order extraction match | Target: SOL | Sender: ANSEM",
  "[EXECUTION] Automated buy execution landed block: 284902154 | Slot latency: 12ms",
  "[MEMPOOL] Tracking graduation curves for 4 active Black Bulls Trench listings...",
  "[WAR_ROOM] Distributed multisig route initialized | Latency load balancer: 45ms",
  "[ALERT] Ansem buy alert: 'buying the bull dip' | Executing matching sniper matrix...",
  "[SENTINEL] Sentiment scoring tweet: 'solana bulls are unstoppable' | Score: 98% BULLISH",
  "[EXECUTION] Sniped bonding curve graduation token for 5 SOL | Fee: 0.01 SOL Jito tip"
];

export default function AnsemSentinelView() {
  const [activeSubTab, setActiveSubTab] = useState('install');
  const [sentinelState, setSentinelState] = useState(defaultSentinelData);
  const [selectedNode, setSelectedNode] = useState(defaultSentinelData.timeline[defaultSentinelData.timeline.length - 1]);
  const [loading, setLoading] = useState(false);

  // Live NLP Simulation State
  const [nlpStep, setNlpStep] = useState(0);
  const nlpFeed = [
    { text: "ANSEM: 'solana feels extremely fast today, buying some wif'", tokens: { action: "BUY", asset: "WIF", source: "ANSEM", volume: "AUTO" } },
    { text: "USER: 'send 5 SOL to cap.sol right now'", tokens: { action: "TRANSFER", asset: "SOL", volume: "5", recipient: "cap.sol" } },
    { text: "PUMP_BOT: 'WIF2 token bonding curve graduated, pool active'", tokens: { action: "ROUTE_POOL", asset: "WIF2", target: "PUMPSWAP" } },
    { text: "ANSEM: 'what memecoin should we buy next? bonk?'", tokens: { action: "SCAN", keyword: "BONK", source: "ANSEM", probability: "89%" } }
  ];

  // Real-time dynamic logs state
  const [liveLogs, setLiveLogs] = useState([
    { time: "02:51:00", text: "[ALERT] Ansem wallet activity detected / X tweet matching trigger: 'what token next?'" },
    { time: "02:51:01", text: "[SENTINEL] Parsing context... High probability match for Solana ticker. Target identified." },
    { time: "02:51:02", text: "[EXECUTION] Automated buy order routed | Latency: 412ms | Position size: 5 SOL." }
  ]);

  // NLP simulated ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setNlpStep(prev => (prev + 1) % nlpFeed.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [nlpFeed.length]);

  // Dynamic logs generator ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const randomText = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const now = new Date().toLocaleTimeString();
      setLiveLogs(prev => [...prev, { time: now, text: randomText }].slice(-6));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchSentinelData = async () => {
    try {
      const res = await fetch('/api/ansem-sentinel');
      const data = await res.json();
      setSentinelState(data);
      if (data.timeline && data.timeline.length > 0) {
        setSelectedNode(prev => {
          const exists = data.timeline.find(item => item.timestamp === prev?.timestamp);
          return exists || data.timeline[data.timeline.length - 1];
        });
      }
    } catch (err) {
      console.warn("Backend /api/ansem-sentinel offline. Utilizing local telemetry mocks.", err);
    }
  };

  useEffect(() => {
    fetchSentinelData();
    const interval = setInterval(fetchSentinelData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-4 text-terminal-black/70 animate-pulse font-mono text-base">Establishing Sentinel Link...</div>;
  }

  // Dimension helpers for SVG chart
  const width = 500;
  const height = 200;
  const padding = 30;

  // Offset coordinates slightly to avoid overlaying on vertical axis
  const points = sentinelState.timeline.map((item, index) => {
    const x = padding + 15 + (index * (width - 2 * padding - 25)) / (sentinelState.timeline.length - 1);
    const maxVal = 130;
    const y = height - padding - (item.executionsCount / maxVal) * (height - 2 * padding);
    return { x, y, item };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="flex flex-col p-6 gap-6 text-terminal-black font-sans box-border select-text">
      
      {/* Editorial View Header */}
      <div className="border-b border-terminal-black/30 pb-3 flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
        <div>
          <h2 className="font-mono text-3xl font-bold uppercase tracking-wide">
            [ 02 // ANSEM SENTINEL TELEMETRY ]
          </h2>
          <span className="text-sm font-bold uppercase mt-1 text-terminal-black/60 block">
            MODULE TARGET: SOCIAL TELEMETRY SCANNERS & NLP INTENT EXTRACTION
          </span>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex gap-2 select-none">
          <button
            onClick={() => setActiveSubTab('install')}
            className={`px-3 py-1.5 font-mono text-xs font-bold border transition-all cursor-pointer ${
              activeSubTab === 'install' 
                ? 'bg-terminal-black text-phosphor-green border-terminal-black' 
                : 'bg-phosphor-green/20 text-terminal-black border-terminal-black hover:bg-terminal-black hover:text-phosphor-green'
            }`}
          >
            01 // HOW TO INSTALL
          </button>
          <button
            onClick={() => setActiveSubTab('live')}
            className={`px-3 py-1.5 font-mono text-xs font-bold border transition-all cursor-pointer ${
              activeSubTab === 'live' 
                ? 'bg-terminal-black text-phosphor-green border-terminal-black' 
                : 'bg-phosphor-green/20 text-terminal-black border-terminal-black hover:bg-terminal-black hover:text-phosphor-green'
            }`}
          >
            02 // LIVE LATENCY MONITOR
          </button>
        </div>
      </div>

      {activeSubTab === 'install' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Docs Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-base font-bold uppercase border-b border-terminal-black/10 pb-1">
              PROMPT TEMPLATE DEFINITION
            </h4>
            <div className="text-base flex flex-col gap-3 font-semibold leading-relaxed text-terminal-black/95">
              <p>Sentinel parses raw chat or social feeds into target structures using customizable template rules:</p>
              <pre className="bg-black/5 p-4 font-mono select-text text-sm leading-normal overflow-x-auto">
{`export const transferTemplate = \`
Given the message: {{recentMessages}}
Extract details for a Solana transfer:
- Amount (number only)
- Token (SOL or symbol/mint)
- Recipient wallet or domain

Format response as:
<response>
  <amount>string</amount>
  <token>string</token>
  <recipient>string</recipient>
</response>\`;`}
              </pre>
            </div>
          </div>

          {/* Interactive Parsing Display (Moving Visual) */}
          <div className="p-4 flex flex-col justify-between gap-3">
            <span className="text-sm font-mono font-bold uppercase block mb-1 text-terminal-black/75 border-b border-terminal-black/10 pb-1">
              [ REAL-TIME NLP PARSER STREAM ]
            </span>
            
            <div className="bg-black text-[#00ff00] p-4 font-mono text-sm flex flex-col gap-4 border border-terminal-black min-h-[170px]">
              <div>
                <span className="text-white/60 font-bold block mb-1">&gt; FEED INPUT:</span>
                <span className="text-white font-semibold select-text">"{nlpFeed[nlpStep].text}"</span>
              </div>
              
              <div className="border-t border-white/20 pt-3">
                <span className="text-white/60 font-bold block mb-1.5">&gt; PARSED INTENT XML/JSON:</span>
                <pre className="text-sm font-bold text-[#00ff00] select-text">
                  {JSON.stringify(nlpFeed[nlpStep].tokens, null, 2)}
                </pre>
              </div>
            </div>

            <div className="text-sm font-sans font-bold text-terminal-black/75 mt-2 uppercase leading-normal tracking-wide">
              * The sentinel pipeline parses incoming web sockets and triggers Jito orders automatically.
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="border-b border-terminal-black pb-2 flex justify-between items-center">
              <span className="font-mono text-xl font-bold">[ 03_ANSEM_SENTINEL.SH ]</span>
              <span className="text-sm font-mono font-bold bg-terminal-black text-phosphor-green px-2.5 py-0.5 border border-terminal-black">
                AVG LATENCY: {sentinelState.sentinelLatencyAvg}
              </span>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="bg-phosphor-green/10 border border-terminal-black p-4 flex flex-col gap-3">
              <div className="relative flex justify-center items-center">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                  {/* Grid Lines */}
                  {[0, 1, 2, 3, 4].map(i => {
                    const yVal = padding + (i * (height - 2 * padding)) / 4;
                    return (
                      <line
                        key={i}
                        x1={padding}
                        y1={yVal}
                        x2={width - padding}
                        y2={yVal}
                        stroke="#000000"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                        opacity="0.25"
                      />
                    );
                  })}

                  {/* Axes */}
                  <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#000000" strokeWidth="2" />
                  <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#000000" strokeWidth="2" />

                  {/* Line Path */}
                  <path d={linePath} fill="none" stroke="#000000" strokeWidth="2.5" />

                  {/* Data Points */}
                  {points.map((p, i) => {
                    const isSelected = selectedNode && selectedNode.timestamp === p.item.timestamp;
                    return (
                      <g
                        key={i}
                        className="cursor-pointer"
                        onClick={() => setSelectedNode(p.item)}
                      >
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? 7.5 : 5.5}
                          fill={isSelected ? '#000000' : '#00ff00'}
                          stroke="#000000"
                          strokeWidth="2"
                          className="transition-all"
                        />
                        {p.item.type === 'TRIGGER' && (
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={12}
                            fill="none"
                            stroke="#000000"
                            strokeWidth="1.5"
                            opacity="0.5"
                            className="animate-ping"
                            style={{ animationDuration: '3s' }}
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Chart Legend */}
              <div className="flex justify-between items-center border-t border-terminal-black/15 pt-2 font-mono text-[10px] uppercase text-terminal-black/70">
                <span>[ Y-AXIS: b[OS] SNIPER EXECUTIONS ]</span>
                <span>[ X-AXIS: SOCIAL TIME SEQUENCE ]</span>
              </div>
            </div>

            {/* Live Latency Log Stream */}
            <div className="bg-black/5 p-3.5 text-sm font-sans leading-relaxed text-terminal-black select-text border border-terminal-black/10">
              <div className="font-bold border-b border-terminal-black/15 pb-1 mb-2 font-mono uppercase text-xs flex justify-between items-center select-none">
                <span>Real-Time Latency Log:</span>
                <span className="w-1.5 h-1.5 bg-terminal-black rounded-full animate-ping"></span>
              </div>
              <div className="flex flex-col gap-1 font-mono text-xs max-h-[110px] overflow-y-auto">
                {liveLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-terminal-black/45 font-sans select-none">[{log.time}]</span>
                    <span className="font-semibold text-terminal-black select-text leading-tight">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Sidebar Column */}
          <div className="w-full lg:col-span-4 flex flex-col gap-4">
            <span className="font-mono text-lg font-bold border-b border-terminal-black pb-2 uppercase">[ METRICS INSPECTOR ]</span>
            
            {selectedNode ? (
              <div className="flex-1 flex flex-col justify-between font-sans text-sm gap-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-terminal-black/70 block">EVENT CLASSIFICATION</span>
                    <span className={`inline-block px-2.5 py-1 text-xs font-bold border border-terminal-black mt-1 ${
                      selectedNode.type === 'TRIGGER' ? 'bg-terminal-black text-phosphor-green' : 'bg-transparent text-terminal-black'
                    }`}>
                      {selectedNode.type}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-terminal-black/70 block">POLLED TIMESTAMP</span>
                    <span className="font-mono font-bold mt-1 block select-text">{selectedNode.timestamp}</span>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-terminal-black/70 block">RAW FEED TEXT / LOG</span>
                    <p className="font-mono text-xs bg-black/5 p-2.5 border border-terminal-black/10 mt-1 select-text leading-relaxed font-semibold">
                      "{selectedNode.tweet || selectedNode.log}"
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-terminal-black/70 block">SNIPER TRANSACTIONS FIRED</span>
                    <span className="font-mono font-bold text-xl text-terminal-black block mt-1">{selectedNode.executionsCount} EXECUTIONS</span>
                  </div>
                </div>

                <div className="text-xs font-sans font-bold leading-normal text-terminal-black/80 border-t border-terminal-black/20 pt-3">
                  Click on scatter coordinates in the latency timeline to inspect historical data blocks.
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-terminal-black/60 italic text-sm font-mono">
                Select timeline coordinate node.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
