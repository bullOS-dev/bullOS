import React, { useState, useEffect } from 'react';

const BOS_ADDR = '9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump'.toLowerCase();
const SOL_ADDR = 'So11111111111111111111111111111111111111112'.toLowerCase();

export default function PriceTicker() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch('https://api.dexscreener.com/tokens/v1/solana/9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump,So11111111111111111111111111111111111111112');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      if (!Array.isArray(json)) {
        throw new Error('Invalid response structure');
      }
      setData(json);
      setError(null);
    } catch (err) {
      console.error('Error fetching prices:', err);
      if (!data) {
        setError('API Offline');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(true);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const getBestPair = (tokenAddr) => {
    if (!data) return null;
    const tokenPairs = data.filter(p => 
      p.baseToken?.address?.toLowerCase() === tokenAddr ||
      p.quoteToken?.address?.toLowerCase() === tokenAddr
    );
    if (tokenPairs.length === 0) return null;
    return [...tokenPairs].sort((a, b) => {
      const liqA = a.liquidity?.usd || 0;
      const liqB = b.liquidity?.usd || 0;
      return liqB - liqA;
    })[0];
  };

  const formatPrice = (priceStr) => {
    if (!priceStr) return '0.00';
    const price = parseFloat(priceStr);
    if (isNaN(price)) return '0.00';
    if (price === 0) return '0.00';
    if (price >= 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    const str = price.toString();
    const match = str.match(/^0\.0+/);
    if (match) {
      const leadingZerosCount = match[0].length - 2;
      const decimals = Math.max(4, leadingZerosCount + 4);
      return price.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  };

  const formatCompact = (numVal) => {
    if (numVal === undefined || numVal === null) return 'N/A';
    const num = parseFloat(numVal);
    if (isNaN(num)) return 'N/A';
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  const bosPair = getBestPair(BOS_ADDR);
  const solPair = getBestPair(SOL_ADDR);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="p-3 bg-phosphor-green/10 border border-terminal-black w-full text-terminal-black select-none h-full flex flex-col justify-between min-h-[169px]">
        <div>
          <h2 className="font-mono text-xs font-extrabold uppercase border-b border-terminal-black/20 pb-1 mb-2">
            [MARKET WATCH]
          </h2>
          <div className="grid grid-cols-2 gap-2.5 w-full animate-pulse py-1">
            {[1, 2].map((i) => (
              <div 
                key={i} 
                className="p-2.5 bg-phosphor-green border border-terminal-black flex flex-col gap-2 min-h-[105px] justify-between"
              >
                <div className="flex justify-between items-center pb-0.5 border-b border-terminal-black/10">
                  <div className="h-4 w-12 bg-terminal-black/20"></div>
                  <div className="h-4 w-8 bg-terminal-black/20"></div>
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="h-3 w-16 bg-terminal-black/10"></div>
                  <div className="h-7 w-28 bg-terminal-black/25"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !bosPair && !solPair) {
    return (
      <div className="p-3 bg-phosphor-green/10 border border-terminal-black w-full text-red-600 font-mono text-xs flex items-center justify-between select-none min-h-[169px] h-full">
        <div className="flex items-center gap-2">
          <span className="animate-pulse text-red-600">●</span>
          <span>[FEED OFFLINE]</span>
        </div>
        <button 
          onClick={() => fetchData()} 
          className="px-2 py-1 bg-red-600/10 border border-red-600/30 text-[10px] uppercase font-bold hover:bg-red-600/20 active:bg-red-600/30 cursor-pointer transition-all"
        >
          RETRY
        </button>
      </div>
    );
  }

  const renderCard = (pair, label, type) => {
    const priceChange = parseFloat(pair?.priceChange?.h24 || 0);
    const isUp = priceChange >= 0;
    
    let displayValue = '';
    let metricLabel = '';

    if (type === 'mcap') {
      const mcap = pair?.marketCap || pair?.fdv;
      displayValue = mcap ? `$${formatCompact(mcap)}` : 'N/A';
      metricLabel = 'MARKET CAP';
    } else {
      const price = pair?.priceUsd;
      displayValue = price ? `$${formatPrice(price)}` : '$0.00';
      metricLabel = 'PRICE USD';
    }

    return (
      <div className="p-2.5 bg-phosphor-green text-terminal-black border border-terminal-black flex flex-col justify-between h-[105px] group select-text">
        <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-terminal-black/20">
          <span className="font-mono text-base font-extrabold tracking-wider text-terminal-black uppercase group-hover:opacity-80 transition-opacity leading-none">
            [{label}]
          </span>
          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 leading-none transition-all ${
            isUp 
              ? 'text-phosphor-green bg-terminal-black border border-terminal-black' 
              : 'text-white bg-red-700 border border-red-800'
          }`}>
            <span>{isUp ? '▲' : '▼'}</span>
            <span>{Math.abs(priceChange).toFixed(1)}%</span>
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-terminal-black/50 uppercase tracking-widest font-extrabold leading-none">
            {metricLabel}
          </span>
          <div className="font-mono text-3xl font-black text-terminal-black leading-none mt-0.5 select-text">
            {displayValue}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 bg-phosphor-green/10 border border-terminal-black w-full text-terminal-black flex flex-col h-full justify-between min-h-[169px]">
      <div>
        <h2 className="font-mono text-xs font-extrabold uppercase border-b border-terminal-black/20 pb-1 mb-2">
          [MARKET WATCH]
        </h2>
        <div className="grid grid-cols-2 gap-2.5 w-full py-1">
          {renderCard(bosPair, 'ANSEM', 'mcap')}
          {renderCard(solPair, 'SOL', 'price')}
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
