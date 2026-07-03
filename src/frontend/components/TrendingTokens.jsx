import React, { useState, useEffect } from 'react';

export default function TrendingTokens() {
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTrending = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch('https://api.geckoterminal.com/api/v2/networks/solana/trending_pools?include=base_token');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      
      if (!json.data) {
        throw new Error('Invalid response structure');
      }

      const tokensMap = {};
      if (json.included) {
        json.included.forEach(item => {
          if (item.type === 'token') {
            tokensMap[item.id] = {
              name: item.attributes.name,
              symbol: item.attributes.symbol
            };
          }
        });
      }

      const processed = json.data.slice(0, 10).map((pool, index) => {
        const baseTokenId = pool.relationships?.base_token?.data?.id;
        const tokenMeta = tokensMap[baseTokenId] || { name: 'Unknown', symbol: 'UNKNOWN' };
        
        const marketCap = pool.attributes?.market_cap_usd !== null 
          ? pool.attributes?.market_cap_usd 
          : pool.attributes?.fdv_usd;

        return {
          rank: index + 1,
          name: tokenMeta.name,
          symbol: tokenMeta.symbol,
          marketCap: marketCap
        };
      });

      setTrendingData(processed);
      setError(null);
    } catch (err) {
      console.error('Error fetching trending pools:', err);
      if (!trendingData.length) {
        setError('GeckoTerminal Offline');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrending();
    const interval = setInterval(() => {
      fetchTrending(true);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatMcap = (val) => {
    if (val === undefined || val === null) return 'N/A';
    const num = parseFloat(val);
    if (isNaN(num)) return 'N/A';
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(1)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(1)}M`;
    }
    if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(0)}K`;
    }
    return `$${num.toFixed(0)}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-3 bg-phosphor-green/10 border border-terminal-black w-full text-terminal-black select-none h-full flex flex-col justify-between min-h-[169px]">
        <div>
          <h2 className="font-mono text-xs font-extrabold uppercase border-b border-terminal-black/20 pb-1 mb-2">
            [TOP 10 TRENDING SOLANA]
          </h2>
          <div className="flex gap-2.5 overflow-hidden py-1">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="p-2.5 bg-phosphor-green border border-terminal-black flex flex-col gap-2 w-[180px] shrink-0 animate-pulse h-[105px] justify-between"
              >
                <div className="flex justify-between items-center pb-0.5 border-b border-terminal-black/10">
                  <div className="h-4 w-6 bg-terminal-black/20"></div>
                  <div className="h-4 w-12 bg-terminal-black/20"></div>
                </div>
                <div className="h-4.5 w-24 bg-terminal-black/25 mt-0.5"></div>
                <div className="flex flex-col mt-0.5 gap-1.5">
                  <div className="h-3 w-12 bg-terminal-black/10"></div>
                  <div className="h-5 w-20 bg-terminal-black/20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && trendingData.length === 0) {
    return (
      <div className="p-3 bg-phosphor-green/10 border border-terminal-black w-full text-red-600 font-mono text-xs flex items-center justify-between select-none min-h-[169px] h-full">
        <div className="flex items-center gap-2">
          <span className="animate-pulse text-red-600">●</span>
          <span>[TRENDING FEED OFFLINE]</span>
        </div>
        <button 
          onClick={() => fetchTrending()} 
          className="px-2 py-1 bg-red-600/10 border border-red-600/30 text-[10px] uppercase font-bold hover:bg-red-600/20 active:bg-red-600/30 cursor-pointer transition-all"
        >
          RETRY
        </button>
      </div>
    );
  }

  const duplicateList = [...trendingData, ...trendingData];

  return (
    <div className="p-3 bg-phosphor-green/10 border border-terminal-black w-full text-terminal-black overflow-hidden select-none relative h-full flex flex-col justify-between min-h-[169px]">
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          gap: 10px;
          animation: ticker-scroll 35s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div>
        <h2 className="font-mono text-xs font-extrabold uppercase border-b border-terminal-black/20 pb-1 mb-2">
          [TOP 10 TRENDING SOLANA]
        </h2>

        <div className="relative w-full overflow-hidden py-1">
          <div className="ticker-track">
            {duplicateList.map((item, idx) => (
              <div 
                key={`${item.rank}-${idx}`}
                className="p-2.5 bg-phosphor-green text-terminal-black border border-terminal-black flex flex-col justify-between h-[105px] w-[180px] shrink-0 select-text"
              >
                <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-terminal-black/20">
                  <span className="font-mono text-sm font-bold text-terminal-black/40 leading-none">
                    #{item.rank}
                  </span>
                  <span className="font-mono text-sm font-bold text-terminal-black/80 truncate leading-none">
                    [{item.symbol}]
                  </span>
                </div>
                
                {/* Token Name - Large & Black */}
                <div className="font-mono text-base font-black text-terminal-black truncate leading-none mt-0.5">
                  {item.name}
                </div>

                {/* Market Cap Section - Large & Black */}
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-terminal-black/45 uppercase tracking-widest font-extrabold leading-none">
                    MARKET CAP
                  </span>
                  <div className="font-mono text-2xl font-bold text-terminal-black leading-none mt-0.5 select-text">
                    {formatMcap(item.marketCap)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mini live indicator */}
      <div className="flex items-center gap-1 px-1 text-[9px] font-mono text-terminal-black/50 self-end select-none mt-2">
        <span className={`w-1.5 h-1.5 bg-terminal-black/60 ${isRefreshing ? 'animate-ping' : 'animate-pulse'}`}></span>
        <span>[LIVE FEED {isRefreshing && 'SYNCING...'}]</span>
      </div>
    </div>
  );
}
