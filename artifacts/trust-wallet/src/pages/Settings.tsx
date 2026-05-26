import { useState } from "react";
import { useLocation } from "wouter";
import StatusBar from "@/components/StatusBar";
import { useWallet } from "@/context/WalletContext";

const settingGroups = [
  {
    items: [
      { label: "Address Book", icon: "📒" },
      { label: "Sync to Extension", icon: "🔗" },
      { label: "Trust handles", icon: "@" },
      { label: "Scan QR code", icon: "📷" },
      { label: "WalletConnect", icon: "🔌" },
    ]
  },
  {
    items: [
      { label: "Preferences", icon: "⚙️" },
      { label: "Security", icon: "🔒" },
      { label: "Notifications", icon: "🔔" },
      { label: "Support", icon: "💬" },
      { label: "About", icon: "ℹ️" },
    ]
  }
];

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const { walletName, setWalletName } = useWallet();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(walletName);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-[#121212]">
      <StatusBar time="15:06"/>

      <div className="flex items-center px-4 py-3">
        <button onClick={() => setLocation("/")} className="w-8 h-8 flex items-center justify-center mr-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="text-white font-bold text-[18px] flex-1 text-center pr-8">Settings</h1>
      </div>

      {/* Wallet name */}
      <div className="px-4 mb-3">
        <div className="bg-[#1e1e1e] rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-[16px]">
            {walletName[0]}
          </div>
          <div className="flex-1">
            {editingName ? (
              <input
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onBlur={() => { setWalletName(tempName); setEditingName(false); }}
                onKeyDown={e => e.key === "Enter" && (setWalletName(tempName), setEditingName(false))}
                className="bg-transparent text-white font-semibold text-[15px] outline-none border-b border-[#3dd68c] w-full"
                autoFocus
              />
            ) : (
              <p className="text-white font-semibold text-[15px]">{walletName}</p>
            )}
            <p className="text-[#888] text-[12px] mt-0.5">Main Wallet</p>
          </div>
          <button onClick={() => { setTempName(walletName); setEditingName(!editingName); }} className="text-[#3dd68c] text-[12px] font-medium">
            {editingName ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {/* Trust Premium */}
      <div className="px-4 mb-3">
        <p className="text-white font-bold text-[14px] mb-2">Trust Premium</p>
        <div className="bg-[#1e1e1e] rounded-2xl p-4 flex items-center gap-3">
          <span className="text-[28px]">🏆</span>
          <div className="flex-1">
            <p className="text-white font-bold text-[15px]">Bronze</p>
            <p className="text-[#888] text-[12px]">Unlock exclusive rewards</p>
          </div>
          <button className="text-white font-semibold text-[14px] px-5 py-2 rounded-full" style={{background:'linear-gradient(135deg,#3dd68c,#2bb573)'}}>Begin</button>
        </div>
      </div>

      {/* Dark mode */}
      <div className="flex items-center px-4 py-4 border-b border-[#1e1e1e]">
        <span className="text-[20px] mr-4">🌙</span>
        <span className="text-white text-[15px] flex-1">Dark Mode</span>
        <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? "bg-[#3dd68c]" : "bg-[#2a2a2a]"}`}>
          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${darkMode ? "right-0.5" : "left-0.5"}`}/>
        </button>
      </div>

      <div className="h-3"/>

      {settingGroups.map((group, gi) => (
        <div key={gi} className="mb-3">
          {group.items.map((item, ii) => (
            <div key={item.label}>
              <div className="flex items-center px-4 py-4 cursor-pointer active:bg-[#1e1e1e] transition-colors">
                <span className="text-[18px] mr-4 w-7 text-center">{item.icon}</span>
                <span className="text-white text-[15px] flex-1">{item.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              {ii < group.items.length - 1 && <div className="h-px bg-[#1e1e1e] mx-4"/>}
            </div>
          ))}
        </div>
      ))}

      {/* Edit balances shortcut */}
      <div className="px-4 mt-2 mb-6">
        <button
          onClick={() => setLocation("/edit-balance")}
          className="w-full h-13 py-4 rounded-2xl bg-[#1e1e1e] flex items-center px-4 gap-3"
        >
          <span className="text-[18px]">💰</span>
          <span className="text-white text-[15px] flex-1] text-left flex-1">Edit Wallet Balances</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
}
