export default function StatusBar({ time = "15:05" }: { time?: string }) {
  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-1">
      <span className="text-white font-semibold text-[13px]">{time}</span>
      <div className="flex items-center gap-1.5">
        <svg width="16" height="11" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="white"/>
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="white"/>
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill="white"/>
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white"/>
        </svg>
        <span className="text-white font-bold text-[10px]">4G</span>
        <svg width="16" height="11" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="white"/>
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="white"/>
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill="white"/>
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white"/>
        </svg>
        <div className="flex items-center ml-0.5">
          <div className="w-[22px] h-[11px] border border-[#f59e0b] rounded-[2px] flex items-center px-[1.5px]">
            <div className="h-[7px] bg-[#f59e0b] rounded-[1px]" style={{width:'65%'}}/>
          </div>
          <div className="w-[2px] h-[5px] bg-[#f59e0b] rounded-r-sm"/>
        </div>
      </div>
    </div>
  );
}
