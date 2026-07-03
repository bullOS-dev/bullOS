import React, { useState, useEffect } from 'react';

const defaultNodesData = {
  simulating: false,
  nodes: [
    { id: 1, name: "BULL_NODE_01", status: "ACTIVE", balance: "1.4250 SOL", txCount: 154, ip: "82.220.101.42", target: "STAGED" },
    { id: 2, name: "BULL_NODE_02", status: "ACTIVE", balance: "0.8915 SOL", txCount: 92, ip: "178.197.45.10", target: "EXECUTED" },
    { id: 3, name: "BULL_NODE_03", status: "ACTIVE", balance: "2.1040 SOL", txCount: 201, ip: "193.134.12.98", target: "STAGED" },
    { id: 4, name: "BULL_NODE_04", status: "ACTIVE", balance: "0.5580 SOL", txCount: 64, ip: "188.60.254.103", target: "IDLE" },
    { id: 5, name: "BULL_NODE_05", status: "ACTIVE", balance: "1.7890 SOL", txCount: 133, ip: "46.126.89.201", target: "EXECUTED" },
    { id: 6, name: "BULL_NODE_06", status: "ACTIVE", balance: "0.9465 SOL", txCount: 88, ip: "109.202.15.66", target: "STAGED" },
    { id: 7, name: "BULL_NODE_07", status: "ACTIVE", balance: "1.2030 SOL", txCount: 110, ip: "82.220.14.88", target: "IDLE" },
    { id: 8, name: "BULL_NODE_08", status: "ACTIVE", balance: "3.1275 SOL", txCount: 290, ip: "178.197.202.13", target: "EXECUTED" }
  ]
};

