// src/context/WalletContext.tsx
"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { fetchTokenBalance } from "@/utils/fetchTokenBalance";
import { fetchTokenPrice } from "@/utils/fetchTokenprice";
import { walletIcons } from "@/utils/walletIcons";

export type Transaction = {
  id: string;
  recipient: string;
  bank: string;
  amount: number;
  status: "successful" | "pending" | "failed";
  timestamp: string;
  txHash?: `0x${string}`; // Optional hash for pending transactions
};

interface WalletContextType {
  connectedAddress: string | null;
  isConnecting: boolean;
  isAuthenticated: boolean;
  walletIcon: string | null;
  walletName: string | null;
  usdcBalance: string;
  usdtBalance: string;
  totalNgnBalance: number;
  usdcPrice: number;
  usdtPrice: number;
  fetchBalances: () => Promise<void>;
  disconnectWallet: () => void;
  refetchTransactions: () => void;
  transactionTrigger: number;
  pendingTransactions: Transaction[]; // New: Track pending transactions
  addPendingTransaction: (tx: Transaction) => void; // New: Add a pending transaction
  clearPendingTransaction: (txHash: `0x${string}`) => void; // New: Clear a pending transaction when confirmed
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletIcon, setWalletIcon] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [usdtBalance, setUsdtBalance] = useState<string>("0");
  const [totalNgnBalance, setTotalNgnBalance] = useState<number>(0);
  const [usdcPrice, setUsdcPrice] = useState<number>(0);
  const [usdtPrice, setUsdtPrice] = useState<number>(0);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<number>(0);
  const [transactionTrigger, setTransactionTrigger] = useState<number>(0);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]); // New state

  const fetchAndCacheTokenPrices = useCallback(async () => {
    const now = Date.now();
    const cacheDuration = 5 * 60 * 1000;

    if (now - lastPriceUpdate > cacheDuration) {
      try {
        const [usdcPrice, usdtPrice] = await Promise.all([
          fetchTokenPrice("usd-coin"),
          fetchTokenPrice("tether"),
        ]);

        setUsdcPrice(usdcPrice);
        setUsdtPrice(usdtPrice);
        setLastPriceUpdate(now);
      } catch (error) {
        console.error("Failed to fetch token prices:", error);
      }
    }
  }, [lastPriceUpdate]);

  const fetchBalances = useCallback(async () => {
    if (!address) return;

    try {
      const [usdcBalance, usdtBalance] = await Promise.all([
        fetchTokenBalance("USDC", address),
        fetchTokenBalance("USDT", address),
      ]);

      setUsdcBalance(usdcBalance);
      setUsdtBalance(usdtBalance);

      const usdc = parseFloat(usdcBalance) || 0;
      const usdt = parseFloat(usdtBalance) || 0;
      const totalUp = usdc * usdcPrice + usdt * usdtPrice;
      const total = totalUp / 10e5;
      setTotalNgnBalance(total);
    } catch (error) {
      console.error("Failed to fetch token balances:", error);
    }
  }, [address, usdcPrice, usdtPrice]);

  const refetchTransactions = useCallback(() => {
    setTransactionTrigger((prev) => prev + 1);
  }, []);

  const addPendingTransaction = useCallback((tx: Transaction) => {
    setPendingTransactions((prev) => [...prev, tx]);
  }, []);

  const clearPendingTransaction = useCallback((txHash: `0x${string}`) => {
    setPendingTransactions((prev) => prev.filter((tx) => tx.txHash !== txHash));
  }, []);

  useEffect(() => {
    setIsAuthenticated(isConnected);

    if (!isConnected || !connector || !address) {
      setWalletIcon(null);
      setWalletName(null);
      setUsdcBalance("0");
      setUsdtBalance("0");
      setTotalNgnBalance(0);
      setUsdcPrice(0);
      setUsdtPrice(0);
      setPendingTransactions([]); // Clear pending transactions on disconnect
      return;
    }

    const walletId = connector.id.toLowerCase();
    setWalletIcon(walletIcons[walletId] || null);
    setWalletName(connector.name || null);

    fetchBalances();
    const priceIntervalId = setInterval(fetchAndCacheTokenPrices, 5 * 60 * 1000);
    fetchAndCacheTokenPrices();

    return () => {
      clearInterval(priceIntervalId);
    };
  }, [isConnected, connector, address, fetchBalances, fetchAndCacheTokenPrices]);

  return (
    <WalletContext.Provider
      value={{
        connectedAddress: address || null,
        isConnecting: false,
        isAuthenticated,
        walletIcon,
        walletName,
        usdcBalance,
        usdtBalance,
        totalNgnBalance,
        usdcPrice,
        usdtPrice,
        fetchBalances,
        disconnectWallet: disconnect,
        refetchTransactions,
        transactionTrigger,
        pendingTransactions,
        addPendingTransaction,
        clearPendingTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};