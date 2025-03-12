"use client";

import { useState, useEffect, createContext, useContext } from "react";
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
  totalNgnBalance: number; // Add total balance in NGN
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

  // Function to update total balance in NGN
  const updateTotalNgnBalance = async (usdcBalance: string, usdtBalance: string) => {
    console.log("Updating total NGN balance...");
    const usdcPrice = await fetchTokenPrice("usd-coin"); // Fetch USDC price in NGN
    const usdtPrice = await fetchTokenPrice("tether"); // Fetch USDT price in NGN

    const usdc = parseFloat(usdcBalance) || 0;
    const usdt = parseFloat(usdtBalance) || 0;

console.log("usdc NGN balance:", usdc);
    const totalUp = usdc * usdcPrice + usdt * usdtPrice; // Calculate total balance in NGN
    const total = totalUp/10e5
    console.log("Total NGN balance:", total);
    setTotalNgnBalance(total);
  };

  // src/context/WalletContext.tsx
useEffect(() => {
  console.log("useEffect triggered");
  setIsAuthenticated(isConnected);

  if (!isConnected || !connector || !address) {
    console.log("Wallet not connected or address not available");
    setWalletIcon(null);
    setWalletName(null);
    setUsdcBalance("0");
    setUsdtBalance("0");
    setTotalNgnBalance(0);
    return;
  }

  const walletId = connector.id.toLowerCase();
  console.log("Connector ID:", walletId); // Log the connector ID
  setWalletIcon(walletIcons[walletId] || 'https://avatars.githubusercontent.com/u/1?v=4'); // Set wallet icon or fallback
  setWalletName(connector.name || null);

  // Function to fetch balances
  const fetchBalances = async () => {
    console.log("Fetching balances...");
    const usdcBalance = await fetchTokenBalance("USDC", address);
    console.log("usdcBalance:", usdcBalance);
    const usdtBalance = await fetchTokenBalance("USDT", address);
    console.log("usdtBalance:", usdtBalance);
    setUsdcBalance(usdcBalance);
    setUsdtBalance(usdtBalance);

    // Calculate total balance in NGN after both balances are fetched
    await updateTotalNgnBalance(usdcBalance, usdtBalance);
  };

  // Fetch balances immediately
  fetchBalances();

  // Set up an interval to fetch balances every 5 seconds
  const intervalId = setInterval(fetchBalances, 5000000);

  // Clean up the interval when the component unmounts or dependencies change
  return () => clearInterval(intervalId);
}, [isConnected, connector, address]); // Only re-run if these dependencies change
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
        totalNgnBalance, // Pass total balance in NGN
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