export default function SyndicateWarRoomView({ walletAddress, connectWallet }) {
  const [activeSubTab, setActiveSubTab] = useState('install');
  const [data, setData] = useState(defaultNodesData);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [dispersionBalance, setDispersionBalance] = useState(11.11);

  useEffect(() => {
    const timer = setInterval(() => {
      setDispersionBalance(prev => prev + (Math.random() * 0.0004 + 0.0001));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const fetchNodes = async () => {
    try {
      const res = await fetch('/api/syndicate-nodes');
      const json = await res.json();
      setData(json);
      setSimulating(json.simulating);
    } catch (err) {
      console.warn("Backend /api/syndicate-nodes offline. Utilizing local matrix config.", err);
    }
  };

  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 3000); // poll nodes status frequently
    return () => clearInterval(interval);
  }, []);

  const triggerDispersion = async () => {
    if (!walletAddress) {
      connectWallet();
      return;
    }
    if (simulating) return;
    setSimulating(true);

    try {
      await fetch('/api/syndicate-nodes/disperse', {
        method: 'POST'
      });
      fetchNodes();
    } catch (err) {
      console.warn("Dispersion trigger offline. Executing client-side routing flow.", err);
      // Run local simulated routing steps for visual validation
      setDispersionBalance(prev => Math.max(1.0, prev - 0.8));
      setData(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => ({
          ...n,
          status: "ROUTING",
          balance: (parseFloat(n.balance.split(' ')[0]) - 0.05).toFixed(4) + " SOL"
        }))
      }));

      setTimeout(() => {
        setData(prev => ({
          simulating: false,
          nodes: prev.nodes.map(n => {
            let finalState = n.target;
            let balanceAdded = finalState === "EXECUTED" ? 0.15 : 0.05;
            if (finalState === "IDLE") balanceAdded = 0.00;
            return {
              ...n,
              status: finalState,
              balance: (parseFloat(n.balance.split(' ')[0]) + balanceAdded).toFixed(4) + " SOL",
              txCount: n.txCount + 1
            };
          })
        }));
        setSimulating(false);
      }, 3500);
    }
  };

  if (loading) {
    return <div className="p-4 text-terminal-black/70 animate-pulse font-mono text-base">Initializing War Room Connection...</div>;
  }

  const nodes = data ? data.nodes : [];

  const nodeMap = {
    1: { name: "BULL_NODE_01", index: 0 },
    2: { name: "BULL_NODE_02", index: 1 },
    3: { name: "BULL_NODE_03", index: 2 },
    4: { name: "BULL_NODE_04", index: 3 },
    5: { name: "BULL_NODE_05", index: 4 },
    6: { name: "BULL_NODE_06", index: 5 },
    7: { name: "BULL_NODE_07", index: 6 },
    8: { name: "BULL_NODE_08", index: 7 }
  };

  const getNodeByPosition = (posId) => {
    const config = nodeMap[posId];
    if (!config) return null;
    return nodes[config.index];
  };

  const renderNodeCell = (posId) => {
    const node = getNodeByPosition(posId);
    if (!node) return null;

    const isRouting = node.status === 'ROUTING';
    const isExecuted = node.status === 'EXECUTED';
    const isStaged = node.status === 'STAGED';

    let statusStyle = "border-terminal-black text-terminal-black";
    let statusLabelClass = "bg-terminal-black/10 text-terminal-black";
    
    if (isRouting) {
      statusStyle = "bg-terminal-black text-phosphor-green border-terminal-black animate-pulse";
      statusLabelClass = "bg-phosphor-green text-terminal-black font-bold";
    } else if (isExecuted) {
      statusStyle = "bg-phosphor-green text-terminal-black border-terminal-black";
      statusLabelClass = "bg-terminal-black text-phosphor-green font-bold";
    } else if (isStaged) {
      statusStyle = "bg-phosphor-green text-terminal-black border-terminal-black";
      statusLabelClass = "border border-terminal-black text-terminal-black font-bold";
    }

    return (
      <div key={node.id} className={`border border-terminal-black p-3.5 flex flex-col justify-between min-h-[110px] relative ${statusStyle}`}>
        <div className="flex justify-between text-sm border-b border-terminal-black/25 pb-1 mb-1 font-mono font-bold">
          <span>{node.name}</span>
          <span className="text-xs opacity-60 font-sans">{node.ip}</span>
        </div>
        
        <div className="text-sm font-sans font-semibold flex flex-col gap-0.5 mt-1">
          <div>BAL: <span className="font-mono">{node.balance}</span></div>
          <div>TXS: <span className="font-mono">{node.txCount}</span></div>
        </div>

        <div className="text-xs mt-2 flex justify-between items-center font-sans font-bold">
          <span>STATUS:</span>
          <span className={`px-1.5 py-0.5 text-xs uppercase tracking-wider ${statusLabelClass}`}>
            {node.status}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-6 gap-6 text-terminal-black font-sans box-border select-text">
      
      {/* Editorial View Header */}
      <div className="border-b border-terminal-black/30 pb-3 flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
        <div>
          <h2 className="font-mono text-3xl font-bold uppercase tracking-wide">
            [ 03 // DISTRIBUTED SYNDICATE WAR ROOM ]
          </h2>
          <span className="text-sm font-bold uppercase mt-1 text-terminal-black/60 block">
            MODULE TARGET: DECENTRALIZED MULTI-SIG ROUTING NODES
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
            02 // LIVE DISPERSION MATRIX
          </button>
        </div>
      </div>

      {activeSubTab === 'install' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Docs Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-base font-bold uppercase border-b border-terminal-black/10 pb-1">
              SECURE KEYPAIR LOAD VECTOR
            </h4>
            <div className="text-base flex flex-col gap-3 font-semibold leading-relaxed text-terminal-black/95">
              <p>Keypair load vectors check multiple encoding formats (base58, base64, JSON arrays) automatically:</p>
              <pre className="bg-black/5 p-4 font-mono select-text text-sm leading-normal overflow-x-auto">
{`export async function loadKeypair(privateKey: string): Promise<Keypair> {
  try {
    const decoded = bs58.decode(privateKey);
    if (decoded.length === 64) return Keypair.fromSecretKey(decoded);
  } catch {}
  try {
    const decoded = Buffer.from(privateKey, 'base64');
    if (decoded.length === 64) return Keypair.fromSecretKey(decoded);
  } catch {}
  
  const parsed = JSON.parse(privateKey);
  return Keypair.fromSecretKey(Uint8Array.from(parsed));
}`}
              </pre>
            </div>
          </div>

          {/* SVG Multi-sig Node map (Moving Visual) */}
          <div className="bg-black/5 p-4 flex flex-col items-center justify-center">
            <span className="text-sm font-mono font-bold uppercase self-start mb-4 text-terminal-black/75">
              [ DIAGRAM_03 // MULTISIG NODE DISPERSION ]
            </span>
            <div className="w-full bg-phosphor-green/30 border border-terminal-black/20 p-2 relative select-none">
              <svg viewBox="0 0 500 150" className="w-full h-auto">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000000" />
                  </marker>
                </defs>

                {/* Split routing lines */}
                <path d="M 70 75 L 210 35" stroke="#000000" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />
                <path d="M 70 75 L 210 75" stroke="#000000" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />
                <path d="M 70 75 L 210 115" stroke="#000000" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" className="brutalist-flow-line" />

                <circle cx="50" cy="75" r="20" fill="#000000" stroke="#000000" strokeWidth="2" />
                <text x="50" y="78" textAnchor="middle" fill="#00ff00" className="font-mono text-sm font-bold">POOL</text>

                <rect x="220" y="15" width="65" height="38" fill="#00ff00" stroke="#000000" strokeWidth="2" />
                <text x="252" y="37" textAnchor="middle" className="font-mono text-xs font-bold">NODE_01</text>

                <rect x="220" y="56" width="65" height="38" fill="#00ff00" stroke="#000000" strokeWidth="2" />
                <text x="252" y="78" textAnchor="middle" className="font-mono text-xs font-bold">NODE_02</text>

                <rect x="220" y="98" width="65" height="38" fill="#00ff00" stroke="#000000" strokeWidth="2" />
                <text x="252" y="120" textAnchor="middle" className="font-mono text-xs font-bold">NODE_03</text>
              </svg>
            </div>
            <div className="text-sm font-sans font-bold text-terminal-black/75 mt-3 uppercase text-left w-full border-t border-terminal-black/10 pt-2 leading-relaxed">
              Dashed streams illustrate decentralized routing pathways dispersals designed to mask key signature origins.
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Workspace grid */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="p-4 bg-phosphor-green/10">
              <div className="border-b border-terminal-black/20 pb-2 flex justify-between items-center">
                <span className="font-mono text-xl font-bold">[ 03_SYNDICATE_WAR_ROOM.DAT ]</span>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-terminal-black/75">MULTISIG DISPERSION MATRIX</span>
              </div>

              {/* 3x3 layout representation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 relative p-3 border border-terminal-black bg-black/5 mt-4">
                {renderNodeCell(1)}
                {renderNodeCell(2)}
                {renderNodeCell(3)}

                {renderNodeCell(4)}
                
                {/* Center Dispersion Pool Node */}
                <div className="border-2 border-terminal-black bg-terminal-black text-phosphor-green p-3 flex flex-col justify-center items-center text-center min-h-[110px] relative">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-white/70 block mb-0.5">DISPERSION POOL</span>
                  <span className="text-2xl font-mono font-bold tracking-wider uppercase">
                    {simulating ? "ROUTING..." : `${dispersionBalance.toFixed(4)} SOL`}
                  </span>
                  <span className="text-xs font-mono mt-1 opacity-70">TARGET: MULTI-SIG</span>

                  {simulating && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-dashed border-phosphor-green/30 rounded-full animate-spin" style={{ animationDuration: '6s' }}></div>
                    </div>
                  )}
                </div>

                {renderNodeCell(5)}
                
                {renderNodeCell(6)}
                {renderNodeCell(7)}
                {renderNodeCell(8)}
              </div>
            </div>

            {/* Control Button panel */}
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-base font-sans leading-relaxed flex-1 text-terminal-black/85 font-semibold">
                <div>Clicking <span className="font-bold">SIMULATE DISPERSION</span> disperses funds from the Central Multi-Sig pool.</div>
                <div>This replicates real routing structures used to secure Jito bundles against MEV frontrunners.</div>
              </div>
              <button
                onClick={triggerDispersion}
                className={`px-6 py-4 font-mono font-bold border tracking-wider text-sm select-none transition-all ${
                  !walletAddress
                    ? "bg-red-600/10 text-red-500 border-red-500 hover:bg-red-500 hover:text-black cursor-pointer"
                    : simulating
                      ? "bg-terminal-black text-phosphor-green border-terminal-black"
                      : "bg-terminal-black text-phosphor-green border-terminal-black hover:bg-phosphor-green hover:text-terminal-black cursor-pointer"
                }`}
              >
                {!walletAddress
                  ? "[ CONNECT WALLET TO DISPERSE ]"
                  : simulating
                    ? "ROUTING ACTIVE..."
                    : "SIMULATE DISPERSION"}
              </button>
            </div>
          </div>

          {/* Status log readouts */}
          <div className="w-full lg:col-span-4 p-4 flex flex-col gap-4">
            <span className="font-mono text-lg font-bold border-b border-terminal-black pb-2 uppercase">[ Syndicate Audit ]</span>

            <div className="flex-1 flex flex-col gap-3 font-sans text-sm">
              <div className="text-terminal-black/80 select-text leading-relaxed font-semibold">
                [{new Date().toLocaleTimeString()}] [WAR_ROOM] Distributed Wallet dispersion matrix initialized.
              </div>
              <div className="text-terminal-black/80 select-text leading-relaxed font-semibold">
                [{new Date().toLocaleTimeString()}] [STATUS] Nodes 1-8 active connection handshake completed.
              </div>
              
              <div className="border-t border-terminal-black pt-3 mt-2">
                <span className="font-bold block mb-2 uppercase text-terminal-black/75 text-xs">Node Balances Summary:</span>
                {nodes.map(node => (
                  <div key={node.id} className="flex justify-between text-xs py-1 border-b border-terminal-black/10">
                    <span className="font-mono font-bold text-terminal-black/75">{node.name}</span>
                    <span className="font-mono font-bold text-terminal-black">{node.balance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
