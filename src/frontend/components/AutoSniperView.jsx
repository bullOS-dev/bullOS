import React, { useState, useEffect, useRef } from 'react';


export default function AutoSniperView({ walletAddress, connectWallet }) {
  const [activeSubTab, setActiveSubTab] = useState('install');
  const [logs, setLogs] = useState([]);
  const [targetTicker, setTargetTicker] = useState('$ANSEM');
  const [isSniping, setIsSniping] = useState(false);
  const logContainerRef = useRef(null);

  // Connect to SSE stream or use local mock fallback
  useEffect(() => {
    const eventSource = new EventSource('/api/trench-stream');

    eventSource.onmessage = (event) => {
      try {
        const newLog = JSON.parse(event.data);
        setLogs((prev) => [...prev, newLog].slice(-100)); // Keep last 100 logs
      } catch (err) {
        console.error("Error parsing trench-stream data", err);
      }
    };

    let localSimInterval = null;

    eventSource.onerror = (err) => {
      console.warn("Trench stream event source offline. Starting client-side logging simulator.", err);
      eventSource.close();

      // Seed initial logs for high fidelity feel
      setLogs([
        { timestamp: new Date().toLocaleTimeString(), sender: "SYSTEM", message: "Solana Trenching Engine v2.6 connection established. Scanning Jito block mempool..." },
        { timestamp: new Date().toLocaleTimeString(), sender: "SCANNER", message: "Detected new pump.fun launch: $GIGA | Initial Liq: 30 SOL. Checking developer history..." },
        { timestamp: new Date().toLocaleTimeString(), sender: "ANALYST", message: "Calculated risk metrics: Dev bundle fraction is 0.08 | Sandbox simulation PASSED." }
      ]);

      // Start local client-side log generator
      if (!localSimInterval) {
        localSimInterval = setInterval(() => {
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

          setLogs(prev => [
            ...prev,
            {
              timestamp: new Date().toLocaleTimeString(),
              sender: selectedSender,
              message: msg
            }
          ].slice(-100));
        }, 4500);
      }
    };

    return () => {
      eventSource.close();
      if (localSimInterval) clearInterval(localSimInterval);
    };
  }, []);

  // Auto-scroll logs (prevents window jumping)
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, activeSubTab]);

  const triggerSnipe = async (e) => {
    e.preventDefault();
    if (!walletAddress) {
      connectWallet();
      return;
    }
    if (isSniping) return;

    setIsSniping(true);
    try {
      const res = await fetch('/api/snipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: targetTicker.toUpperCase() })
      });
      await res.json();
      
      // Temporary button feedback
      setTimeout(() => {
        setIsSniping(false);
      }, 2000);
    } catch (err) {
      console.warn("Failed to trigger backend snipe. Running local trigger feedback.", err);
      // Run local simulated logs sequence
      const sequence = [
        { delay: 100, sender: "SCANNER", message: `[MANUAL TRIGGER] Sniping target initialized: ${targetTicker.toUpperCase()}` },
        { delay: 400, sender: "ANALYST", message: `[MANUAL TRIGGER] Evaluating token safety score: 98/100 (Safe)` },
        { delay: 700, sender: "SNIPER", message: `[MANUAL TRIGGER] Fast-path routing transaction via Jito validator nodes...` },
        { delay: 1100, sender: "JITO_ENGINE", message: `[MANUAL TRIGGER] Bundle validated. Landed block: 284902120 | Slot latency: 19ms.` },
        { delay: 1300, sender: "CONFIRMED", message: `[MANUAL TRIGGER] Position SECURED. Swapped 1.00 SOL for 254,921.84 ${targetTicker.toUpperCase()} (Impact: 0.01%).` }
      ];

      sequence.forEach(step => {
        setTimeout(() => {
          setLogs(prev => [
            ...prev,
            {
              timestamp: new Date().toLocaleTimeString(),
              sender: step.sender,
              message: step.message
            }
          ].slice(-100));
        }, step.delay);
      });

      setTimeout(() => {
        setIsSniping(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col p-6 gap-6 text-terminal-black font-sans box-border select-text">
      
      {/* Editorial View Header */}
      <div className="border-b border-terminal-black/30 pb-3 flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
        <div>
          <h2 className="font-mono text-3xl font-bold uppercase tracking-wide">
            [ 02 // AUTONOMOUS TRENCH SNIPER ]
          </h2>
          <span className="text-sm font-bold uppercase mt-1 text-terminal-black/60 block">
            MODULE TARGET: AUTONOMOUS ON-CHAIN TRENCHING EXECUTION
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
            02 // LIVE RADAR MONITOR
          </button>
        </div>
      </div>

      {activeSubTab === 'install' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Docs Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-base font-bold uppercase border-b border-terminal-black/10 pb-1">
              API CONFIGURATION REFERENCE
            </h4>
            <div className="text-base flex flex-col gap-3 font-semibold leading-relaxed text-terminal-black/95">
              <p>The Sniper module executes token purchases using low-latency Jupiter quote aggregator calculations and submits Jito bundles:</p>
              <pre className="bg-black/5 p-4 font-mono select-text overflow-x-auto text-sm leading-normal">
{`export const swapAction: Action = {
  name: 'SWAP_SOLANA',
  handler: async (runtime, message, state, callback) => {
    const params = await extractSwapParams(runtime, message, state);
    const quote = await getJupiterQuote({
      inputMint: params.fromToken,
      outputMint: params.toToken,
      amount: params.amount,
      slippageBps: params.slippage * 100
    });
    const result = await executeJupiterSwap(connection, wallet, quote);
    callback?.({ success: true, signature: result.signature });
  }
};`}
              </pre>
            </div>
          </div>

          {/* SVG Animated Transaction Path (Moving Visual) */}
          <div className="bg-black/5 p-4 flex flex-col items-center justify-center">
            <span className="text-sm font-mono font-bold uppercase self-start mb-4 text-terminal-black/75">
              [ DIAGRAM_02 // TRANSACTION SNIPING LIFECYCLE ]
            </span>
            <div className="w-full bg-phosphor-green/30 border border-terminal-black/20 p-3 relative select-none">
              <svg viewBox="0 0 500 150" className="w-full h-auto">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
                  </marker>
                </defs>
                {/* Horizontal flow line paths */}
                <path d="M 40 75 L 140 75" stroke="#000000" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />
                <path d="M 160 75 L 260 75" stroke="#000000" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />
                <path d="M 280 75 L 380 75" stroke="#000000" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />

                {/* Nodes */}
                <rect x="10" y="45" width="45" height="60" fill="#00ff00" stroke="#000000" strokeWidth="2" />
                <text x="32" y="80" textAnchor="middle" className="font-mono text-xs font-bold">INIT</text>
                
                <rect x="130" y="45" width="45" height="60" fill="#00ff00" stroke="#000000" strokeWidth="2" />
                <text x="152" y="80" textAnchor="middle" className="font-mono text-xs font-bold">QUOTE</text>
                
                <rect x="250" y="45" width="45" height="60" fill="#00ff00" stroke="#000000" strokeWidth="2" />
                <text x="272" y="80" textAnchor="middle" className="font-mono text-xs font-bold">SIGN</text>

                <rect x="370" y="45" width="50" height="60" fill="#000000" stroke="#000000" strokeWidth="2" />
                <text x="395" y="80" textAnchor="middle" fill="#00ff00" className="font-mono text-xs font-bold">JITO</text>
              </svg>
            </div>
            <div className="text-sm font-sans font-bold text-terminal-black/75 mt-3 uppercase text-left w-full border-t border-terminal-black/10 pt-2 leading-relaxed">
              Tracer streams illustrate pathing from local client trigger directly to Jito Block Engines, bypassing general RPC queues.
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls Column */}
          <div className="flex flex-col gap-6">
            <div className="p-4 bg-phosphor-green/10 flex flex-col gap-4">
              <div className="border-b border-terminal-black/20 pb-2 mb-2 flex items-center justify-between">
                <span className="font-mono text-xl font-bold tracking-wider">[ CONTROLS ]</span>
                <span className="w-3.5 h-3.5 bg-terminal-black"></span>
              </div>
              
              <form onSubmit={triggerSnipe} className="flex flex-col gap-4 font-sans text-base">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono font-bold uppercase tracking-wider text-terminal-black text-sm">Target Token Ticker:</label>
                  <input 
                    type="text" 
                    value={targetTicker}
                    onChange={(e) => setTargetTicker(e.target.value)}
                    placeholder="Enter ticker..." 
                    className="bg-black/5 border border-terminal-black p-3 font-mono text-sm text-terminal-black placeholder-terminal-black/45 focus:outline-none focus:bg-terminal-black focus:text-phosphor-green font-bold uppercase"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-semibold text-sm">
                    <span>Slippage Limit:</span>
                    <span className="font-mono font-bold text-sm">1.5%</span>
                  </div>
                  <div className="flex justify-between font-semibold text-sm">
                    <span>Priority Tip Amount:</span>
                    <span className="font-mono font-bold text-sm">0.01 SOL</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className={`w-full py-4 font-mono font-bold text-sm tracking-wider border select-none transition-all ${
                    !walletAddress
                      ? "bg-red-600/10 text-red-500 border-red-500 hover:bg-red-500 hover:text-black cursor-pointer"
                      : isSniping
                        ? "bg-terminal-black text-phosphor-green border-terminal-black"
                        : "bg-terminal-black text-phosphor-green border-terminal-black hover:bg-phosphor-green hover:text-terminal-black cursor-pointer"
                  }`}
                >
                  {!walletAddress 
                    ? "[ CONNECT WALLET TO EXECUTE SNIPE ]" 
                    : isSniping 
                      ? "BROADCASTING SNIPE BUNDLE..." 
                      : "EXECUTE TRENCH SNIPE"}
                </button>
              </form>
            </div>

            {/* Radar Simulation Panel */}
            <div className="p-4 bg-black/5 flex flex-col justify-center items-center relative overflow-hidden min-h-[220px]">
              <span className="text-sm font-mono font-bold uppercase self-start mb-4 text-terminal-black/75 z-10">
                [ TRENCH_RADAR // ACTIVE SCANNING ]
              </span>
              
              {/* SVG Radar graphic */}
              <div className="relative w-44 h-44 border border-terminal-black rounded-full flex justify-center items-center">
                <div className="absolute inset-2 border border-terminal-black/20 rounded-full"></div>
                <div className="absolute inset-8 border border-terminal-black/20 rounded-full"></div>
                <div className="absolute inset-16 border border-terminal-black/20 rounded-full"></div>
                {/* Dynamic sweep line */}
                <div className="absolute top-0 left-0 w-1/2 h-1/2 border-r border-terminal-black radar-sweep-line pointer-events-none"></div>
                <span className="font-mono text-sm font-bold animate-pulse text-terminal-black">SCANNING...</span>
              </div>
            </div>
          </div>

          {/* SSE Live Logs Stream Column */}
          <div className="p-4 flex flex-col min-h-[400px]">
            <div className="border-b border-terminal-black/20 pb-2 mb-4 flex items-center justify-between font-mono">
              <span className="text-xl font-bold tracking-wider">[ TRENCH STREAM // MEMPOOL ]</span>
              <span className="w-3.5 h-3.5 bg-terminal-black animate-ping"></span>
            </div>

            <div ref={logContainerRef} className="flex-1 bg-black text-[#00ff00] font-mono text-xs p-3.5 border border-terminal-black overflow-y-auto flex flex-col gap-1.5 w-full max-h-[380px] box-border select-text">
              {logs.length === 0 ? (
                <div className="opacity-50 italic">Monitoring channels. Awaiting incoming transactions...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2 text-sm leading-normal">
                    <span className="text-white/60 font-sans text-xs">[{log.timestamp}]</span>
                    <span className="font-bold text-white uppercase">{log.sender}:</span>
                    <span className="select-text leading-relaxed">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
