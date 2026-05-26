import { useState } from "react";
import { useLocation, useParams } from "wouter";
import StatusBar from "@/components/StatusBar";
import CoinLogo from "@/components/CoinLogo";
import { useWallet } from "@/context/WalletContext";

const TIMEFRAMES = ["1H","1D","1W","1M","1Y","ALL"];

function generateChartPath(seed: number, positive: boolean, w: number, h: number): string {
  const pts: [number,number][] = [];
  let y = h * 0.5;
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * w;
    const rand = Math.sin(seed * i * 0.7 + i * 0.3) * 0.5 + Math.cos(seed * i * 0.4) * 0.3;
    y = Math.max(10, Math.min(h - 10, y + rand * 25 + (positive ? -0.5 : 0.5)));
    pts.push([x, y]);
  }
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
}

export default function CoinDetailPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { coins, transactions } = useWallet();
  const [activeTime, setActiveTime] = useState("1D");

  const coin = coins.find(c => c.id === params.id);
  if (!coin) { setLocation("/"); return null; }

  const isPositive = coin.change >= 0;
  const lineColor = isPositive ? "#3dd68c" : "#ef4444";
  const chartSeed = coin.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const path = generateChartPath(chartSeed, isPositive, 400, 140);
  const coinTxs = transactions.filter(tx => tx.symbol === coin.symbol);

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] pb-24">
      <StatusBar time="15:06"/>

      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setLocation("/")} className="w-8 h-8 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="w-8"/>
        <button>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" fill="#3dd68c" stroke="#3dd68c" strokeWidth="1"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-3">
          <CoinLogo symbol={coin.symbol} logoUrl={coin.logoUrl} color={coin.color} size={42}/>
          <div>
            <p className="text-white font-bold text-[16px]">{coin.symbol}</p>
            <p className="text-[#888] text-[13px]">{coin.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-bold text-[20px]">${coin.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          <p className={`text-[13px] font-medium ${isPositive ? "text-[#3dd68c]" : "text-[#ef4444]"}`}>
            {isPositive ? "+" : ""}{coin.change.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="px-0 mt-2 mb-1">
        <svg width="100%" viewBox="0 0 400 140" preserveAspectRatio="none" style={{height:'160px'}}>
          <defs>
            <linearGradient id={`grad-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={lineColor} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={path + " L 400 140 L 0 140 Z"} fill={`url(#grad-${coin.id})`}/>
          <path d={path} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Timeframes */}
      <div className="flex items-center justify-between px-4 mb-5">
        {TIMEFRAMES.map(tf => (
          <button key={tf} onClick={() => setActiveTime(tf)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${activeTime === tf ? "bg-[#2a2a2a] text-white" : "text-[#555]"}`}>
            {tf}
          </button>
        ))}
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-b border-[#1e1e1e] mb-4">
        <p className="text-white font-semibold text-[15px]">Your balance</p>
        <div className="text-right">
          <p className="text-white font-semibold text-[15px]">${(coin.balance * coin.price).toFixed(2)}</p>
          <p className="text-[#888] text-[12px]">{coin.balance} {coin.symbol}</p>
        </div>
      </div>

      {/* Send / Receive */}
      <div className="flex items-center gap-3 px-4 mb-5">
        <button onClick={() => setLocation(`/send/${coin.id}`)} className="flex-1 h-12 bg-[#1e1e1e] rounded-full flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          <span className="text-white font-medium text-[15px]">Send</span>
        </button>
        <button onClick={() => setLocation(`/receive/${coin.id}`)} className="flex-1 h-12 bg-[#1e1e1e] rounded-full flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="5" y="5" width="3" height="3" fill="white"/><rect x="16" y="5" width="3" height="3" fill="white"/>
            <rect x="5" y="16" width="3" height="3" fill="white"/>
          </svg>
          <span className="text-white font-medium text-[15px]">Receive</span>
        </button>
      </div>

      {/* Activity */}
      <div className="px-4 mb-4">
        <p className="text-white font-bold text-[16px] mb-3">Activity <span className="text-[#555]">›</span></p>
        {coinTxs.length === 0 ? (
          <p className="text-[#888] text-[13px]">Missing a transaction? <span className="text-[#3dd68c]">View on explorer</span></p>
        ) : coinTxs.map(tx => (
          <div key={tx.id} className="flex items-center py-3 border-b border-[#1a1a1a]">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${tx.type === "receive" ? "bg-[#1a3a2a]" : "bg-[#2a1a1a]"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tx.type === "receive" ? "#3dd68c" : "#ef4444"} strokeWidth="2">
                {tx.type === "receive" ? <path d="M17 7L7 17M7 17h10M7 17V7"/> : <path d="M7 17L17 7M17 7H7M17 7v10"/>}
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-[14px] capitalize">{tx.type}</p>
              <p className="text-[#888] text-[12px]">{new Date(tx.date).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className={`font-medium text-[14px] ${tx.type === "receive" ? "text-[#3dd68c]" : "text-white"}`}>
                {tx.type === "receive" ? "+" : "-"}{tx.amount.toFixed(4)} {tx.symbol}
              </p>
              <p className="text-[#888] text-[12px]">${tx.usdValue.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="px-4 mb-4">
        <p className="text-white font-bold text-[16px] mb-3">Stats</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[#888] text-[12px]">Market Cap</p>
            <p className="text-white text-[14px] font-medium mt-0.5">${(coin.price * 19000000).toLocaleString("en-US",{notation:"compact"})}</p>
          </div>
          <div>
            <p className="text-[#888] text-[12px]">24h Volume</p>
            <p className="text-white text-[14px] font-medium mt-0.5">${(coin.price * 350000).toLocaleString("en-US",{notation:"compact"})}</p>
          </div>
          <div>
            <p className="text-[#888] text-[12px]">24h High</p>
            <p className="text-white text-[14px] font-medium mt-0.5">${(coin.price * 1.025).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          </div>
          <div>
            <p className="text-[#888] text-[12px]">24h Low</p>
            <p className="text-white text-[14px] font-medium mt-0.5">${(coin.price * 0.975).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-6 pt-2 bg-[#121212] border-t border-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <button onClick={() => setLocation(`/buy`)} className="flex-1 h-14 rounded-full text-white font-semibold text-[16px]" style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}>
            Buy {coin.symbol}
          </button>
          <button onClick={() => setLocation(`/swap`)} className="w-14 h-14 rounded-full bg-[#1e1e1e] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
              <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
