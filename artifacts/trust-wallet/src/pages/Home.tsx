import { useState } from "react";
import { useLocation } from "wouter";
import StatusBar from "@/components/StatusBar";
import TabBar from "@/components/TabBar";
import CoinLogo from "@/components/CoinLogo";
import { useWallet } from "@/context/WalletContext";

function fmt(n: number) {
  if (n === 0) return "$0.00";
  if (n >= 1000) return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return "$" + n.toFixed(n < 0.01 ? 6 : 2);
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"crypto" | "watchlist" | "nfts">("crypto");
  const [, setLocation] = useLocation();
  const { coins, totalValue, walletName } = useWallet();

  const watchlist = coins.filter(c => ["btc","eth","bnb"].includes(c.id));

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <StatusBar />

      {/* Top bar */}
      <div className="flex items-center px-4 py-2 gap-3">
        <button onClick={() => setLocation("/settings")} className="w-9 h-9 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center bg-[#1e1e1e] rounded-full px-3 py-2 gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span className="text-[#666] text-[14px]">Search</span>
          </div>
        </div>
        <button className="w-9 h-9 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </button>
      </div>

      {/* Wallet selector */}
      <div className="flex items-center justify-center gap-2 py-1">
        <button className="flex items-center gap-1.5 bg-[#1e1e1e] rounded-full px-4 py-1.5">
          <span className="text-white font-semibold text-[15px]">{walletName}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
        <button className="w-7 h-7 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
        </button>
      </div>

      {/* Total balance */}
      <div className="flex flex-col items-center py-2">
        <span className="text-white font-bold text-[28px]">{fmt(totalValue)}</span>
        <button
          onClick={() => setLocation("/edit-balance")}
          className="flex items-center gap-1 mt-1 text-[#3dd68c] text-[12px] font-medium"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3dd68c" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit balances
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-start justify-center gap-6 px-4 py-3">
        {[
          { label: "Send", path: "/send", icon: <path d="M7 17L17 7M17 7H7M17 7v10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/> },
          { label: "Receive", path: "/receive", icon: <path d="M17 7L7 17M7 17h10M7 17V7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/> },
          { label: "Swap", path: "/swap", icon: <><polyline points="17 1 21 5 17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 11V9a4 4 0 014-4h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 23 3 19 7 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 13v2a4 4 0 01-4 4H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></> },
          { label: "Buy", path: "/buy", icon: <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/> },
        ].map(({ label, path, icon }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <button
              onClick={() => setLocation(path)}
              className="w-16 h-16 bg-[#1e1e1e] rounded-2xl flex items-center justify-center active:opacity-70 transition-opacity"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">{icon}</svg>
            </button>
            <span className="text-white text-[13px] font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div className="px-4 py-2">
        <div className="rounded-2xl p-[1.5px]" style={{background:'linear-gradient(135deg,#9b59b6,#e91e8c,#3dd68c)'}}>
          <div className="bg-[#1a1a1a] rounded-[14px] p-3 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 text-2xl">
              🔥
            </div>
            <div className="flex-1">
              <p className="text-white text-[13px] font-medium leading-snug">Hyperliquid live with 200+ markets, 0% markup on fees</p>
              <p className="text-[#3dd68c] text-[12px] font-medium mt-0.5">Explore now →</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 pt-2 border-b border-[#1e1e1e] gap-6">
        {(["crypto","watchlist","nfts"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex flex-col items-center pb-2.5 relative"
          >
            <span className={`text-[15px] font-medium capitalize ${activeTab === tab ? "text-white" : "text-[#555]"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3dd68c] rounded-full"/>}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 pb-2">
          <button>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </button>
          <button>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto pb-24">
        {activeTab === "crypto" && coins.map(coin => (
          <div
            key={coin.id}
            className="flex items-center px-4 py-3.5 border-b border-[#1a1a1a] active:bg-[#1e1e1e] cursor-pointer transition-colors"
            onClick={() => setLocation(`/coin/${coin.id}`)}
          >
            <CoinLogo symbol={coin.symbol} logoUrl={coin.logoUrl} color={coin.color} size={42} />
            <div className="flex-1 ml-3">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-[15px]">{coin.symbol}</span>
                <span className="text-[#555] text-[12px]">{coin.chain}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[#888] text-[13px]">{fmt(coin.price)}</span>
                <span className={`text-[12px] font-medium ${coin.change >= 0 ? "text-[#3dd68c]" : "text-[#ef4444]"}`}>
                  {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium text-[15px]">{coin.balance > 0 ? coin.balance.toLocaleString() : "0"}</p>
              <p className="text-[#888] text-[13px]">{fmt(coin.balance * coin.price)}</p>
            </div>
          </div>
        ))}

        {activeTab === "watchlist" && (
          <>
            {watchlist.map(coin => (
              <div
                key={coin.id}
                className="flex items-center px-4 py-3.5 border-b border-[#1a1a1a] active:bg-[#1e1e1e] cursor-pointer transition-colors"
                onClick={() => setLocation(`/coin/${coin.id}`)}
              >
                <CoinLogo symbol={coin.symbol} logoUrl={coin.logoUrl} color={coin.color} size={42} />
                <div className="flex-1 ml-3">
                  <span className="text-white font-semibold text-[15px]">{coin.symbol}</span>
                  <p className="text-[#888] text-[13px] mt-0.5">${(coin.price * 24000000).toLocaleString("en-US", {notation:"compact"})}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium text-[15px]">{fmt(coin.price)}</p>
                  <p className={`text-[12px] font-medium ${coin.change >= 0 ? "text-[#3dd68c]" : "text-[#ef4444]"}`}>
                    {coin.change >= 0 ? "+" : ""}{coin.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center py-5">
              <button className="text-[#3dd68c] font-medium text-[15px]">+ Add tokens</button>
            </div>
            <div className="px-4 py-2 border-t border-[#1e1e1e]">
              <p className="text-white font-bold text-[16px]">Prediction <span className="text-[#555] ml-1">›</span></p>
            </div>
          </>
        )}

        {activeTab === "nfts" && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 bg-[#1e1e1e] rounded-2xl flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <p className="text-[#555] text-[14px]">No NFTs found</p>
          </div>
        )}
      </div>

      <TabBar active="home" />
    </div>
  );
}
