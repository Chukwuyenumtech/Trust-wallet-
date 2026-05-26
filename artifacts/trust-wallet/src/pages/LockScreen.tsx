import { useState, useEffect } from "react";

interface LockScreenProps {
  onUnlock: () => void;
}

const CORRECT_PIN = "200700";

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (pin.length === 6) {
      if (pin === CORRECT_PIN) {
        setTimeout(() => onUnlock(), 200);
      } else {
        setShake(true);
        setAttempts(a => a + 1);
        setTimeout(() => {
          setPin("");
          setShake(false);
        }, 600);
      }
    }
  }, [pin, onUnlock]);

  function handleKey(key: string) {
    if (key === "del") {
      setPin(p => p.slice(0, -1));
    } else if (pin.length < 6) {
      setPin(p => p + key);
    }
  }

  const keys = [
    ["1","2","3"],
    ["4","5","6"],
    ["7","8","9"],
    ["","0","del"],
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] items-center">
      {/* Logo area */}
      <div className="flex flex-col items-center mt-16 mb-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="white"/>
          </svg>
        </div>
        <p className="text-white font-bold text-[22px]">Trust Wallet</p>
        <p className="text-[#888] text-[14px] mt-1">Enter your passcode</p>
      </div>

      {/* PIN dots */}
      <div
        className="flex items-center gap-5 mb-10"
        style={{
          animation: shake ? "shake 0.5s ease-in-out" : "none",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full transition-all duration-150"
            style={{
              background: i < pin.length
                ? (shake ? "#ef4444" : "#3dd68c")
                : "#2a2a2a",
              transform: i < pin.length ? "scale(1.1)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {attempts > 0 && pin.length === 0 && (
        <p className="text-[#ef4444] text-[13px] mb-4 -mt-5">
          Incorrect passcode{attempts > 2 ? ` (${attempts} attempts)` : ""}
        </p>
      )}

      {/* Numpad */}
      <div className="w-full max-w-[320px] px-4">
        {keys.map((row, ri) => (
          <div key={ri} className="flex justify-between mb-4">
            {row.map((key, ki) => (
              <div key={ki} className="w-[88px] h-[88px] flex items-center justify-center">
                {key === "" ? (
                  <div />
                ) : key === "del" ? (
                  <button
                    onClick={() => handleKey("del")}
                    className="w-full h-full rounded-full flex items-center justify-center active:bg-[#2a2a2a] transition-colors"
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z"/>
                      <line x1="18" y1="9" x2="12" y2="15"/>
                      <line x1="12" y1="9" x2="18" y2="15"/>
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => handleKey(key)}
                    className="w-full h-full rounded-full bg-[#1e1e1e] flex flex-col items-center justify-center active:bg-[#2a2a2a] transition-colors select-none"
                  >
                    <span className="text-white font-light text-[30px] leading-none">{key}</span>
                    <span className="text-[#555] text-[9px] font-medium tracking-widest mt-0.5">
                      {{"2":"ABC","3":"DEF","4":"GHI","5":"JKL","6":"MNO","7":"PQRS","8":"TUV","9":"WXYZ"}[key] || ""}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="text-[#3dd68c] text-[14px] font-medium mt-4">
        Use Face ID instead
      </button>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
