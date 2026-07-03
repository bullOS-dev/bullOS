import React, { useState, useEffect, useRef } from 'react';
import ManifestoView from './components/ManifestoView';
import AutoSniperView from './components/AutoSniperView';
import AnsemSentinelView from './components/AnsemSentinelView';
import SyndicateWarRoomView from './components/SyndicateWarRoomView';
import CurvePredictView from './components/CurvePredictView';
import PriceTicker from './components/PriceTicker';
import TrendingTokens from './components/TrendingTokens';
import DocsView from './components/DocsView';
import ApiPricingView from './components/ApiPricingView';

export default function App() {
  const [activeTab, setActiveTab] = useState('01_AUTO_SNIPER.EXE');
  const [isDocsView, setIsDocsView] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#docs') {
        setIsDocsView(true);
      } else {
        setIsDocsView(false);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  
  // CLI State
  const [cmdInput, setCmdInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([
    { text: 'b[OS] Core v1.0.0 Mainframe initialized.', type: 'system' },
    { text: 'Establishing secure WebSocket and Jito multiplex channels...', type: 'system' },
    { text: "Type 'help' for available commands list.", type: 'system' }
  ]);
  
  // CA Copy Logic
  const [caCopyLabel, setCaCopyLabel] = useState("[ CA: NOT LIVE YET ]");

  const handleCopyCA = () => {
    navigator.clipboard.writeText("NOT LIVE YET")
      .then(() => {
        setCaCopyLabel("[ COPIED! ]");
        setCmdHistory(prev => [
          ...prev,
          { text: `[SYSTEM] Contract address is not live yet. Stay tuned.`, type: 'system' }
        ]);
        setTimeout(() => {
          setCaCopyLabel("[ CA: NOT LIVE YET ]");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy CA", err);
      });
  };

  // Wallet Connection State & Logic
  const [walletAddress, setWalletAddress] = useState(null);

  const getProvider = () => {
    if (window.solana) {
      return window.solana;
    }
    if (window.phantom?.solana) {
      return window.phantom.solana;
    }
    if (window.solflare?.solana) {
      return window.solflare.solana;
    }
    return null;
  };

  const connectWallet = async () => {
    const provider = getProvider();
    if (!provider) {
      alert("No Solana wallet found. Please install Phantom or Solflare browser extension.");
      window.open("https://phantom.app/", "_blank");
      return;
    }
    try {
      const resp = await provider.connect();
      const pubKey = resp.publicKey.toString();
      setWalletAddress(pubKey);
      
      setCmdHistory(prev => [
        ...prev,
        { text: `[SECURE] Solana wallet connected: ${pubKey.slice(0, 6)}...${pubKey.slice(-6)}`, type: 'system' }
      ]);
    } catch (err) {
      console.error("Wallet connection failed", err);
      setCmdHistory(prev => [
        ...prev,
        { text: `[ERROR] Wallet connection failed: ${err.message || err}`, type: 'error' }
      ]);
    }
  };

  const disconnectWallet = async () => {
    const provider = getProvider();
    if (provider) {
      try {
        await provider.disconnect();
      } catch (err) {
        console.error("Disconnect error", err);
      }
    }
    setWalletAddress(null);
    setCmdHistory(prev => [
      ...prev,
      { text: `[SECURE] Solana wallet disconnected. Session ended.`, type: 'system' }
    ]);
  };

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      // Eagerly connect if trusted
      provider.connect({ onlyIfTrusted: true })
        .then((resp) => {
          const pubKey = resp.publicKey.toString();
          setWalletAddress(pubKey);
          setCmdHistory(prev => [
            ...prev,
            { text: `[SECURE] Reconnected trusted wallet: ${pubKey.slice(0, 6)}...${pubKey.slice(-6)}`, type: 'system' }
          ]);
        })
        .catch(() => {});

      const handleConnect = (publicKey) => {
        const pubKey = publicKey.toString();
        setWalletAddress(pubKey);
      };

      const handleDisconnect = () => {
        setWalletAddress(null);
      };

      provider.on('connect', handleConnect);
      provider.on('disconnect', handleDisconnect);

      return () => {
        provider.removeListener('connect', handleConnect);
        provider.removeListener('disconnect', handleDisconnect);
      };
    }
  }, []);

  const cliContainerRef = useRef(null);
  const registryRef = useRef(null);

  const scrollToRegistry = (e) => {
    e.preventDefault();
    if (registryRef.current) {
      registryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-scroll CLI history (prevents window jumping)
  useEffect(() => {
    if (cliContainerRef.current) {
      cliContainerRef.current.scrollTop = cliContainerRef.current.scrollHeight;
    }
  }, [cmdHistory]);

  const tabs = [
    { id: '01_AUTO_SNIPER.EXE', name: '01_AUTO_SNIPER.EXE', desc: 'Autonomous Sniper Monitor' },
    { id: '02_ANSEM_SENTINEL.SH', name: '02_ANSEM_SENTINEL.SH', desc: 'Social latency profiler' },
    { id: '03_SYNDICATE_WAR_ROOM.DAT', name: '03_SYNDICATE_WAR_ROOM.DAT', desc: 'Distributed Wallet Routing' },
    { id: '04_CURVE_PREDICT.CFG', name: '04_CURVE_PREDICT.CFG', desc: 'Bonding Curve graduating config' },
    { id: '05_API_PRICING.SYS', name: '05_API_PRICING.SYS', desc: 'API Key Access Tiers' }
  ];

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cleanCmd = cmdInput.trim().toLowerCase();
    if (!cleanCmd) return;

    const prefix = walletAddress 
      ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}@b[OS]:~$` 
      : 'guest@b[OS]:~$';

    const newHistory = [...cmdHistory, { text: `${prefix} ${cmdInput}`, type: 'input' }];
    setCmdInput('');

    if (!walletAddress) {
      newHistory.push({ 
        text: '[ERROR] Command execution rejected. Secure mainframe session not active. Connect your Solana wallet to run mainframe terminal commands.', 
        type: 'error' 
      });
      setCmdHistory(newHistory);
      connectWallet();
      return;
    }

    switch (cleanCmd) {
      case 'help':
        newHistory.push({
          text: `Available Commands:
  help      - Display this command dictionary
  snip      - Mount Auto Sniper console [01_AUTO_SNIPER.EXE]
  sentinel  - Mount Social Latency Profiler [02_ANSEM_SENTINEL.SH]
  warroom   - Mount Syndicate Liquidity Grid [03_SYNDICATE_WAR_ROOM.DAT]
  curve     - Mount Bonding Curve Predictor [04_CURVE_PREDICT.CFG]
  pricing   - Mount API Key Access Tiers [05_API_PRICING.SYS]
  manifesto - Print notice on core paradigm manifesto placement
  install   - View instructions on how to install modules
  clear     - Wipe out command logs history`,
          type: 'output'
        });
        break;
      case 'snip':
        setActiveTab('01_AUTO_SNIPER.EXE');
        newHistory.push({ text: 'Switching view target to: 01_AUTO_SNIPER.EXE', type: 'output' });
        break;
      case 'sentinel':
        setActiveTab('02_ANSEM_SENTINEL.SH');
        newHistory.push({ text: 'Switching view target to: 02_ANSEM_SENTINEL.SH', type: 'output' });
        break;
      case 'warroom':
        setActiveTab('03_SYNDICATE_WAR_ROOM.DAT');
        newHistory.push({ text: 'Switching view target to: 03_SYNDICATE_WAR_ROOM.DAT', type: 'output' });
        break;
      case 'curve':
        setActiveTab('04_CURVE_PREDICT.CFG');
        newHistory.push({ text: 'Switching view target to: 04_CURVE_PREDICT.CFG', type: 'output' });
        break;
      case 'pricing':
        setActiveTab('05_API_PRICING.SYS');
        newHistory.push({ text: 'Switching view target to: 05_API_PRICING.SYS', type: 'output' });
        break;
      case 'manifesto':
        newHistory.push({ text: 'b[OS] CORE PARADIGM MANIFESTO is rendered as fixed text at the top of the mainframe dashboard.', type: 'system' });
        break;
      case 'install':
        newHistory.push({ text: 'SETUP SYSTEM: Click any System Registry menu tab to view its individual "HOW TO INSTALL" developer specs.', type: 'system' });
        break;
      case 'clear':
        setCmdHistory([]);
        return;
      default:
        newHistory.push({ text: `Unknown execution command: "${cleanCmd}". Type 'help' for options.`, type: 'error' });
    }

    setCmdHistory(newHistory);
  };

  const renderMainView = () => {
    switch (activeTab) {
      case '01_AUTO_SNIPER.EXE':
        return <AutoSniperView key={activeTab} walletAddress={walletAddress} connectWallet={connectWallet} />;
      case '02_ANSEM_SENTINEL.SH':
        return <AnsemSentinelView key={activeTab} />;
      case '03_SYNDICATE_WAR_ROOM.DAT':
        return <SyndicateWarRoomView key={activeTab} walletAddress={walletAddress} connectWallet={connectWallet} />;
      case '04_CURVE_PREDICT.CFG':
        return <CurvePredictView key={activeTab} />;
      case '05_API_PRICING.SYS':
        return <ApiPricingView key={activeTab} walletAddress={walletAddress} connectWallet={connectWallet} />;
      default:
        return <AutoSniperView key={activeTab} />;
    }
  };

  if (isDocsView) {
    return <DocsView onBack={() => { window.location.hash = ''; }} />;
  }

  return (
    <div className="min-h-screen bg-phosphor-green text-terminal-black p-4 md:p-6 box-border flex flex-col gap-6 select-none">
      
      {/* Main Terminal Frame */}
      <div className="flex flex-col bg-phosphor-green p-3 md:p-6 gap-6 box-border">
        
        <header className="brutalist-border-thick bg-terminal-black text-phosphor-green py-4 px-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 brutalist-shadow">
          {/* Logo b[OS] */}
          <div className="flex flex-col items-start select-text w-full lg:w-auto">
            <div className="flex items-center justify-between w-full lg:w-auto gap-4">
              <span className="font-mono text-6xl md:text-[76px] font-bold leading-none text-phosphor-green tracking-tighter">
                b[OS]<span className="cursor-blink">_</span>
              </span>
              <div className="flex items-center gap-2 lg:hidden">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                <span className="font-mono text-[9px] font-bold bg-[#00ff00] text-black px-1.5 py-0.5 border border-[#00ff00] uppercase tracking-widest">
                  LIVE
                </span>
              </div>
            </div>
            <span className="font-sans text-[10px] md:text-xs text-phosphor-green/75 tracking-wide mt-1 font-semibold">
              Advanced LLM trenching. Pure bull power.
            </span>
          </div>
          
          {/* Combined Action & Wallet Grid split into separate blocks */}
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto mt-2 lg:mt-0">
            {/* Block 1: Utilities (READ DOCS, REGISTRY, X, GITHUB) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 font-mono text-xs md:text-sm lg:text-[15px] font-bold uppercase select-none">
              <a 
                href="#docs" 
                className="w-full sm:w-auto text-center px-3 md:px-5 py-2 md:py-2.5 border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all cursor-pointer select-none"
              >
                [ READ DOCS ]
              </a>
              <button 
                onClick={scrollToRegistry}
                className="w-full sm:w-auto text-center px-3 md:px-5 py-2 md:py-2.5 border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all cursor-pointer"
              >
                [ REGISTRY ]
              </button>
              <a 
                href="https://x.com/usebullOS" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-3 md:px-5 py-2 md:py-2.5 border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all cursor-pointer"
              >
                [ X ]
              </a>
              <a 
                href="https://github.com/bullOS-dev/bullOS" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-3 md:px-5 py-2 md:py-2.5 border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all cursor-pointer"
              >
                [ GITHUB ]
              </a>
            </div>

            {/* Block 2: Transaction & Wallet (CONNECT WALLET, CA) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 font-mono text-xs md:text-sm lg:text-[15px] font-bold uppercase select-none">
              {walletAddress ? (
                <button 
                  onClick={disconnectWallet}
                  className="w-full sm:w-auto text-center px-3 md:px-5 py-2 md:py-2.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all cursor-pointer select-none truncate"
                >
                  [ {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)} // DISC ]
                </button>
              ) : (
                <button 
                  onClick={connectWallet}
                  className="w-full sm:w-auto text-center px-3 md:px-5 py-2 md:py-2.5 border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all cursor-pointer select-none"
                >
                  [ CONNECT ]
                </button>
              )}
              <button 
                onClick={handleCopyCA}
                className="w-full sm:w-auto text-center px-3 md:px-5 py-2 md:py-2.5 border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all cursor-pointer select-none"
              >
                {caCopyLabel}
              </button>
            </div>
          </div>
        </header>

        {/* Central Workspace */}
        <div className="flex flex-col gap-6 box-border">
          
          <div className="flex flex-col md:flex-row gap-6 w-full items-stretch">
            <div className="flex-1 min-w-0 w-full">
              <TrendingTokens />
            </div>
            <div className="w-full md:w-[320px] shrink-0">
              <PriceTicker />
            </div>
          </div>
          
          {/* Top Fixed Manifesto View (Rendered outside the tab registry layout) */}
          <div className="border border-terminal-black bg-phosphor-green/5 relative box-border">
            {/* Absolute watermark background grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
            <ManifestoView />
          </div>

          {/* Top Navigation - System Registry Menu (Stretched Horizontally - 4 columns) */}
          <nav ref={registryRef} className="flex flex-col gap-3 border border-terminal-black p-4 bg-phosphor-green/10 brutalist-shadow box-border">
            <span className="font-mono text-2xl font-bold tracking-widest border-b border-terminal-black pb-2 block uppercase">
              System Registry
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left p-3 border font-mono flex flex-col justify-between transition-all cursor-pointer min-h-[75px] brutalist-shadow ${
                      isActive 
                        ? 'bg-terminal-black text-phosphor-green border-terminal-black font-bold' 
                        : 'bg-phosphor-green text-terminal-black border-terminal-black hover:bg-terminal-black hover:text-phosphor-green hover:shadow-none'
                    }`}
                  >
                    <span className="font-bold text-sm tracking-wide">{tab.name}</span>
                    <span className={`text-xs font-sans font-semibold mt-1 leading-tight ${isActive ? 'text-white opacity-85' : 'text-terminal-black/75'}`}>
                      {tab.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Main Visual Board / Display Panel */}
          <main className="border border-terminal-black bg-phosphor-green/5 relative box-border">
            {/* Absolute watermark background grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
            
            {/* Core Component Render */}
            <div className="relative z-10">
              {renderMainView()}
            </div>
          </main>

        </div>
      </div>

      {/* Bottom brutalist-style Terminal window */}
      <div className="mt-6 border border-[#00ff00] bg-black flex flex-col select-text overflow-hidden">
        {/* Brutalist Title Bar */}
        <div className="bg-black text-[#00ff00] px-4 py-2.5 flex items-center justify-between border-b border-[#00ff00] select-none font-mono text-sm font-bold uppercase tracking-wider">
          <span>[ 06 // b[OS] SYSTEM COMMAND CONSOLE ]</span>
          <span className="text-[#00ff00] animate-pulse">● ACTIVE SYSTEM TUNNEL</span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 flex flex-col gap-4 bg-black text-[#00ff00] font-mono">
          {/* Scrollable Logs Screen */}
          <div ref={cliContainerRef} className="h-64 overflow-y-auto flex flex-col gap-2 select-text text-base md:text-lg font-bold">
            {cmdHistory.map((log, index) => (
              <div key={index} className={`leading-relaxed ${
                log.type === 'error' ? 'text-red-500 font-bold' : 
                log.type === 'input' ? 'text-white font-bold' : 
                log.type === 'system' ? 'text-blue-400 font-bold' : 'text-[#00ff00]'
              }`}>
                {log.text}
              </div>
            ))}
          </div>

          {/* Prompt line input */}
          <form onSubmit={handleCommandSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border-t border-[#00ff00]/25 pt-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[#00ff00] font-bold select-none text-sm md:text-base">
                {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}@b[OS]:~$` : 'guest@b[OS]:~$'}
              </span>
            </div>
            <input
              type="text"
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              placeholder={walletAddress ? "TYPE QUERY (e.g. HELP) AND PRESS ENTER..." : "CONNECT WALLET TO ACTIVATE MAIN TERMINAL..."}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm md:text-base focus:ring-0 focus:outline-none placeholder-white/30 uppercase font-bold"
            />
            <button
              type="submit"
              className={`px-3 md:px-5 py-2 font-mono text-xs md:text-sm font-bold border transition-all cursor-pointer select-none shrink-0 ${
                walletAddress 
                  ? 'bg-[#00ff00] text-black border-[#00ff00] hover:bg-black hover:text-[#00ff00]' 
                  : 'bg-red-600/10 text-red-500 border-red-500 hover:bg-red-500 hover:text-black'
              }`}
            >
              {walletAddress ? "RUN CMD" : "CONNECT WALLET"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
