// src/app/dashboard/page.tsx
"use client";

import { message } from "antd";
import WalletBalance from "@/components/dashboard/wallet-balance";
import TransactionList from "./transactions/transaction-list";
import StableCoinList from "./stablecoins/stable-coin-list";
import { useWallet } from "@/context/WalletContext";

export default function Dashboard() {
  const { totalNgnBalance } = useWallet(); // Get total balance in NGN from context
  console.log("Total NGN Balance in Dashboard:", totalNgnBalance);
  
  const handleTransfer = () => {
    message.info("Transfer feature coming soon!");
  };

  return (
    <div className="grid gap-6 p-6 md:grid-cols-2">
      <div className="space-y-6">
        <WalletBalance balance={totalNgnBalance} /> {/* Pass total balance in NGN */}
        <TransactionList />
      </div>
      <div>
        <StableCoinList />
      </div>
    </div>
  );
}