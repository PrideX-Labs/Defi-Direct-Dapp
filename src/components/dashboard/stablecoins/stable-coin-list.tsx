// src/components/dashboard/stable-coin-list.tsx
"use client";

import { useWallet } from "@/context/WalletContext";
import { StableCoinItem } from "./stable-coin-item";
import { formatBalance } from "@/utils/formatBalance";

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
  const { usdcBalance, usdtBalance, usdcPrice, usdtPrice } = useWallet();

const usdcBalanceFormatted = formatBalance(usdcBalance) || "0";
const usdtBalanceFormatted = formatBalance(usdtBalance) || "0";

const usdcInNgn = (parseFloat(usdcBalanceFormatted) * usdcPrice).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const usdtInNgn = (parseFloat(usdtBalanceFormatted) * usdtPrice).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

  const stableCoins = [
    {
      id: "1",
      symbol: "USDC",
      name: "USDC $1",
      balance: usdcBalanceFormatted,
      ngnBalance: `₦${usdcInNgn}`, // Add NGN balance
      icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    },
    {
      id: "2",
      symbol: "USDT",
      name: "USDT $1",
      balance: usdtBalanceFormatted,
      ngnBalance: `₦${usdtInNgn}`, // Add NGN balance
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    },
  ];

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