import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  price: number;
  change: number;
  balance: number;
  address: string;
  logoUrl: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: "send" | "receive";
  symbol: string;
  amount: number;
  usdValue: number;
  address: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface WalletContextType {
  coins: Coin[];
  transactions: Transaction[];
  updateBalance: (id: string, balance: number) => void;
  updateAllBalances: (balances: Record<string, number>) => void;
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => void;
  walletName: string;
  setWalletName: (name: string) => void;
  totalValue: number;
}

function logoUrl(symbol: string): string {
  const sym = symbol.toLowerCase();
  return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/${sym}.svg`;
}

const DEFAULT_COINS: Coin[] = [
  { id: "btc", symbol: "BTC", name: "Bitcoin", chain: "Bitcoin", price: 77177.49, change: -0.10, balance: 0, address: "bc1qh4v...u29jp5", logoUrl: logoUrl("btc"), color: "#f7931a" },
  { id: "eth", symbol: "ETH", name: "Ethereum", chain: "Ethereum", price: 2122.00, change: 0.39, balance: 0, address: "0xafD44...e845fa", logoUrl: logoUrl("eth"), color: "#627eea" },
  { id: "avax", symbol: "AVAX", name: "Avalanche", chain: "Avalanche C-Chain", price: 9.41, change: 0.17, balance: 0, address: "0xafD44...e845fa", logoUrl: logoUrl("avax"), color: "#e84142" },
  { id: "bnb", symbol: "BNB", name: "BNB", chain: "BNB Smart Chain", price: 662.00, change: -1.22, balance: 0, address: "0xafD44...e845fa", logoUrl: logoUrl("bnb"), color: "#f0b90b" },
  { id: "ada", symbol: "ADA", name: "Cardano", chain: "Cardano", price: 0.24, change: -0.06, balance: 0, address: "addr1q...y9p5", logoUrl: logoUrl("ada"), color: "#0033ad" },
  { id: "sol", symbol: "SOL", name: "Solana", chain: "Solana", price: 145.20, change: 1.15, balance: 0, address: "CqjFH4k...QnAepJ", logoUrl: logoUrl("sol"), color: "#9945ff" },
  { id: "doge", symbol: "DOGE", name: "Dogecoin", chain: "Dogecoin", price: 0.10, change: -0.14, balance: 0, address: "D7kba2...p3Nz", logoUrl: logoUrl("doge"), color: "#c2a633" },
  { id: "usdt", symbol: "USDT", name: "Tether", chain: "Ethereum", price: 1.00, change: 0.01, balance: 0, address: "0xafD44...e845fa", logoUrl: logoUrl("usdt"), color: "#26a17b" },
  { id: "usdc", symbol: "USDC", name: "USD Coin", chain: "Ethereum", price: 1.00, change: 0.00, balance: 0, address: "0xafD44...e845fa", logoUrl: logoUrl("usdc"), color: "#2775ca" },
  { id: "xrp", symbol: "XRP", name: "XRP", chain: "Ripple", price: 0.52, change: -0.35, balance: 0, address: "r4gDJZ...nKs2", logoUrl: logoUrl("xrp"), color: "#00aae4" },
  { id: "ltc", symbol: "LTC", name: "Litecoin", chain: "Litecoin", price: 88.52, change: 0.22, balance: 0, address: "ltc1q...x9p2", logoUrl: logoUrl("ltc"), color: "#345d9d" },
  { id: "dot", symbol: "DOT", name: "Polkadot", chain: "Polkadot", price: 6.42, change: 0.88, balance: 0, address: "1FRMM8...Pj6n", logoUrl: logoUrl("dot"), color: "#e6007a" },
  { id: "matic", symbol: "MATIC", name: "Polygon", chain: "Polygon", price: 0.48, change: -0.73, balance: 0, address: "0xafD44...e845fa", logoUrl: logoUrl("matic"), color: "#8247e5" },
  { id: "link", symbol: "LINK", name: "Chainlink", chain: "Ethereum", price: 13.25, change: 1.20, balance: 0, address: "0xafD44...e845fa", logoUrl: logoUrl("link"), color: "#375bd2" },
  { id: "shib", symbol: "SHIB", name: "Shiba Inu", chain: "Ethereum", price: 0.000012, change: -2.10, balance: 0, address: "0xafD44...e845fa", logoUrl: logoUrl("shib"), color: "#e5500d" },
];

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState<Coin[]>(DEFAULT_COINS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletName, setWalletName] = useState("Main Wallet 1");

  const totalValue = coins.reduce((sum, c) => sum + c.balance * c.price, 0);

  const updateBalance = useCallback((id: string, balance: number) => {
    setCoins(prev => prev.map(c => c.id === id ? { ...c, balance } : c));
  }, []);

  const updateAllBalances = useCallback((balances: Record<string, number>) => {
    setCoins(prev => prev.map(c => balances[c.id] !== undefined ? { ...c, balance: balances[c.id] } : c));
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, "id" | "date">) => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);
  }, []);

  return (
    <WalletContext.Provider value={{ coins, transactions, updateBalance, updateAllBalances, addTransaction, walletName, setWalletName, totalValue }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
