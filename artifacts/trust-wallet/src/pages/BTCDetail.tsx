import { useState } from "react";
import { useLocation } from "wouter";
import StatusBar from "@/components/StatusBar";

const chartPoints = [
  [0, 80], [30, 65], [60, 70], [90, 60], [120, 68], [150, 62], [180, 55],
  [210, 63], [240, 58], [270, 65], [300, 60], [330, 70], [360, 52], [390, 48],
  [420, 55], [450, 45], [480, 60], [510, 50], [540, 42], [570, 55], [600, 48],
  [630, 40], [660, 52], [690, 45], [720, 38], [750, 48], [780, 35], [810, 45],
  [840, 40], [870, 50], [900, 42], [930, 35], [960, 30], [990, 42], [1020, 38],
  [1050, 32], [1080, 45], [1110, 38], [1140, 50], [1170, 42],
];

function buildSVGPath(points: number[][]): string {
  const w = 1200;
  const h = 180;
  const minY = Math.min(...points.map(p => p[1]));
  const maxY = Math.max(...points.map(p => p[1]));
  const scaleY = (y: number) => h - ((y - minY) / (maxY - minY)) * (h - 20) - 10;
  const scaleX = (x: number) => (x / 1170) * w;

  const d = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${scaleX(p[0]).toFixed(1)} ${scaleY(p[1]).toFixed(1)}`
  ).join(' ');
  return d;
}

const timeframes = ["1H", "1D", "1W", "1M", "1Y", "ALL"];

export default function BTCDetailPage() {
  const [, setLocation] = useLocation();
  const [activeTime, setActiveTime] = useState("1D");

  const pathData = buildSVGPath(chartPoints);

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] pb-24">
      <StatusBar time="15:06" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setLocation("/")} className="w-8 h-8 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="w-8 h-8"/>
        <button>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" fill="#3dd68c" stroke="#3dd68c" strokeWidth="1"/>
          </svg>
        </button>
      </div>

      {/* Coin info */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#f7931a"/>
            <text x="20" y="27" textAnchor="middle" fontSize="22" fontWeight="bold" fill="white">₿</text>
          </svg>
          <div>
            <p className="text-white font-bold text-[16px]">BTC</p>
            <p className="text-[#888] text-[13px]">Bitcoin</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-bold text-[20px]">$77,116.83</p>
          <p className="text-[#ef4444] text-[13px]">-$220.25 (0.3%)</p>
        </div>
      </div>

      {/* Chart */}
      <div className="px-0 mb-2 mt-2">
        <svg width="100%" viewBox="0 0 1200 180" preserveAspectRatio="none" style={{height: '180px'}}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path
            d={pathData + ` L 1200 180 L 0 180 Z`}
            fill="url(#chartGrad)"
          />
          <path
            d={pathData}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Timeframes */}
      <div className="flex items-center justify-between px-6 mb-6">
        {timeframes.map(tf => (
          <button
            key={tf}
            onClick={() => setActiveTime(tf)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium ${activeTime === tf ? "bg-[#2a2a2a] text-white" : "text-[#666]"}`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-b border-[#1e1e1e]">
        <div>
          <p className="text-white font-semibold text-[15px]">Your balance</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold text-[15px]">$0.00</p>
          <p className="text-[#888] text-[12px]">0.00 BTC</p>
        </div>
      </div>

      {/* Send / Receive buttons */}
      <div className="flex items-center gap-3 px-4 py-4">
        <button className="flex-1 h-11 bg-[#1e1e1e] rounded-full flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
          <span className="text-white font-medium text-[15px]">Send</span>
        </button>
        <button className="flex-1 h-11 bg-[#1e1e1e] rounded-full flex items-center justify-center gap-2" onClick={() => setLocation("/receive")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="5" y="5" width="3" height="3" fill="white"/>
            <rect x="16" y="5" width="3" height="3" fill="white"/>
            <rect x="5" y="16" width="3" height="3" fill="white"/>
          </svg>
          <span className="text-white font-medium text-[15px]">Receive</span>
        </button>
      </div>

      {/* Activity */}
      <div className="px-4 py-3">
        <p className="text-white font-bold text-[16px]">Activity <span className="text-[#888]">›</span></p>
        <p className="text-[#888] text-[13px] mt-3">
          Missing a transaction? <span className="text-[#3dd68c]">View on explorer</span>
        </p>
      </div>

      {/* Stats */}
      <div className="px-4 py-4 border-t border-[#1e1e1e]">
        <p className="text-white font-bold text-[16px] mb-3">Stats</p>
        <div className="flex gap-8">
          <div>
            <p className="text-[#888] text-[12px]">Market Cap</p>
            <p className="text-white text-[14px] font-medium mt-0.5">$1.55T</p>
          </div>
          <div>
            <p className="text-[#888] text-[12px]">24h Volume</p>
            <p className="text-white text-[14px] font-medium mt-0.5">$24.96B</p>
          </div>
        </div>
      </div>

      {/* Bottom Swap button */}
      <div className="fixed bottom-0 left-50 w-full max-w-[390px] left-1/2 -translate-x-1/2 px-4 pb-6 pt-2 bg-[#121212]">
        <div className="flex items-center gap-2">
          <button className="flex-1 h-14 rounded-full green-btn text-white font-semibold text-[16px]" onClick={() => setLocation("/swap")}>
            Swap
          </button>
          <button className="w-14 h-14 rounded-full bg-[#1e1e1e] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="5" cy="12" r="1" fill="white"/><circle cx="12" cy="12" r="1" fill="white"/><circle cx="19" cy="12" r="1" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
