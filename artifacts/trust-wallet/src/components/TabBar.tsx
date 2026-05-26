import { useLocation } from "wouter";

interface TabBarProps {
  active?: string;
}

export default function TabBar({ active = "home" }: TabBarProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#1a1a1a] border-t border-[#2a2a2a] z-50">
      <div className="flex items-center justify-around px-2 pb-3 pt-1">
        <button onClick={() => setLocation("/")} className="flex flex-col items-center gap-1 py-1 px-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active === "home" ? "bg-[#1a3a2a]" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" fill={active === "home" ? "#3dd68c" : "#555"} />
            </svg>
          </div>
          <span className={`text-[10px] font-medium ${active === "home" ? "text-[#3dd68c]" : "text-[#555]"}`}>Home</span>
        </button>

        <button className="flex flex-col items-center gap-1 py-1 px-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
          <span className="text-[10px] text-[#555] font-medium">Trending</span>
        </button>

        <button onClick={() => setLocation("/swap")} className="flex flex-col items-center -mt-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="17 1 21 5 17 9"/>
              <path d="M3 11V9a4 4 0 014-4h14"/>
              <polyline points="7 23 3 19 7 15"/>
              <path d="M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
          </div>
          <span className="text-[10px] text-white font-medium mt-1">Trade</span>
        </button>

        <button className="flex flex-col items-center gap-1 py-1 px-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 014 0"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
            <line x1="10" y1="14" x2="14" y2="14"/>
          </svg>
          <span className="text-[10px] text-[#555] font-medium">Rewards</span>
        </button>

        <button className="flex flex-col items-center gap-1 py-1 px-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
          <span className="text-[10px] text-[#555] font-medium">Discover</span>
        </button>
      </div>
    </div>
  );
}
