"use client";

import { Copy, ExternalLink, X } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors = {
  successful: "text-green-500",
  pending: "text-orange-500",
  failed: "text-red-500",
};

export function TransactionDetailsModal({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsModalProps) {
  if (!transaction) return null;

  const { txHash, amount, status, recipient, bank, timestamp, transactionFee, tokenName } = transaction;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", {
      position: "top-center",
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-none bg-[#1C1C27] p-0 text-white">
        <div className="space-y-6 rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Transaction Details</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <div className="rounded-2xl bg-[#14141B] p-6 space-y-4">
            {txHash && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Transaction ID</p>
                <div className="flex items-center gap-2 bg-[#2F2F3A] p-2 rounded">
                  <p className="text-sm text-white break-all flex-1">{txHash}</p>
                  <button
                    onClick={() => copyToClipboard(txHash)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <a
                  href={`https://sepolia.scrollscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:text-purple-400 text-xs flex items-center gap-1 mt-2"
                >
                  View on block explorer <ExternalLink size={14} />
                </a>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Amount</p>
                <p className="text-sm text-white">NGN {amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className={`text-sm ${statusColors[status]}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Recipient</p>
                <p className="text-sm text-white">{recipient}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Bank</p>
                <p className="text-sm text-white">{bank}</p>
              </div>
              {transactionFee !== undefined && (
                <div>
                  <p className="text-xs text-gray-400">Transaction Fee</p>
                  <p className="text-sm text-white">
                    {transactionFee.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3})} {tokenName || "Token"}
                  </p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Date & Time</p>
                <p className="text-sm text-white">{timestamp}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}