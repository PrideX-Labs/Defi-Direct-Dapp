// src/context/WalletContext.tsx
"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { fetchTokenBalance } from "@/utils/fetchTokenBalance";
import { fetchTokenPrice } from "@/utils/fetchTokenprice";
import { walletIcons } from "@/utils/walletIcons";

interface WalletContextType {
  connectedAddress: string | null;
  isConnecting: boolean;
  isAuthenticated: boolean;
  walletIcon: string | null;
  walletName: string | null;
  usdcBalance: string;
  usdtBalance: string;
  totalNgnBalance: number; // Total balance in NGN
  usdcPrice: number; // USDC price in NGN
  usdtPrice: number; // USDT price in NGN
  disconnectWallet: () => void;
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
  const [totalNgnBalance, setTotalNgnBalance] = useState<number>(0); // Total balance in NGN
  const [usdcPrice, setUsdcPrice] = useState<number>(0); // USDC price in NGN
  const [usdtPrice, setUsdtPrice] = useState<number>(0); // USDT price in NGN
  const [lastPriceUpdate, setLastPriceUpdate] = useState<number>(0); // Timestamp of last price update

  // Function to fetch and cache token prices
  const fetchAndCacheTokenPrices = useCallback(async () => {
    const now = Date.now();
    const cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

    // Only fetch new prices if the cache is stale
    if (now - lastPriceUpdate > cacheDuration) {
      try {
        const [usdcPrice, usdtPrice] = await Promise.all([
          fetchTokenPrice("usd-coin"),
          fetchTokenPrice("tether"),
        ]);

        setUsdcPrice(usdcPrice);
        setUsdtPrice(usdtPrice);
        setLastPriceUpdate(now); // Update the last fetch timestamp
      } catch (error) {
        console.error("Failed to fetch token prices:", error);
      }
    }
  }, [lastPriceUpdate]);

  // Function to fetch token balances
  const fetchBalances = useCallback(async () => {
    if (!address) return;

    try {
      const [usdcBalance, usdtBalance] = await Promise.all([
        fetchTokenBalance("USDC", address),
        fetchTokenBalance("USDT", address),
      ]);

      setUsdcBalance(usdcBalance);
      setUsdtBalance(usdtBalance);

      // Update total NGN balance
      const usdc = parseFloat(usdcBalance) || 0;
      const usdt = parseFloat(usdtBalance) || 0;
      const totalUp = usdc * usdcPrice + usdt * usdtPrice; // Calculate total balance in NGN
      const total = totalUp / 10e5;
      setTotalNgnBalance(total);
    } catch (error) {
      console.error("Failed to fetch token balances:", error);
    }
  }, [address, usdcPrice, usdtPrice]);

  // Update wallet connection state and fetch data
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
      return;
    }

    const walletId = connector.id.toLowerCase();
    setWalletIcon(walletIcons[walletId] || null);
    setWalletName(connector.name || null);

    // Fetch balances immediately
    fetchBalances();

    // Fetch and cache token prices periodically
    const priceIntervalId = setInterval(fetchAndCacheTokenPrices, 5 * 60 * 1000); // Fetch every 5 minutes
    fetchAndCacheTokenPrices(); // Fetch immediately on mount

    // Clean up intervals
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
        disconnectWallet: disconnect,
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