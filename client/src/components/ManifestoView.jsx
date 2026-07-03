import React, { useState, useEffect } from 'react';

export default function ManifestoView() {
  const sections = [
    {
      title: "1. THE SOLANA LIQUIDITY TRENCH PROBLEM",
      content: "On-chain liquidity events on Solana's pump.fun and Pumpswap pools occur at sub-second intervals. Traditional web interfaces and general-purpose RPC nodes induce execution delays exceeding 1,200ms. In high-volatility memetic assets, this latency represents a total loss of capture potential. Retail searches are frontrun, sandwiched, and dumped on."
    },
    {
      title: "2. THE b[OS] SOLUTION",
      content: "b[OS] represents a specialized, local-first operating interface engineered exclusively for latency-critical Trenching operations. By interfacing directly with the Jito Block Engine mempool and bypassing standard RPC pools, b[OS] achieves sub-50ms execution times."
    },
    {
      title: "3. HARDWARE-LEVEL SYNDICATION",
      content: "Through the Black Bulls Multi-Sig Syndicate, liquidity is dynamically dispersed across 8 geographically isolated RPC clusters. This eliminates single-point-of-failure routing and avoids MEV sandwich vectors by spreading transactions across disparate block producers."
    },
    {
      title: "4. SOCIAL SENTINEL ANALYSIS",
      content: "Market movement on Solana is highly correlated with algorithmic and social triggers. The Ansem Sentinel module parses raw social telemetry and maps it to immediate target lock. By combining NLP trigger classification with mempool frontrunning, we buy before the block is broadcast."
    },
    {
      title: "5. GRADUATION TARGETING",
      content: "The Bonding Curve Predictor monitors graduation telemetry in real-time. When a curve approaches 98%, bOS pre-calculates the Pumpswap liquidity lock block, staging buy commands to execute exactly on pool initialization block."
    }
  ];



  const [visibleCount, setVisibleCount] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev < sections.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [sections.length]);

  const nodes = [
    { id: 'actions', title: 'Actions', subtitle: 'User Intent Parser', x: 20, y: 95, w: 120, h: 50, desc: 'Captures and structures incoming user queries and shell commands.' },
    { id: 'templates', title: 'AI Templates', subtitle: 'NLP Parsing Engine', x: 130, y: 15, w: 120, h: 50, desc: 'Processes raw queries against template matrices for dynamic slot filling.' },
    { id: 'service', title: 'SolanaService', subtitle: 'Core Logic & State', x: 240, y: 95, w: 120, h: 50, desc: 'Central orchestrator managing connection state, transaction building, and API queries.' },
    { id: 'providers', title: 'Providers', subtitle: 'Wallet & Portfolio Data', x: 350, y: 15, w: 120, h: 50, desc: 'Feeds live portfolio statistics and balance changes into context providers.' },
    { id: 'rpc', title: 'Solana RPC', subtitle: 'Node Connection Layer', x: 450, y: 95, w: 120, h: 50, desc: 'Establishes low-latency pipelines to Solana clusters and Jito validators.' },
    { id: 'birdeye', title: 'Birdeye API', subtitle: 'Real-time Price Engine', x: 450, y: 175, w: 120, h: 50, desc: 'Queries Birdeye REST servers for token valuations and historical price ticks.' }
  ];

  return (
    <div className="font-sans text-terminal-black p-6 flex flex-col gap-6 select-text">
      
      {/* Editorial Title */}
      <div className="border-b border-terminal-black/30 pb-3">
        <h2 className="font-mono text-3xl font-bold tracking-wide">
          b[OS] CORE PARADIGM MANIFESTO
        </h2>
        <div className="flex gap-4 text-[10px] font-bold uppercase mt-1 text-terminal-black/60">
          <span>CLASSIFICATION: DECLASSIFIED</span>
          <span>//</span>
          <span>LOG LEVEL: MISSION CRITICAL</span>
        </div>
      </div>

      {/* Blueprint Architecture Diagram (Interactive SVG) */}
      <div className="flex flex-col items-center justify-center py-4 bg-black/5 p-4">
        <span className="text-[10px] font-mono font-bold uppercase self-start mb-4 text-terminal-black/75">
          [ DIAGRAM_01 // SOLANA PLUGIN RUNTIME ARCHITECTURE ]
        </span>
        
        <div className="w-full max-w-2xl bg-phosphor-green/30 border border-terminal-black/20 p-2 relative select-none">
          <svg viewBox="0 0 600 240" className="w-full h-auto">
            {/* Arrow Marker Definitions */}
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
              </marker>
            </defs>

            {/* Connecting Paths */}
            {/* Actions -> SolanaService */}
            <path d="M 140 120 L 232 120" stroke="#000000" strokeWidth="2" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />
            {/* Actions -> AI Templates */}
            <path d="M 80 95 L 125 45" stroke="#000000" strokeWidth="2" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />
            {/* SolanaService -> Solana RPC */}
            <path d="M 360 120 L 442 120" stroke="#000000" strokeWidth="2" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />
            {/* SolanaService -> Providers */}
            <path d="M 300 95 L 345 45" stroke="#000000" strokeWidth="2" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />
            {/* Solana RPC -> Birdeye API */}
            <path d="M 510 145 L 510 168" stroke="#000000" strokeWidth="2" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />

            {/* Render Nodes */}
            {nodes.map(node => {
              const isHovered = hoveredNode && hoveredNode.id === node.id;
              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer box */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.w}
                    height={node.h}
                    fill={isHovered ? '#000000' : '#00ff00'}
                    stroke="#000000"
                    strokeWidth="2"
                    className="transition-all"
                  />
                  {/* Node Title */}
                  <text
                    x={node.x + node.w / 2}
                    y={node.y + 20}
                    textAnchor="middle"
                    fill={isHovered ? '#00ff00' : '#000000'}
                    className="font-mono text-[11px] font-bold"
                  >
                    {node.title}
                  </text>
                  {/* Node Subtitle */}
                  <text
                    x={node.x + node.w / 2}
                    y={node.y + 36}
                    textAnchor="middle"
                    fill={isHovered ? '#ffffff' : '#000000'}
                    opacity={isHovered ? 0.9 : 0.6}
                    className="font-sans text-[8px] font-bold uppercase tracking-wider"
                  >
                    {node.subtitle}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover/Details caption box */}
        <div className="border-t border-terminal-black/10 pt-3 mt-3 w-full min-h-[50px] flex flex-col justify-start">
          {hoveredNode ? (
            <div className="text-xs font-sans text-terminal-black">
              <span className="font-mono font-bold text-sm uppercase block">{hoveredNode.title} ( {hoveredNode.subtitle} )</span>
              <p className="mt-1 font-semibold text-terminal-black/85 select-text leading-relaxed">{hoveredNode.desc}</p>
            </div>
          ) : (
            <span className="text-xs font-sans font-bold text-terminal-black/75 uppercase leading-normal tracking-wider block">
              FIG 1.1: RUNTIME PIPELINE GRAPH. HOVER NODES TO ANALYZE SOLANA BLOCKCHAIN PLUGIN CONNECTIONS, NLP INTENT EXTRACTORS, AND WALLET PROVIDER ORCHESTRATION.
            </span>
          )}
        </div>
      </div>

      {/* Clean vertical flow of sections */}
      <div className="flex flex-col gap-6">
        {sections.slice(0, visibleCount).map((section, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <h3 className="font-mono text-xl md:text-2xl font-bold uppercase tracking-wider text-terminal-black border-l-4 border-terminal-black pl-3">
              {section.title}
            </h3>
            <p className="font-sans text-sm md:text-base leading-relaxed text-terminal-black/85">
              {section.content}
            </p>
          </div>
        ))}
      </div>


    </div>
  );
}
