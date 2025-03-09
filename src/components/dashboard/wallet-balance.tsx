// src/components/dashboard/wallet-balance.tsx
"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { TransferModal } from "./wallet/transfer-modal";

interface WalletBalanceProps {
  balance: number; // Total balance in NGN
  onTransfer: () => void; // Transfer handler
}

export default function WalletBalance({ balance, onTransfer }: WalletBalanceProps) {
  const [isOpen, setIsOpen] = useState(false);

  

  return (
    <>
      <div className="w-full rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-white">Wallet Balance</h2>
          <p className="text-4xl font-semibold text-white">
            ₦
            {balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <button
            onClick={onTransfer} // Use the onTransfer handler
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-3 text-white transition-opacity hover:opacity-90"
          >
            <ArrowUpRight className="h-5 w-5" />
            <span>Transfer</span>
          </button>
        </div>
      </div>
      <TransferModal open={isOpen} onOpenChange={setIsOpen} balance={balance} />
    </>
  );
}