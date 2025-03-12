// src/components/dashboard/stable-coin-list.tsx
"use client";

import { useWallet } from "@/context/WalletContext";
import { StableCoinItem } from "./stable-coin-item";
import { formatBalance } from "@/utils/formatBalance";
import { fetchTokenPrice } from "@/utils/fetchTokenprice";
import { useEffect, useState, useRef } from "react";

// Export the StableCoin type
export type StableCoin = {
  id: string;
  name: string;
  symbol: string;
  balance: string; // Balance is now a string (formatted)
  ngnBalance: string; // NGN balance
  icon: string;
};

export default function StableCoinList() {
  const { usdcBalance, usdtBalance } = useWallet();
  console.log("USDC Balance in StableCoinList:", usdcBalance);
  console.log("USDT Balance in StableCoinList:", usdtBalance);
  const [stableCoins, setStableCoins] = useState<StableCoin[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the interval ID

  // Refs to store previous prices and balances
  const previousUsdcPriceRef = useRef<number>(0);
  const previousUsdtPriceRef = useRef<number>(0);
  const previousUsdcBalanceRef = useRef<string>("0");
  const previousUsdtBalanceRef = useRef<string>("0");

  // Function to fetch and update stable coin data
  const fetchStableCoins = async () => {
    let usdcPrice = previousUsdcPriceRef.current;
    let usdtPrice = previousUsdtPriceRef.current;

    try {
      // Fetch token prices in NGN
      usdcPrice = await fetchTokenPrice("usd-coin");
      usdtPrice = await fetchTokenPrice("tether");

      // Update previous prices
      previousUsdcPriceRef.current = usdcPrice;
      previousUsdtPriceRef.current = usdtPrice;

      // console.log("Fetched new prices:", { usdcPrice, usdtPrice }); // Debug log
    } catch (error) {
      // console.error("Failed to fetch token prices. Using previous prices.", error);
      // console.log("Using previous prices:", { usdcPrice, usdtPrice }); // Debug log
    }

    // Format balances and calculate NGN balances
    const usdcBalanceFormatted = formatBalance(usdcBalance);
    const usdtBalanceFormatted = formatBalance(usdtBalance);

    const usdcNgnBalance = (parseFloat(usdcBalanceFormatted) * usdcPrice).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const usdtNgnBalance = (parseFloat(usdtBalanceFormatted) * usdtPrice).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Update previous balances
    previousUsdcBalanceRef.current = usdcBalanceFormatted;
    previousUsdtBalanceRef.current = usdtBalanceFormatted;

    // console.log("Setting stable coins with NGN balances:", { usdcNgnBalance, usdtNgnBalance }); // Debug log

    // Set stable coins with NGN balances
    setStableCoins([
      {
        id: "1",
        symbol: "USDC",
        name: "USDC $1",
        balance: usdcBalanceFormatted,
        ngnBalance: `₦${usdcNgnBalance}`, // Add NGN balance
        icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      },
      {
        id: "2",
        symbol: "USDT",
        name: "USDT $1",
        balance: usdtBalanceFormatted,
        ngnBalance: `₦${usdtNgnBalance}`, // Add NGN balance
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      },
    ]);
  };

  useEffect(() => {
    // Fetch stable coins immediately when the component mounts or when balances change
   
    fetchStableCoins();

    // Set up an interval to fetch stable coins every 5 seconds
    intervalRef.current = setInterval(fetchStableCoins, 4000000);

    // Clean up the interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [usdcBalance, usdtBalance]); // Re-run if USDC or USDT balances change

  return (
    <div className="w-full h-full rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
      <h2 className="text-2xl font-semibold text-white">Your Stable coins</h2>
      <div className="mt-6">
        {stableCoins.map((coin, index) => (
          <StableCoinItem
            key={coin.id}
            coin={coin}
            opacity={1 - index * 0.2}
            isLast={index === stableCoins.length - 1}
          />
        ))}
      </div>
    </div>
  );
}