import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { WalletProvider } from "@/context/WalletContext";
import LockScreen from "@/pages/LockScreen";
import HomePage from "@/pages/Home";
import ReceivePage from "@/pages/Receive";
import SendPage from "@/pages/Send";
import SwapPage from "@/pages/Swap";
import BuyPage from "@/pages/Buy";
import CoinDetailPage from "@/pages/CoinDetail";
import SettingsPage from "@/pages/Settings";
import EditBalancePage from "@/pages/EditBalance";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/receive" component={ReceivePage} />
      <Route path="/receive/:id" component={ReceivePage} />
      <Route path="/send" component={SendPage} />
      <Route path="/send/:id" component={SendPage} />
      <Route path="/swap" component={SwapPage} />
      <Route path="/buy" component={BuyPage} />
      <Route path="/coin/:id" component={CoinDetailPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/edit-balance" component={EditBalancePage} />
    </Switch>
  );
}

function App() {
  const [locked, setLocked] = useState(true);

  return (
    <WalletProvider>
      <div className="flex items-start justify-center min-h-screen bg-[#0a0a0a]">
        <div className="w-full max-w-[430px] min-h-screen bg-[#121212] relative overflow-x-hidden">
          {locked ? (
            <LockScreen onUnlock={() => setLocked(false)} />
          ) : (
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
          )}
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;
