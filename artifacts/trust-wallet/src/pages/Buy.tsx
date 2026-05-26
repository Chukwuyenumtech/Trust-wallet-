import { useState } from "react";
import { useLocation } from "wouter";
import StatusBar from "@/components/StatusBar";
import CoinLogo from "@/components/CoinLogo";
import { useWallet } from "@/context/WalletContext";

export default function BuyPage() {
  const [, setLocation] = useLocation();
  const { coins, updateBalance, addTransaction } = useWallet();
  const [amount, setAmount] = useState("41150");
  const [currency, setCurrency] = useState<"NGN"|"USD"|"EUR">("NGN");
  const [coinId, setCoinId] = useState("eth");
  const [showCoinPicker, setShowCoinPicker] = useState(false);
  const [done, setDone] = useState(false);

  const coin = coins.find(c => c.id === coinId) || coins[1];
  const rates: Record<string, number> = { NGN: 1650, USD: 1, EUR: 0.92 };
  const usdAmt = parseFloat(amount || "0") / rates[currency];
  const coinAmt = usdAmt / coin.price;

  function handleKey(key: string) {
    setAmount(prev => {
      if (key === "⌫") return prev.length <= 1 ? "0" : prev.slice(0, -1);
      if (prev === "0" && key !== ".") return key;
      if (key === "." && prev.includes(".")) return prev;
      return prev + key;
    });
  }

  function doBuy() {
    if (coinAmt <= 0) return;
    updateBalance(coin.id, parseFloat((coin.balance + coinAmt).toFixed(8)));
    addTransaction({ type:"receive", symbol: coin.symbol, amount: coinAmt, usdValue: usdAmt, address:"Bank Transfer", status:"completed" });
    setDone(true);
  }

  const keys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

  if (done) return (
    <div className="flex flex-col min-h-screen bg-[#121212] items-center justify-center px-8 gap-6">
      <div className="w-20 h-20 rounded-full bg-[#1a3a2a] flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3dd68c" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div className="text-center">
        <p className="text-white font-bold text-[22px]">Purchase Complete!</p>
        <p className="text-[#888] text-[14px] mt-2">{coinAmt.toFixed(6)} {coin.symbol} added to your wallet</p>
      </div>
      <button onClick={() => setLocation("/")} className="w-full h-14 rounded-full text-white font-semibold text-[16px]" style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}>Done</button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <StatusBar time="15:06"/>
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setLocation("/")} className="w-8 h-8 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-white font-bold text-[18px]">Buy</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <circle cx="5" cy="12" r="1" fill="#888"/><circle cx="12" cy="12" r="1" fill="#888"/><circle cx="19" cy="12" r="1" fill="#888"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-end gap-1">
            <span className="text-white font-light" style={{fontSize:'52px',lineHeight:1}}>{amount}</span>
            <div className="w-0.5 h-12 bg-[#3dd68c] mb-1 animate-pulse"/>
          </div>
          <div className="flex flex-col gap-1">
            {(["NGN","USD","EUR"] as const).map(c => (
              <button key={c} onClick={() => setCurrency(c)}
                className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${currency === c ? "bg-[#3dd68c] text-black" : "text-[#555]"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#888] text-[18px]">{coinAmt > 0 ? coinAmt.toFixed(8) : "0"}</span>
          <button onClick={() => setShowCoinPicker(!showCoinPicker)} className="flex items-center gap-1.5 bg-[#1e1e1e] rounded-full px-3 py-1.5">
            <CoinLogo symbol={coin.symbol} logoUrl={coin.logoUrl} color={coin.color} size={18}/>
            <span className="text-white font-semibold text-[14px]">{coin.symbol}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        {showCoinPicker && (
          <div className="w-full mt-2 bg-[#1e1e1e] rounded-2xl max-h-40 overflow-y-auto">
            {coins.map(c => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-[#2a2a2a] cursor-pointer active:bg-[#2a2a2a]"
                onClick={() => { setCoinId(c.id); setShowCoinPicker(false); }}>
                <CoinLogo symbol={c.symbol} logoUrl={c.logoUrl} color={c.color} size={26}/>
                <span className="text-white font-medium text-[14px]">{c.symbol}</span>
                <span className="text-[#888] text-[12px] flex-1">{c.name}</span>
                <span className="text-[#888] text-[11px]">${c.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mx-4 mb-3">
        <div className="bg-[#1e1e1e] rounded-2xl px-4 py-3 flex items-center">
          <div className="w-10 h-10 rounded-full bg-[#1565c0] flex items-center justify-center mr-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[#888] text-[11px]">Pay with</p>
            <p className="text-white font-semibold text-[15px]">Bank Transfer</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-3 px-4 mb-3">
        {keys.map(key => (
          <div key={key} className="flex items-center justify-center h-14 text-white text-[24px] font-light cursor-pointer active:bg-[#1e1e1e] rounded-xl select-none" onClick={() => handleKey(key)}>
            {key === "⌫" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/>
                <line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
              </svg>
            ) : key}
          </div>
        ))}
      </div>

      <div className="mx-4 mb-6">
        <button onClick={doBuy} className="w-full h-14 rounded-full text-white font-semibold text-[16px]" style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}>
          Continue
        </button>
      </div>
    </div>
  );
}
