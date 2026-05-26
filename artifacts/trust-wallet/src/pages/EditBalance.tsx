import { useState } from "react";
import { useLocation } from "wouter";
import StatusBar from "@/components/StatusBar";
import CoinLogo from "@/components/CoinLogo";
import { useWallet } from "@/context/WalletContext";

export default function EditBalancePage() {
  const [, setLocation] = useLocation();
  const { coins, updateAllBalances } = useWallet();
  const [balances, setBalances] = useState<Record<string, string>>(
    Object.fromEntries(coins.map(c => [c.id, c.balance > 0 ? String(c.balance) : ""]))
  );
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const parsed: Record<string, number> = {};
    for (const [id, val] of Object.entries(balances)) {
      const n = parseFloat(val);
      parsed[id] = isNaN(n) ? 0 : Math.max(0, n);
    }
    updateAllBalances(parsed);
    setSaved(true);
    setTimeout(() => setLocation("/"), 800);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <StatusBar/>
      <div className="flex items-center px-4 py-3">
        <button onClick={() => setLocation("/")} className="w-8 h-8 flex items-center justify-center mr-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-white font-bold text-[18px] flex-1">Edit Balances</h1>
        <button onClick={handleSave} className="text-[#3dd68c] font-semibold text-[15px]">
          {saved ? "✓ Saved" : "Save"}
        </button>
      </div>

      <div className="px-4 py-2 mb-2">
        <div className="bg-[#1a2a1a] rounded-xl p-3 flex items-start gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3dd68c" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-[#3dd68c] text-[12px]">Enter custom balances for each coin. These are for display purposes only.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {coins.map(coin => (
          <div key={coin.id} className="flex items-center px-4 py-3.5 border-b border-[#1a1a1a]">
            <CoinLogo symbol={coin.symbol} logoUrl={coin.logoUrl} color={coin.color} size={40}/>
            <div className="flex-1 ml-3">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-[15px]">{coin.symbol}</span>
                <span className="text-[#555] text-[12px]">{coin.name}</span>
              </div>
              <p className="text-[#888] text-[12px] mt-0.5">${coin.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <input
                type="number"
                inputMode="decimal"
                value={balances[coin.id]}
                onChange={e => setBalances(prev => ({...prev, [coin.id]: e.target.value}))}
                placeholder="0"
                className="w-28 text-right text-white bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-3 py-2 text-[14px] outline-none focus:border-[#3dd68c] transition-colors"
              />
              {balances[coin.id] && parseFloat(balances[coin.id]) > 0 && (
                <p className="text-[#888] text-[11px]">${(parseFloat(balances[coin.id]) * coin.price).toLocaleString("en-US",{maximumFractionDigits:2})}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-6 pt-2 bg-[#121212] border-t border-[#1e1e1e]">
        <button
          onClick={handleSave}
          className="w-full h-14 rounded-full text-white font-semibold text-[16px] transition-all"
          style={{background: saved ? '#1a3a2a' : 'linear-gradient(135deg,#3dd68c,#2bb573)'}}
        >
          {saved ? "✓ Balances Updated!" : "Save All Balances"}
        </button>
      </div>
    </div>
  );
}
