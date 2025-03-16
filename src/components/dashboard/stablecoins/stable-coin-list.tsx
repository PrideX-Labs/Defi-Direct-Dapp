// src/components/dashboard/stable-coin-list.tsx
"use client";

import { useWallet } from "@/context/WalletContext";
import { StableCoinItem } from "./stable-coin-item";
import { formatBalance } from "@/utils/formatBalance";
import { useEffect, useState, useCallback } from "react";

export type StableCoin = {
  id: string;
  name: string;
  symbol: string;
  balance: string; // Balance is now a string (formatted)
  ngnBalance: string; // NGN balance
  icon: string;
};

export default function StableCoinList() {
  const { usdcBalance, usdtBalance, usdcPrice, usdtPrice } = useWallet();
  const [stableCoins, setStableCoins] = useState<StableCoin[]>([]);

  // Function to update stable coin data
  const updateStableCoins = useCallback(() => {
    const usdcBalanceFormatted = usdcBalance;
    const usdtBalanceFormatted = usdtBalance;

    const usdcNgnBalance = ((parseFloat(usdcBalanceFormatted) * usdcPrice) / 10e5).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const usdtNgnBalance = ((parseFloat(usdtBalanceFormatted) * usdtPrice) / 10e5).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Set stable coins with updated balances
    setStableCoins([
      {
        id: "1",
        symbol: "USDC",
        name: "USDC $1",
        balance: formatBalance(usdcBalanceFormatted),
        ngnBalance: `₦${usdcNgnBalance}`,
        icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      },
      {
        id: "2",
        symbol: "USDT",
        name: "USDT $1",
        balance: formatBalance(usdtBalanceFormatted),
        ngnBalance: `₦${usdtNgnBalance}`,
        icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      },
    ]);
  }, [usdcBalance, usdtBalance, usdcPrice, usdtPrice]);

  // Update stable coins when balances or prices change
  useEffect(() => {
    updateStableCoins();
  }, [updateStableCoins]);

  return (
    <div className="w-full h-full rounded-3xl p-6">
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