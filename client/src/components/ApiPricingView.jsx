import React, { useState, useEffect } from 'react';

export default function ApiPricingView({ walletAddress, connectWallet }) {
  const [activeSubTab, setActiveSubTab] = useState('tiers');
  const [selectedMockTier, setSelectedMockTier] = useState(0.8); // simulated holding percentage
  const [verificationLog, setVerificationLog] = useState([
    "[SYSTEM] API Handshake monitor initialized.",
    "[STATUS] Ready to verify wallet holdings."
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [dots, setDots] = useState('...');

  // Live indicator blinking helper
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev === '...' ? '.' : prev === '.' ? '..' : '...'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    if (!walletAddress) {
      connectWallet();
      return;
    }
    setIsVerifying(true);
    setVerificationLog(prev => [
      ...prev,
      `[PROCESS] Initiating cryptographic proof signature for wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`,
    ]);

    setTimeout(() => {
      setVerificationLog(prev => [
        ...prev,
        `[METRICS] Fetching $bOS supply index from Solana ledger...`,
      ]);
    }, 1000);

    setTimeout(() => {
      const activeTier = selectedMockTier >= 1.5 ? "Tier 3 (Mainframe Overlord)" :
                         selectedMockTier >= 1.0 ? "Tier 2 (Syndicate Enforcer)" :
                         selectedMockTier >= 0.5 ? "Tier 1 (Trench Initiate)" : "None";
      
      setVerificationLog(prev => [
        ...prev,
        `[SUCCESS] Signature verified. Wallet holds ${selectedMockTier}% of total $bOS supply.`,
        activeTier !== "None" 
          ? `[GRANTED] Access Level: ${activeTier} authenticated.` 
          : `[DENIED] Hold requirement not met. Minimum 0.5% $bOS required.`
      ]);
      setIsVerifying(false);
    }, 2200);
  };

  const tiers = [
    {
      level: "Tier 1",
      name: "Trench Initiate",
      req: "0.5%",
      rate: "10 RPS",
      jito: "Standard (0.005 SOL tips)",
      sandwich: "Basic Protection",
      desc: "For individual searchers tracking single tokens."
    },
    {
      level: "Tier 2",
      name: "Syndicate Enforcer",
      req: "1.0%",
      rate: "50 RPS",
      jito: "Priority (0.010 SOL tips)",
      sandwich: "Advanced Protection",
      desc: "For active traders demanding faster block execution."
    },
    {
      level: "Tier 3",
      name: "Mainframe Overlord",
      req: "1.5%",
      rate: "Unlimited RPS",
      jito: "Ultra Jito Multiplexing",
      sandwich: "Anti-MEV Sandbox",
      desc: "For quants running automated high-frequency scripts."
    }
  ];

  const getTierStatus = (reqPercent) => {
    if (!walletAddress) return "CONNECT WALLET";
    const req = parseFloat(reqPercent);
    if (selectedMockTier >= req) return "QUALIFIED";
    return "LOCKED";
  };

  return (
    <div className="flex flex-col p-6 gap-6 text-terminal-black font-sans box-border select-text">
      
      {/* View Header */}
      <div className="border-b border-terminal-black/30 pb-3 flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
        <div>
          <h2 className="font-mono text-3xl font-bold uppercase tracking-wide">
            [ 07 // API GATEWAY & PRICING ]
          </h2>
          <span className="text-sm font-bold uppercase mt-1 text-terminal-black/60 block">
            MODULE TARGET: APPLICANT AUTHENTICATION & MULTI-TIER ACCESS CONFIG
          </span>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex gap-2 select-none">
          <button
            onClick={() => setActiveSubTab('tiers')}
            className={`px-3 py-1.5 font-mono text-xs font-bold border transition-all cursor-pointer ${
              activeSubTab === 'tiers' 
                ? 'bg-terminal-black text-phosphor-green border-terminal-black' 
                : 'bg-phosphor-green/20 text-terminal-black border-terminal-black hover:bg-terminal-black hover:text-phosphor-green'
            }`}
          >
            01 // ACCESS TIERS
          </button>
          <button
            onClick={() => setActiveSubTab('handshake')}
            className={`px-3 py-1.5 font-mono text-xs font-bold border transition-all cursor-pointer ${
              activeSubTab === 'handshake' 
                ? 'bg-terminal-black text-phosphor-green border-terminal-black' 
                : 'bg-phosphor-green/20 text-terminal-black border-terminal-black hover:bg-terminal-black hover:text-phosphor-green'
            }`}
          >
            02 // CRYPTO HANDSHAKE
          </button>
        </div>
      </div>

      {activeSubTab === 'tiers' ? (
        <div className="flex flex-col gap-6">
          {/* Wallet Connection Status Alert */}
          {!walletAddress && (
            <div className="border border-red-500 bg-red-500/10 p-4 font-mono text-xs font-bold text-red-500 uppercase flex flex-col sm:flex-row justify-between items-center gap-3">
              <span>[WARNING] WALLET DISCONNECTED. CANNOT VERIFY ACCESS ELIGIBILITY FOR API CHANNELS.</span>
              <button 
                onClick={connectWallet}
                className="px-4 py-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all cursor-pointer font-semibold uppercase tracking-wider"
              >
                [ CONNECT SOLANA WALLET ]
              </button>
            </div>
          )}

          {/* Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((t, idx) => {
              const reqNum = parseFloat(t.req);
              const isQualified = walletAddress && (selectedMockTier >= reqNum);
              return (
                <div 
                  key={idx} 
                  className={`border brutalist-shadow p-5 flex flex-col justify-between min-h-[300px] transition-all relative ${
                    isQualified 
                      ? 'bg-phosphor-green/10 border-terminal-black border-2' 
                      : 'bg-black/5 border-terminal-black/30 opacity-75'
                  }`}
                >
                  {isQualified && (
                    <div className="absolute top-3 right-3 bg-terminal-black text-phosphor-green text-[9px] font-bold font-mono px-2 py-0.5 border border-terminal-black uppercase tracking-wider">
                      ★ Active Eligibility
                    </div>
                  )}
                  
                  <div>
                    <span className="font-mono text-xs font-bold text-terminal-black/60 uppercase block mb-1">
                      {t.level}
                    </span>
                    <h3 className="font-mono text-xl font-bold uppercase border-b border-terminal-black/10 pb-2 mb-3">
                      {t.name}
                    </h3>
                    <p className="text-xs font-semibold text-terminal-black/80 mb-4">
                      {t.desc}
                    </p>

                    <div className="flex flex-col gap-2 font-mono text-xs mt-2">
                      <div className="flex justify-between border-b border-terminal-black/5 pb-1">
                        <span className="text-terminal-black/60">HOLD REQUIREMENT:</span>
                        <span className="font-bold text-terminal-black">{t.req} $bOS</span>
                      </div>
                      <div className="flex justify-between border-b border-terminal-black/5 pb-1">
                        <span className="text-terminal-black/60">RATE LIMIT:</span>
                        <span className="font-bold text-terminal-black">{t.rate}</span>
                      </div>
                      <div className="flex justify-between border-b border-terminal-black/5 pb-1">
                        <span className="text-terminal-black/60">JITO LEVEL:</span>
                        <span className="font-bold text-terminal-black">{t.jito}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-terminal-black/60">MEV PROTECTION:</span>
                        <span className="font-bold text-terminal-black">{t.sandwich}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-terminal-black/10 pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-sans font-bold uppercase text-terminal-black/65">
                      STATUS:
                    </span>
                    <span className={`font-mono text-xs font-bold border px-2 py-0.5 ${
                      isQualified 
                        ? 'bg-terminal-black text-[#00ff00] border-terminal-black' 
                        : 'bg-transparent text-terminal-black/60 border-terminal-black/30'
                    }`}>
                      {getTierStatus(t.req)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Docs Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-base font-bold uppercase border-b border-terminal-black/10 pb-1">
              API GATEWAY CONFIGURATION
            </h4>
            <div className="text-base flex flex-col gap-3 font-semibold leading-relaxed text-terminal-black/95">
              <p>Cryptographic wallet signatures verify contract ownership values on-chain:</p>
              <pre className="bg-black/5 p-4 font-mono select-text text-sm leading-normal overflow-x-auto">
{`async function verifyAccess(wallet: PublicKey): Promise<Tier> {
  const balance = await getBOSBalance(wallet);
  const total = await getBOSTotalSupply();
  const holdPercentage = (balance / total) * 100;
  
  if (holdPercentage >= 1.5) return Tier.OVERLORD;
  if (holdPercentage >= 1.0) return Tier.ENFORCER;
  if (holdPercentage >= 0.5) return Tier.INITIATE;
  throw new Error("INSUFFICIENT_HOLDINGS");
}`}
              </pre>
            </div>
          </div>

          {/* Handshake Console (Visual terminal simulation) */}
          <div className="p-4 flex flex-col justify-between gap-3 border border-terminal-black/25 bg-black/5 brutalist-shadow">
            <span className="text-xs font-mono font-bold uppercase block mb-1 text-terminal-black/75 border-b border-terminal-black/15 pb-1">
              [ CRYPTOGRAPHIC HANDSHAKE CONSOLE ]
            </span>
            
            <div className="bg-black text-[#00ff00] p-4 font-mono text-xs flex flex-col gap-2 border border-terminal-black min-h-[170px] select-text">
              {verificationLog.map((log, idx) => (
                <div key={idx} className={log.includes('[SUCCESS]') ? 'text-[#00ff00] font-bold' : log.includes('[DENIED]') ? 'text-red-500 font-bold' : 'text-white/80'}>
                  {log}
                </div>
              ))}
              {isVerifying && <div className="text-white/60 font-bold animate-pulse">&gt; VERIFYING HOLDINGS BALANCE{dots}</div>}
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className={`w-full py-2.5 font-mono text-sm font-bold border transition-all cursor-pointer select-none text-center ${
                isVerifying
                  ? 'bg-black/10 text-terminal-black/40 border-terminal-black/30'
                  : 'bg-[#00ff00] text-black border-terminal-black hover:bg-black hover:text-[#00ff00]'
              }`}
            >
              {isVerifying ? "PROCESSING SIGNATURE..." : walletAddress ? "RUN SIGNATURE HANDSHAKE" : "CONNECT WALLET TO START"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
