import { useState } from "react";
import { useLocation, useParams } from "wouter";
import StatusBar from "@/components/StatusBar";
import CoinLogo from "@/components/CoinLogo";
import { useWallet } from "@/context/WalletContext";

function QRCode({ address, color }: { address: string; color: string }) {
  const cells = 21;
  const hash = address.split("").reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const grid: boolean[][] = Array.from({length: cells}, (_, row) =>
    Array.from({length: cells}, (_, col) => {
      if (row < 7 && col < 7) return true;
      if (row < 7 && col >= cells - 7) return true;
      if (row >= cells - 7 && col < 7) return true;
      const seed = (row * 31 + col * 17 + hash) * 2654435761;
      return (seed & 0xFF) > 100;
    })
  );

  return (
    <div className="p-4 bg-white rounded-2xl inline-block">
      <div style={{display:'grid', gridTemplateColumns:`repeat(${cells}, 10px)`, gap:'1px'}}>
        {grid.flat().map((on, i) => (
          <div key={i} style={{width:10,height:10,background:on?'#000':'#fff'}}/>
        ))}
      </div>
    </div>
  );
}

export default function ReceivePage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id?: string }>();
  const { coins } = useWallet();
  const [selectedId, setSelectedId] = useState(params.id || coins[0].id);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [showDetail, setShowDetail] = useState(!!params.id);

  const coin = coins.find(c => c.id === selectedId) || coins[0];
  const filtered = coins.filter(c =>
    c.symbol.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function copyAddress() {
    navigator.clipboard.writeText(coin.address.replace("...", "abcdef1234567890")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (showDetail) {
    return (
      <div className="flex flex-col min-h-screen bg-[#121212]">
        <StatusBar/>
        <div className="flex items-center px-4 py-3">
          <button onClick={() => setShowDetail(false)} className="w-8 h-8 flex items-center justify-center mr-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h1 className="text-white font-bold text-[18px] flex-1 text-center pr-8">Receive {coin.symbol}</h1>
        </div>

        <div className="flex flex-col items-center px-6 py-4 gap-5">
          <div className="flex items-center gap-3">
            <CoinLogo symbol={coin.symbol} logoUrl={coin.logoUrl} color={coin.color} size={36}/>
            <div>
              <p className="text-white font-bold text-[16px]">{coin.symbol}</p>
              <p className="text-[#888] text-[12px]">{coin.chain}</p>
            </div>
          </div>

          <QRCode address={coin.address} color={coin.color}/>

          <div className="w-full bg-[#1e1e1e] rounded-2xl p-4">
            <p className="text-[#888] text-[12px] mb-1">{coin.chain} Address</p>
            <p className="text-white text-[13px] font-mono break-all">{coin.address.replace("...", "abcdef1234567890abcdef12")}</p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={copyAddress}
              className="flex-1 h-12 rounded-full bg-[#1e1e1e] flex items-center justify-center gap-2"
            >
              {copied ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3dd68c" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              )}
              <span className={`text-[14px] font-medium ${copied ? "text-[#3dd68c]" : "text-white"}`}>{copied ? "Copied!" : "Copy"}</span>
            </button>
            <button className="flex-1 h-12 rounded-full bg-[#1e1e1e] flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <span className="text-white text-[14px] font-medium">Share</span>
            </button>
          </div>

          <div className="bg-[#1a2a1a] rounded-xl p-3 w-full flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3dd68c" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-[#3dd68c] text-[12px]">Only send {coin.symbol} to this address. Sending other coins may result in permanent loss.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <StatusBar/>
      <div className="flex items-center px-4 py-3">
        <button onClick={() => setLocation("/")} className="w-8 h-8 flex items-center justify-center mr-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="text-white font-bold text-[18px] flex-1 text-center pr-8">Receive</h1>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center bg-[#1e1e1e] rounded-full px-3 py-2.5 gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="bg-transparent text-white text-[14px] flex-1 outline-none placeholder-[#555]"/>
        </div>
      </div>

      <p className="text-[#888] text-[12px] font-medium px-4 mb-2">Select a coin to receive</p>

      <div className="flex-1 overflow-y-auto">
        {filtered.map(c => (
          <div
            key={c.id}
            className="flex items-center px-4 py-3.5 border-b border-[#1a1a1a] active:bg-[#1e1e1e] cursor-pointer"
            onClick={() => { setSelectedId(c.id); setShowDetail(true); }}
          >
            <CoinLogo symbol={c.symbol} logoUrl={c.logoUrl} color={c.color} size={42}/>
            <div className="flex-1 ml-3">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-[15px]">{c.symbol}</span>
                <span className="text-[#555] text-[12px]">{c.name}</span>
              </div>
              <p className="text-[#666] text-[12px] mt-0.5">{c.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#2a2a2a] rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="5" y="5" width="3" height="3" fill="#888"/><rect x="16" y="5" width="3" height="3" fill="#888"/>
                  <rect x="5" y="16" width="3" height="3" fill="#888"/>
                </svg>
              </div>
              <div className="w-9 h-9 bg-[#2a2a2a] rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
