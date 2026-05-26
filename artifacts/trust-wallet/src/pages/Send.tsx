import { useState } from "react";
import { useLocation, useParams } from "wouter";
import StatusBar from "@/components/StatusBar";
import CoinLogo from "@/components/CoinLogo";
import { useWallet } from "@/context/WalletContext";

export default function SendPage() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id?: string }>();
  const { coins, updateBalance, addTransaction } = useWallet();

  const [selectedId, setSelectedId] = useState(params.id || "btc");
  const [step, setStep] = useState<"select" | "amount" | "address" | "confirm" | "success">(
    params.id ? "amount" : "select"
  );
  const [amount, setAmount] = useState("0");
  const [toAddress, setToAddress] = useState("");
  const [showCoinPicker, setShowCoinPicker] = useState(false);

  const coin = coins.find(c => c.id === selectedId) || coins[0];
  const numAmount = parseFloat(amount) || 0;
  const usdValue = numAmount * coin.price;
  const hasBalance = coin.balance >= numAmount && numAmount > 0;

  function handleKey(key: string) {
    setAmount(prev => {
      if (key === "⌫") return prev.length <= 1 ? "0" : prev.slice(0, -1);
      if (prev === "0" && key !== ".") return key;
      if (key === "." && prev.includes(".")) return prev;
      return prev + key;
    });
  }

  function handleSend() {
    if (!hasBalance) return;
    updateBalance(coin.id, parseFloat((coin.balance - numAmount).toFixed(8)));
    addTransaction({
      type: "send",
      symbol: coin.symbol,
      amount: numAmount,
      usdValue,
      address: toAddress || "0x742d...3cE2",
      status: "completed",
    });
    setStep("success");
  }

  const keys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

  if (step === "success") {
    return (
      <div className="flex flex-col min-h-screen bg-[#121212] items-center justify-center px-8 gap-6">
        <div className="w-20 h-20 rounded-full bg-[#1a3a2a] flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3dd68c" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-[22px]">Transaction Sent!</p>
          <p className="text-[#888] text-[14px] mt-2">{numAmount} {coin.symbol} sent successfully</p>
          <p className="text-[#555] text-[12px] mt-1">≈ ${usdValue.toFixed(2)} USD</p>
        </div>
        <button
          onClick={() => setLocation("/")}
          className="w-full h-14 rounded-full text-white font-semibold text-[16px] mt-4"
          style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <StatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => step === "amount" && !params.id ? setStep("select") : step === "address" ? setStep("amount") : step === "confirm" ? setStep("address") : setLocation("/")} className="w-8 h-8 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="text-white font-bold text-[18px]">Send</h1>
        <div className="w-8"/>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 px-4 mb-4">
        {["select","amount","address","confirm"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === s ? "bg-[#3dd68c] text-black" :
              ["select","amount","address","confirm"].indexOf(step) > i ? "bg-[#1a3a2a] text-[#3dd68c]" :
              "bg-[#2a2a2a] text-[#555]"
            }`}>{i+1}</div>
            {i < 3 && <div className={`w-8 h-0.5 ${["select","amount","address","confirm"].indexOf(step) > i ? "bg-[#3dd68c]" : "bg-[#2a2a2a]"}`}/>}
          </div>
        ))}
      </div>

      {/* STEP: SELECT COIN */}
      {step === "select" && (
        <div className="flex-1 overflow-y-auto">
          <p className="text-[#888] text-[13px] px-4 mb-3">Select a coin to send</p>
          {coins.map(c => (
            <div
              key={c.id}
              className="flex items-center px-4 py-3.5 border-b border-[#1a1a1a] active:bg-[#1e1e1e] cursor-pointer"
              onClick={() => { setSelectedId(c.id); setStep("amount"); }}
            >
              <CoinLogo symbol={c.symbol} logoUrl={c.logoUrl} color={c.color} size={42}/>
              <div className="flex-1 ml-3">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-[15px]">{c.symbol}</span>
                  <span className="text-[#555] text-[12px]">{c.name}</span>
                </div>
                <p className="text-[#888] text-[12px] mt-0.5">Balance: {c.balance} {c.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-[#888] text-[13px]">${(c.balance * c.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP: AMOUNT */}
      {step === "amount" && (
        <>
          {/* Coin selector */}
          <div className="mx-4 mb-4">
            <button
              onClick={() => setShowCoinPicker(!showCoinPicker)}
              className="w-full flex items-center gap-3 bg-[#1e1e1e] rounded-2xl px-4 py-3"
            >
              <CoinLogo symbol={coin.symbol} logoUrl={coin.logoUrl} color={coin.color} size={36}/>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold text-[15px]">{coin.symbol} · {coin.name}</p>
                <p className="text-[#888] text-[12px]">Balance: {coin.balance} {coin.symbol}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showCoinPicker && (
              <div className="mt-1 bg-[#1e1e1e] rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                {coins.map(c => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2a2a] active:bg-[#2a2a2a] cursor-pointer"
                    onClick={() => { setSelectedId(c.id); setShowCoinPicker(false); setAmount("0"); }}
                  >
                    <CoinLogo symbol={c.symbol} logoUrl={c.logoUrl} color={c.color} size={30}/>
                    <span className="text-white font-medium text-[14px]">{c.symbol}</span>
                    <span className="text-[#555] text-[12px] flex-1">{c.name}</span>
                    <span className="text-[#888] text-[12px]">{c.balance}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amount display */}
          <div className="flex flex-col items-center py-4 px-4">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-white font-light" style={{fontSize:'48px', lineHeight:1}}>{amount}</span>
              <span className="text-[#555] font-light" style={{fontSize:'24px'}}>{coin.symbol}</span>
            </div>
            <p className="text-[#888] text-[14px]">≈ ${usdValue.toFixed(2)} USD</p>
            {numAmount > 0 && numAmount > coin.balance && (
              <p className="text-[#ef4444] text-[12px] mt-1">Insufficient balance</p>
            )}
            <button
              onClick={() => setAmount(String(coin.balance))}
              className="mt-2 text-[#3dd68c] text-[12px] font-medium"
            >
              MAX: {coin.balance} {coin.symbol}
            </button>
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 px-4 mb-4">
            {keys.map(key => (
              <div key={key} className="flex items-center justify-center h-16 text-white text-[24px] font-light cursor-pointer active:bg-[#1e1e1e] rounded-xl select-none" onClick={() => handleKey(key)}>
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
            <button
              onClick={() => numAmount > 0 && numAmount <= coin.balance && setStep("address")}
              className={`w-full h-14 rounded-full text-white font-semibold text-[16px] transition-opacity ${hasBalance ? "opacity-100" : "opacity-40"}`}
              style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}
              disabled={!hasBalance}
            >
              Continue
            </button>
          </div>
        </>
      )}

      {/* STEP: ADDRESS */}
      {step === "address" && (
        <div className="flex-1 px-4">
          <p className="text-[#888] text-[13px] mb-3">Enter recipient address</p>
          <div className="bg-[#1e1e1e] rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CoinLogo symbol={coin.symbol} logoUrl={coin.logoUrl} color={coin.color} size={24}/>
              <span className="text-white font-semibold text-[14px]">{coin.name} ({coin.symbol})</span>
            </div>
            <textarea
              value={toAddress}
              onChange={e => setToAddress(e.target.value)}
              placeholder={`Enter ${coin.symbol} address or ENS`}
              className="w-full bg-transparent text-white text-[14px] outline-none resize-none placeholder-[#444] mt-1 min-h-[60px]"
              rows={3}
            />
          </div>

          <div className="bg-[#1e1e1e] rounded-2xl p-4 mb-4">
            <p className="text-[#888] text-[12px] mb-1">Amount</p>
            <p className="text-white font-semibold text-[18px]">{amount} {coin.symbol}</p>
            <p className="text-[#888] text-[13px]">≈ ${usdValue.toFixed(2)} USD</p>
          </div>

          {/* Quick addresses */}
          <p className="text-[#888] text-[12px] mb-2">Recent addresses</p>
          {["0x742d35Cc6634C0532925a3b8D4C3cE2b3bc3cE2","bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq"].slice(0,1).map(addr => (
            <button key={addr} onClick={() => setToAddress(addr)} className="w-full text-left bg-[#1e1e1e] rounded-xl p-3 mb-2">
              <p className="text-white text-[13px] font-medium truncate">{addr}</p>
              <p className="text-[#555] text-[11px] mt-0.5">Tap to fill</p>
            </button>
          ))}

          <button
            onClick={() => toAddress.length > 5 && setStep("confirm")}
            className={`w-full h-14 rounded-full text-white font-semibold text-[16px] mt-4 transition-opacity ${toAddress.length > 5 ? "opacity-100" : "opacity-40"}`}
            style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}
          >
            Review
          </button>
        </div>
      )}

      {/* STEP: CONFIRM */}
      {step === "confirm" && (
        <div className="flex-1 px-4">
          <div className="flex flex-col items-center py-6 mb-4">
            <CoinLogo symbol={coin.symbol} logoUrl={coin.logoUrl} color={coin.color} size={56}/>
            <p className="text-white font-bold text-[28px] mt-4">{amount} {coin.symbol}</p>
            <p className="text-[#888] text-[15px] mt-1">≈ ${usdValue.toFixed(2)} USD</p>
          </div>

          <div className="bg-[#1e1e1e] rounded-2xl p-4 mb-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#888] text-[13px]">From</span>
              <span className="text-white text-[13px] font-medium">{coin.address}</span>
            </div>
            <div className="h-px bg-[#2a2a2a]"/>
            <div className="flex items-start justify-between gap-3">
              <span className="text-[#888] text-[13px] flex-shrink-0">To</span>
              <span className="text-white text-[13px] font-medium text-right break-all">{toAddress}</span>
            </div>
            <div className="h-px bg-[#2a2a2a]"/>
            <div className="flex items-center justify-between">
              <span className="text-[#888] text-[13px]">Network Fee</span>
              <span className="text-white text-[13px] font-medium">~$0.50</span>
            </div>
            <div className="h-px bg-[#2a2a2a]"/>
            <div className="flex items-center justify-between">
              <span className="text-[#888] text-[13px]">Total</span>
              <span className="text-white text-[13px] font-bold">${(usdValue + 0.50).toFixed(2)} USD</span>
            </div>
          </div>

          <div className="bg-[#2a1a1a] rounded-xl p-3 mb-4 flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-[#ef4444] text-[12px]">Transactions cannot be reversed. Double check the address.</p>
          </div>

          <button onClick={handleSend} className="w-full h-14 rounded-full text-black font-bold text-[16px]" style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}>
            Confirm & Send
          </button>
        </div>
      )}
    </div>
  );
}
