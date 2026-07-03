import React, { useState, useEffect } from 'react';

const defaultCurveData = {
  metrics: [
    { id: "bos", ticker: "$bOS", name: "bullOS Trenching Engine", progress: 0, volume: "0 SOL", holders: 0, etaSeconds: 9999, threatLevel: "N/A" }
  ]
};

export default function CurvePredictView() {
  const [activeSubTab, setActiveSubTab] = useState('install');
  const [telemetry, setTelemetry] = useState(defaultCurveData);
  const [loading, setLoading] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState('bos');
  
  // React-driven dots animation state for standby previews
  const [dots, setDots] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const fetchCurveData = async () => {
    try {
      const res = await fetch('/api/curve-data');
      const data = await res.json();
      
      // Filter to keep ONLY $bOS and force its "not live yet" metrics
      if (data.metrics) {
        data.metrics = data.metrics
          .filter(m => m.id === 'bos')
          .map(m => ({
            ...m,
            progress: 0,
            volume: "0 SOL",
            holders: 0,
            etaSeconds: 9999,
            threatLevel: "N/A"
          }));
      }
      setTelemetry(data);
    } catch (err) {
      console.warn("Backend /api/curve-data offline. Simulating bonding curves locally.", err);
      setTelemetry(prev => {
        // Keep only $bOS local mock
        return defaultCurveData;
      });
    }
  };

  useEffect(() => {
    fetchCurveData();
    const interval = setInterval(fetchCurveData, 2000); // quick polling for real-time progress bar changes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-4 text-terminal-black/70 animate-pulse font-mono text-base">Streaming Curve Telemetry...</div>;
  }

  const tokens = telemetry ? telemetry.metrics : [];
  const selectedToken = tokens.find(t => t.id === selectedTokenId) || tokens[0];

  const renderProgressBar = (progress) => {
    const totalSegments = 20;
    const filledSegments = Math.round((progress / 100) * totalSegments);
    const emptySegments = totalSegments - filledSegments;

    const filledChar = '█';
    const emptyChar = '░';

    const barString = filledChar.repeat(filledSegments) + emptyChar.repeat(emptySegments);
    return `[${barString}]`;
  };

  const formatETA = (seconds) => {
    if (seconds <= 0) return "GRADUATING NOW...";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex flex-col p-6 gap-6 text-terminal-black font-sans box-border select-text">
      
      {/* Editorial View Header */}
      <div className="border-b border-terminal-black/30 pb-3 flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
        <div>
          <h2 className="font-mono text-3xl font-bold uppercase tracking-wide">
            [ 05 // BONDING CURVE PREDICTOR ]
          </h2>
          <span className="text-sm font-bold uppercase mt-1 text-terminal-black/60 block">
            MODULE TARGET: REAL-TIME TELEMETRY STREAMING & GRADUATION PREDICTION
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
            02 // LIVE TELEMETRY PROFILE
          </button>
        </div>
      </div>

      {activeSubTab === 'install' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Docs Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-base font-bold uppercase border-b border-terminal-black/10 pb-1">
              WEBSOCKET REGISTRY LISTENERS
            </h4>
            <div className="text-base flex flex-col gap-3 font-semibold leading-relaxed text-terminal-black/95">
              <p>WebSocket connections monitor accounts continuously for instant balance and pool modifications:</p>
              <pre className="bg-black/5 p-4 font-mono select-text text-sm leading-normal overflow-x-auto">
{`private setupAccountSubscriptions(): void {
  this.connection.onAccountChange(
    this.keypair.publicKey,
    (accountInfo) => {
      logger.info('Account balance changed:', accountInfo.lamports);
      this.fetchPortfolioData();
    },
    'confirmed'
  );
}`}
              </pre>
            </div>
          </div>

          {/* Animated Gradient Progress Chart (Moving Visual) */}
          <div className="p-4 flex flex-col justify-between">
            <span className="text-xs font-mono font-bold uppercase block mb-3 text-terminal-black/75 border-b border-terminal-black/15 pb-1">
              [ REAL-TIME TELEMETRY GRADUATING METER ]
            </span>
            
            <div className="flex-1 flex flex-col justify-center items-center py-6 gap-3">
              <span className="font-mono text-xs font-bold uppercase text-terminal-black/70">POLLED GRADUATION SPEED:</span>
              <div className="w-full bg-black/10 border border-terminal-black h-9 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-red-600 select-none">
                  NOT LIVE YET{dots}
                </div>
              </div>
              <div className="text-xs font-mono text-center text-terminal-black/80 font-bold uppercase">
                ESTIMATED INITIALIZATION ETA: STANDBY
              </div>
            </div>

            <div className="text-xs font-sans font-bold text-terminal-black/75 mt-3 uppercase text-left w-full border-t border-terminal-black/10 pt-2 leading-relaxed">
              Websocket triggers lock buy execution within the exact Pumpswap pool initialization block.
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Selector Side Panel */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="font-mono text-lg font-bold border-b border-terminal-black pb-2 uppercase">[ Trending ]</span>
            <div className="flex flex-col gap-2">
              {tokens.map(token => {
                const isSelected = token.id === selectedTokenId;
                const isBos = token.id === 'bos';
                return (
                  <button
                    key={token.id}
                    onClick={() => setSelectedTokenId(token.id)}
                    className={`w-full text-left p-3 border font-mono text-sm transition-all flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-terminal-black text-phosphor-green border-terminal-black font-bold' 
                        : 'bg-phosphor-green text-terminal-black border-terminal-black hover:bg-terminal-black hover:text-phosphor-green'
                    }`}
                  >
                    <span>{token.ticker}</span>
                    <span className={`font-bold text-xs ${isBos ? 'text-red-600' : ''}`}>
                      {isBos ? `NOT LIVE YET${dots}` : `${token.progress}%`}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-sans font-semibold leading-relaxed border-t border-terminal-black/20 pt-3 text-terminal-black/80">
              Select trending Solana contract keys to inspect real-time bonding curve graduation metrics and Pumpswap pool launch estimation.
            </div>
          </div>

          {/* Main Graph / Telemetry Panel */}
          <div className="lg:col-span-8 flex flex-col gap-4 justify-between min-h-[350px]">
            <div className="border-b border-terminal-black pb-2 flex justify-between items-center">
              <span className="font-mono text-xl font-bold">[ 05_CURVE_PREDICT.CFG ]</span>
              <span className="text-xs font-mono font-bold bg-terminal-black text-phosphor-green px-2.5 py-0.5 border border-terminal-black uppercase">REAL-TIME</span>
            </div>

            {selectedToken ? (
              <div className="flex-1 flex flex-col justify-around gap-6 py-2">
                <div>
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-terminal-black/70 block mb-1">ASSET NAME</span>
                  <span className="font-mono text-2xl font-bold text-terminal-black select-text">{selectedToken.name} ({selectedToken.ticker})</span>
                </div>

                <div className="bg-black/5 border border-terminal-black p-4 flex flex-col gap-2.5">
                  <div className="flex justify-between text-sm font-sans font-bold text-terminal-black/75">
                    <span>BONDING CURVE GRADUATION PROGRESSION</span>
                    <span className={`font-mono text-base font-bold ${selectedToken.id === 'bos' ? 'text-red-600' : ''}`}>
                      {selectedToken.id === 'bos' ? `NOT LIVE YET${dots}` : `${selectedToken.progress}%`}
                    </span>
                  </div>
                  
                  {/* Segmented Progress Bar */}
                  <div className={`text-xl sm:text-2xl font-bold tracking-widest font-mono break-all select-none ${selectedToken.id === 'bos' ? 'text-terminal-black/25' : 'text-terminal-black'}`}>
                    {selectedToken.id === 'bos' ? '[░░░░░░░░░░░░░░░░░░░░]' : renderProgressBar(selectedToken.progress)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div className="border border-terminal-black p-3 bg-black/5">
                    <span className="text-terminal-black/70 font-bold uppercase tracking-wider block">Pumpswap Pool Launch ETA</span>
                    <span className="text-terminal-black font-mono font-bold text-sm tracking-wide block mt-1">
                      {selectedToken.id === 'bos' ? `NOT LIVE YET${dots}` : formatETA(selectedToken.etaSeconds)}
                    </span>
                  </div>
                  <div className="border border-terminal-black p-3 bg-black/5">
                    <span className="text-terminal-black/70 font-bold uppercase tracking-wider block">Trench Volume Captured</span>
                    <span className="text-terminal-black font-mono font-bold text-sm block mt-1">
                      {selectedToken.id === 'bos' ? `NOT LIVE YET${dots}` : selectedToken.volume}
                    </span>
                  </div>
                  <div className="border border-terminal-black p-3 bg-black/5">
                    <span className="text-terminal-black/70 font-bold uppercase tracking-wider block">Holder Clusters</span>
                    <span className="text-terminal-black font-mono font-bold text-sm block mt-1">
                      {selectedToken.id === 'bos' ? `NOT LIVE YET${dots}` : `${selectedToken.holders} ADDRESSES`}
                    </span>
                  </div>
                  <div className="border border-terminal-black p-3 bg-black/5">
                    <span className="text-terminal-black/70 font-bold uppercase tracking-wider block">Threat Vector</span>
                    <span className={`font-mono font-bold text-sm block mt-1 uppercase ${
                      selectedToken.id === 'bos' ? 'text-terminal-black/50' :
                      selectedToken.threatLevel === 'HIGH' ? 'text-red-700 animate-pulse font-bold' :
                      selectedToken.threatLevel === 'MEDIUM' ? 'text-yellow-700 font-bold' : 'text-terminal-black'
                    }`}>
                      {selectedToken.id === 'bos' ? `NOT LIVE YET${dots}` : selectedToken.threatLevel}
                    </span>
                  </div>
                </div>

                <div className="border-t border-terminal-black/20 pt-3 text-xs font-sans leading-relaxed text-terminal-black/85 select-text font-semibold">
                  {selectedToken.id === 'bos' ? (
                    <div>[PREDICTOR] Token {selectedToken.ticker} bonding curve is waiting for contract deployment. Telemetry status: STANDBY.</div>
                  ) : (
                    <>
                      <div>[PREDICTOR] Token {selectedToken.ticker} bonding curve progress: {selectedToken.progress}%</div>
                      <div>[PREDICTOR] Estimated graduation: {selectedToken.etaSeconds} seconds | Estimated buy volume: HIGH</div>
                      <div>[STRATEGY] Target exit configured at Pumpswap pool creation block.</div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-terminal-black/60 italic">Select target token telemetry from sidebar.</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
