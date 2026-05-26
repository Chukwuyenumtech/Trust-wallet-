import { useState } from "react";
import { useLocation } from "wouter";
import StatusBar from "@/components/StatusBar";
import CoinLogo from "@/components/CoinLogo";
import { useWallet } from "@/context/WalletContext";

export default function SwapPage() {
  const [, setLocation] = useLocation();
  const { coins, updateBalance, addTransaction } = useWallet();
  const [fromId, setFromId] = useState("avax");
  const [toId, setToId] = useState("eth");
  const [amount, setAmount] = useState("0");
  const [sliderPct, setSliderPct] = useState(0);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [done, setDone] = useState(false);

  const fromCoin = coins.find(c => c.id === fromId) || coins[0];
  const toCoin = coins.find(c => c.id === toId) || coins[1];
  const numAmt = parseFloat(amount) || 0;
  const receiveAmt = numAmt > 0 ? ((numAmt * fromCoin.price) / toCoin.price).toFixed(6) : "0";
  const usdVal = numAmt * fromCoin.price;

  const keys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

  function handleKey(key: string) {
    setAmount(prev => {
      if (key === "⌫") return prev.length <= 1 ? "0" : prev.slice(0, -1);
      if (prev === "0" && key !== ".") return key;
      if (key === "." && prev.includes(".")) return prev;
      return prev + key;
    });
  }

  function doSwap() {
    if (numAmt <= 0 || numAmt > fromCoin.balance) return;
    updateBalance(fromCoin.id, parseFloat((fromCoin.balance - numAmt).toFixed(8)));
    updateBalance(toCoin.id, parseFloat((toCoin.balance + parseFloat(receiveAmt)).toFixed(8)));
    addTransaction({ type:"send", symbol: fromCoin.symbol, amount: numAmt, usdValue: usdVal, address:"Swap", status:"completed" });
    setDone(true);
  }

  function flip() {
    setFromId(toId);
    setToId(fromId);
    setAmount("0");
  }

  if (done) return (
    <div className="flex flex-col min-h-screen bg-[#121212] items-center justify-center px-8 gap-6">
      <div className="w-20 h-20 rounded-full bg-[#1a3a2a] flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3dd68c" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-white font-bold text-[22px]">Swap Complete!</p>
        <p className="text-[#888] text-[14px] mt-2">{amount} {fromCoin.symbol} → {receiveAmt} {toCoin.symbol}</p>
      </div>
      <button onClick={() => setLocation("/")} className="w-full h-14 rounded-full text-white font-semibold text-[16px]" style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}>Done</button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <StatusBar/>
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setLocation("/")} className="w-8 h-8 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-white font-bold text-[18px]">Swap</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
        </button>
      </div>

      {/* From */}
      <div className="mx-4 bg-[#1e1e1e] rounded-2xl p-4 mb-1 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-[32px] font-light">{amount}</span>
          <button onClick={() => setShowFromPicker(!showFromPicker)} className="flex items-center gap-2 bg-[#2a2a2a] rounded-full px-3 py-2">
            <CoinLogo symbol={fromCoin.symbol} logoUrl={fromCoin.logoUrl} color={fromCoin.color} size={22}/>
            <span className="text-white font-semibold text-[14px]">{fromCoin.symbol}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[#888] text-[13px]">${usdVal.toFixed(2)}</span>
          </div>
          <span className="text-[#888] text-[12px]">Bal: {fromCoin.balance} {fromCoin.symbol}</span>
        </div>
        {showFromPicker && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-[#2a2a2a] rounded-2xl z-20 max-h-48 overflow-y-auto shadow-xl">
            {coins.filter(c => c.id !== toId).map(c => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#333] cursor-pointer active:bg-[#333]"
                onClick={() => { setFromId(c.id); setShowFromPicker(false); setAmount("0"); }}>
                <CoinLogo symbol={c.symbol} logoUrl={c.logoUrl} color={c.color} size={28}/>
                <span className="text-white font-medium text-[14px]">{c.symbol}</span>
                <span className="text-[#888] text-[12px] flex-1">{c.name}</span>
                <span className="text-[#888] text-[11px]">{c.balance}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flip button */}
      <div className="flex justify-center -my-3 z-10 relative">
        <button onClick={flip} className="w-9 h-9 bg-[#2a2a2a] rounded-full border-4 border-[#121212] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
            <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
          </svg>
        </button>
      </div>

      {/* To */}
      <div className="mx-4 bg-[#1e1e1e] rounded-2xl p-4 mt-1 mb-4 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#888] text-[32px] font-light">{receiveAmt}</span>
          <button onClick={() => setShowToPicker(!showToPicker)} className="flex items-center gap-2 bg-[#2a2a2a] rounded-full px-3 py-2">
            <CoinLogo symbol={toCoin.symbol} logoUrl={toCoin.logoUrl} color={toCoin.color} size={22}/>
            <span className="text-white font-semibold text-[14px]">{toCoin.symbol}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
        <span className="text-[#888] text-[13px]">${(parseFloat(receiveAmt) * toCoin.price).toFixed(2)}</span>
        {showToPicker && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-[#2a2a2a] rounded-2xl z-20 max-h-48 overflow-y-auto shadow-xl">
            {coins.filter(c => c.id !== fromId).map(c => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#333] cursor-pointer active:bg-[#333]"
                onClick={() => { setToId(c.id); setShowToPicker(false); }}>
                <CoinLogo symbol={c.symbol} logoUrl={c.logoUrl} color={c.color} size={28}/>
                <span className="text-white font-medium text-[14px]">{c.symbol}</span>
                <span className="text-[#888] text-[12px] flex-1">{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1"/>

      {/* Slider */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#888] text-[12px]">Min</span>
          <span className="text-[#888] text-[12px]">Max</span>
        </div>
        <input
          type="range" min={0} max={100} value={sliderPct}
          onChange={e => {
            const pct = Number(e.target.value);
            setSliderPct(pct);
            setAmount(pct === 0 ? "0" : (fromCoin.balance * pct / 100).toFixed(6));
          }}
          className="w-full accent-[#3dd68c]"
        />
        <div className="flex justify-between mt-1">
          {[25,50,75].map(p => (
            <button key={p} onClick={() => { setSliderPct(p); setAmount((fromCoin.balance * p / 100).toFixed(6)); }}
              className="text-[#555] text-[11px]">{p}%</button>
          ))}
        </div>
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-3 px-4 mb-4">
        {keys.map(key => (
          <div key={key} className="flex items-center justify-center h-14 text-white text-[22px] font-light cursor-pointer active:bg-[#1e1e1e] rounded-xl select-none" onClick={() => handleKey(key)}>
            {key === "⌫" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/>
                <line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
              </svg>
            ) : key}
          </div>
        ))}
      </div>

      <div className="mx-4 mb-6">
        <div className="relative h-14 rounded-full overflow-hidden cursor-pointer" style={{background:'#1a3a2a'}} onClick={doSwap}>
          <div className="absolute left-1 top-1 bottom-1 w-12 h-12 rounded-full flex items-center justify-center z-10" style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#3dd68c] font-semibold text-[16px] ml-8">
              {numAmt > fromCoin.balance ? "Insufficient Balance" : "Slide to Swap"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
