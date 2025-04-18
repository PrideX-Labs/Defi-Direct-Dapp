This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




//////////////////////////
no need for the year since i the unix just for simplicity




// src/components/transaction-list.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@/context/WalletContext";
import { Transaction } from "@/types/transaction";
import { retrieveTransactions } from "@/services/retrieveTransactions";
import { TransactionHeader } from "./transaction-header";
import { TransactionItem } from "./transaction-item";
import { TransactionDetailsModal } from "./transaction-details-modal";
import TransactionListSkeleton from "./transaction-list-skeleton";
import { usePathname } from "next/navigation";

type TransactionResult = {
  user: `0x${string}`;
  token: `0x${string}`;
  amount: bigint;
  amountSpent: bigint;
  transactionFee: bigint;
  transactionTimestamp: bigint;
  fiatBankAccountNumber: bigint;
  fiatBank: string;
  recipientName: string;
  fiatAmount: number;
  isCompleted: boolean;
  isRefunded: boolean;
  txId: string;
};

const formatTimestamp = (timestamp: bigint) => {
  const date = new Date(Number(timestamp) * 1000);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return {
    formatted: date.toLocaleString("en-US", options).replace(",", "."),
    raw: Number(timestamp) * 1000, // Store raw timestamp in milliseconds
  };
};

const getStatus = (
  isCompleted: boolean,
  isRefunded: boolean
): "successful" | "pending" | "failed" => {
  if (!isCompleted && !isRefunded) return "pending";
  if (isCompleted && isRefunded) return "failed";
  return "successful";
};

const formatTransaction = (
  transaction: TransactionResult,
  index: number
): Transaction => {
  const { formatted, raw } = formatTimestamp(transaction.transactionTimestamp);
  return {
    id: transaction.txId,
    recipient: transaction.recipientName,
    bank: transaction.fiatBank,
    amount: transaction.fiatAmount,
    amountSpent: Number(transaction.amountSpent) / 1e18,
    status: getStatus(transaction.isCompleted, transaction.isRefunded),
    timestamp: formatted,
    rawTimestamp: raw,
    txHash: transaction.txId as `0x${string}`,
  };
};

export default function TransactionList() {
  const { connectedAddress, transactionTrigger, pendingTransactions } = useWallet();
  const [confirmedTransactions, setConfirmedTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const MAX_DASHBOARD_TRANSACTIONS = 3;
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!connectedAddress) {
      setError("No connected wallet address found.");
      setLoading(false);
      return;
    }

    try {
      const transactionResult = await retrieveTransactions(
        connectedAddress as `0x${string}`
      );

      console.log("Transaction result:", transactionResult);

      if (Array.isArray(transactionResult) && transactionResult.length > 0) {
        const formattedTransactions = transactionResult.map(formatTransaction);
        setConfirmedTransactions(formattedTransactions);
        setError(null);
      } else {
        setConfirmedTransactions([]);
        setError(null);
      }
    } catch (err: unknown) {
      setError("Failed to fetch transactions. Please try again.");
      console.error("Error fetching transactions:", err);
      setConfirmedTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [connectedAddress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 1500);

    return () => clearTimeout(timer);
  }, [fetchTransactions, transactionTrigger]);

  const allTransactions = [
    ...pendingTransactions,
    ...confirmedTransactions.filter(
      (confirmed) =>
        !pendingTransactions.some(
          (pending) =>
            pending.txHash && confirmed.txHash === pending.txHash
        )
    ),
  ].sort(
    (a, b) => b.rawTimestamp - a.rawTimestamp // Use rawTimestamp for sorting
  );

  const displayedTransactions = isDashboard
    ? allTransactions.slice(0, MAX_DASHBOARD_TRANSACTIONS)
    : allTransactions;

  console.log("Displayed transactions:", displayedTransactions);

  if (loading) {
    return <TransactionListSkeleton />;
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
        <TransactionHeader
          showViewAll={
            isDashboard && allTransactions.length > MAX_DASHBOARD_TRANSACTIONS
          }
        />
        <div className="text-center text-gray-400 py-8">
          <p>{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchTransactions();
            }}
            className="mt-4 text-purple-500 hover:text-purple-400"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (allTransactions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
        <TransactionHeader showViewAll={false} />
        <div className="text-center text-gray-400 py-8">
          <p>No transactions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-4 sm:p-6">
      <TransactionHeader
        showViewAll={
          isDashboard && allTransactions.length > MAX_DASHBOARD_TRANSACTIONS
        }
      />
      <div className="mt-4 sm:mt-6 space-y-4">
        {displayedTransactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.txHash || transaction.id}
            transaction={{
              ...transaction,
              amount: transaction.amount || 0,
              amountSpent: transaction.amountSpent || 0,
            }}
            isLast={index === displayedTransactions.length - 1}
            opacity={1 - index * 0.2}
            onClick={() => {
              setSelectedTransaction(transaction);
              setModalOpen(true);
            }}
          />
        ))}
      </div>
      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

the fee too should here too

// src/components/transaction-content.tsx
"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { retrieveTransactions } from "@/services/retrieveTransactions";
import TransactionContentSkeleton from "./transaction-content-skeleton";
import { Transaction } from "@/types/transaction";
import { TransactionDetailsModal } from "../dashboard/transactions/transaction-details-modal";


type TransactionResult = {
  user: `0x${string}`;
  token: `0x${string}`;
  amount: bigint;
  amountSpent: bigint;
  transactionFee: bigint;
  transactionTimestamp: bigint;
  fiatBankAccountNumber: bigint;
  fiatBank: string;
  recipientName: string;
  fiatAmount: number;
  isCompleted: boolean;
  isRefunded: boolean;
  txId: string;
};

const formatTimestamp = (timestamp: bigint) => {
  const date = new Date(Number(timestamp) * 1000);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return {
    formatted: date.toLocaleString("en-US", options).replace(",", "."),
    raw: Number(timestamp) * 1000, // Store raw timestamp in milliseconds
  };
};

const getStatus = (
  isCompleted: boolean,
  isRefunded: boolean
): "successful" | "pending" | "failed" => {
  if (!isCompleted && !isRefunded) return "pending";
  if (isCompleted && isRefunded) return "failed";
  return "successful";
};

export default function TransactionContent() {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All types");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState("Last 7 days");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { connectedAddress, transactionTrigger } = useWallet();

  const statusFilters = ["All types", "Successful", "Pending", "Failed"];
  const dateFilters = ["Last 7 days", "Last 30 days", "Last 90 days", "All time"];

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!connectedAddress) {
        setError("No connected wallet address found.");
        setLoading(false);
        return;
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const transactionResult = await retrieveTransactions(
          connectedAddress as `0x${string}`
        );

        console.log("Transaction result:", transactionResult);

        if (Array.isArray(transactionResult) && transactionResult.length > 0) {
          const formattedTransactions = transactionResult.map(
            (tx: TransactionResult) => {
              const { formatted, raw } = formatTimestamp(tx.transactionTimestamp);
              const formattedTx = {
                id: tx.txId,
                recipient: tx.recipientName,
                bank: tx.fiatBank,
                amount: tx.fiatAmount,
                status: getStatus(tx.isCompleted, tx.isRefunded),
                timestamp: formatted,
                rawTimestamp: raw,
                txHash: tx.txId as `0x${string}`,
              };
              console.log("Formatted transaction:", formattedTx);
              return formattedTx;
            }
          );
          setTransactions(formattedTransactions);
          setError(null);
        } else {
          setTransactions([]);
          setError(null);
        }
      } catch (err: unknown) {
        setError("Failed to fetch transactions. Please try again.");
        console.error("Error fetching transactions:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [connectedAddress, transactionTrigger]);

  // Filter transactions by status and date
  const filteredTransactions = transactions.filter((transaction) => {
    const statusMatch =
      selectedStatusFilter === "All types" ||
      transaction.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    const now = Date.now();
    let dateMatch = true;
    if (selectedDateFilter !== "All time") {
      const days =
        selectedDateFilter === "Last 7 days"
          ? 7
          : selectedDateFilter === "Last 30 days"
            ? 30
            : 90;
      const cutoff = now - days * 24 * 60 * 60 * 1000;
      dateMatch = transaction.rawTimestamp >= cutoff;
    }
    console.log(
      `Filtering transaction ${transaction.id}: statusMatch=${statusMatch}, dateMatch=${dateMatch}, rawTimestamp=${transaction.rawTimestamp}`
    );
    return statusMatch && dateMatch;
  });

  console.log("Filtered transactions:", filteredTransactions);

  // Render status filter UI
  const renderStatusFilterUI = () => (
    <>
      <div className="hidden sm:flex rounded-full bg-[#352f3c] text-white">
        {statusFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedStatusFilter(filter)}
            className={`px-4 py-2 ${
              selectedStatusFilter === filter ? "bg-purple-600 rounded-full" : ""
            } whitespace-nowrap text-sm lg:text-base`}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="relative sm:hidden">
        <button
          onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          className="w-full bg-[#352f3c] px-4 py-2 rounded-full flex justify-between items-center"
        >
          <span>{selectedStatusFilter}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isStatusDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#352f3c] rounded-lg overflow-hidden z-10">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedStatusFilter(filter);
                  setIsStatusDropdownOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-[#453f4c] ${
                  selectedStatusFilter === filter ? "bg-purple-600" : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // Render date filter UI
  const renderDateFilterUI = () => (
    <div className="relative">
      <button
        onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
        className="w-full bg-[#352f3c] px-4 py-2 rounded-full flex justify-between items-center text-sm lg:text-base"
      >
        <span>{selectedDateFilter}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isDateDropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isDateDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 bg-[#352f3c] rounded-lg overflow-hidden z-10 w-full sm:w-40">
          {dateFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setSelectedDateFilter(filter);
                setIsDateDropdownOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-[#453f4c] ${
                selectedDateFilter === filter ? "bg-purple-600" : ""
              } text-sm lg:text-base`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <TransactionContentSkeleton />;
  }

  if (error) {
    return (
      <div className="h-screen text-white px-2 sm:px-4">
        <div className="bg-gradient-to-b from-[#151021] via-[#151021] to-[#2f1256] rounded-t-2xl p-3 sm:p-4 lg:p-6 h-full flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 sm:mb-8">
            {renderStatusFilterUI()}
            {renderDateFilterUI()}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  const fetchTransactions = async () => {
                    if (!connectedAddress) {
                      setError("No connected wallet address found.");
                      setLoading(false);
                      return;
                    }

                    try {
                      const transactionResult = await retrieveTransactions(
                        connectedAddress as `0x${string}`
                      );
                      if (Array.isArray(transactionResult) && transactionResult.length > 0) {
                        const formattedTransactions = transactionResult.map(
                          (tx: TransactionResult) => {
                            const { formatted, raw } = formatTimestamp(tx.transactionTimestamp);
                            return {
                              id: tx.txId,
                              recipient: tx.recipientName,
                              bank: tx.fiatBank,
                              amount: tx.fiatAmount,
                              status: getStatus(tx.isCompleted, tx.isRefunded),
                              timestamp: formatted,
                              rawTimestamp: raw,
                              txHash: tx.txId as `0x${string}`,
                            };
                          }
                        );
                        setTransactions(formattedTransactions);
                        setError(null);
                      } else {
                        setTransactions([]);
                        setError(null);
                      }
                    } catch (err: unknown) {
                      setError("Failed to fetch transactions. Please try again.");
                      console.error("Error fetching transactions:", err);
                      setTransactions([]);
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchTransactions();
                }}
                className="px-4 py-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="h-screen text-white px-2 sm:px-4">
        <div className="bg-gradient-to-b from-[#151021] via-[#151021] to-[#2f1256] rounded-t-2xl p-3 sm:p-4 lg:p-6 h-full flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 sm:mb-8">
            {renderStatusFilterUI()}
            {renderDateFilterUI()}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">
              {selectedStatusFilter === "All types" && selectedDateFilter === "All time"
                ? "No transactions found"
                : `No ${selectedStatusFilter === "All types" ? "" : selectedStatusFilter.toLowerCase()} transactions found for ${selectedDateFilter.toLowerCase()}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen text-white px-2 sm:px-4">
      <div className="bg-gradient-to-b from-[#151021] via-[#151021] to-[#2f1256] rounded-t-2xl p-3 sm:p-4 lg:p-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 sm:mb-8">
          {renderStatusFilterUI()}
          {renderDateFilterUI()}
        </div>
        <div
          className="divide-y divide-gray-700 overflow-y-auto flex-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3 sm:gap-0 cursor-pointer hover:bg-[#2F2F3A]/50 rounded-lg"
              onClick={() => {
                setSelectedTransaction(transaction);
                setModalOpen(true);
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2c1053] rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-sm sm:text-base">{transaction.recipient}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{transaction.bank}</p>
                </div>
              </div>
              <div className="text-right ml-14 sm:ml-0">
                <p
                  className={`text-base sm:text-lg font-medium ${
                    transaction.status === "successful"
                      ? "text-green-500"
                      : transaction.status === "pending"
                        ? "text-orange-500"
                        : "text-red-500"
                  }`}
                >
                  NGN{transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)} | {transaction.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
        <TransactionDetailsModal
          transaction={selectedTransaction}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    </div>
  );
}

even here too

and below is the modal



"use client";

import type React from "react";
import { ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  initiateTransaction,
  approveTransaction,
  parseTransactionReceipt,
} from "@/services/initiateTransaction";
import { usePublicClient, useWalletClient } from "wagmi";
import { convertFiatToToken } from "@/utils/convertFiatToToken";
import { TOKEN_ADDRESSES } from "@/config";
import { useWallet } from "@/context/WalletContext";
import { Transaction } from "@/types/transaction";
import { TransferSummary } from "./transfer-summary";
import { completeTransaction } from "@/services/completeTransaction";

const tokens = [
  {
    name: "USDC",
    logo: "https://altcoinsbox.com/wp-content/uploads/2023/01/usd-coin-usdc-logo-600x600.webp",
    address: TOKEN_ADDRESSES["USDC"],
  },
  {
    name: "USDT",
    logo: "https://altcoinsbox.com/wp-content/uploads/2023/01/tether-logo-600x600.webp",
    address: TOKEN_ADDRESSES["USDT"],
  },
];

interface Bank {
  id: number;
  name: string;
  code: string;
}

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferModal({ open, onOpenChange }: TransferModalProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    bankCode: "",
    accountNumber: "",
    accountName: "",
    amount: "",
  });
  const [verifying, setVerifying] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [approvalFee, setApprovalFee] = useState<number>(0);

  const {
    usdcBalance,
    usdtBalance,
    usdcPrice,
    usdtPrice,
    fetchBalances,
    refetchTransactions,
    addPendingTransaction,
    clearPendingTransaction,
  } = useWallet();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const usdcBalanceFormatted = usdcBalance;
  const usdtBalanceFormatted = usdtBalance;

  const usdcNgnBalance = ((parseFloat(usdcBalanceFormatted) * usdcPrice) / 10e5).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  const usdtNgnBalance = ((parseFloat(usdtBalanceFormatted) * usdtPrice) / 10e5).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  const selectedTokenBalance =
    selectedToken.name === "USDC" ? usdcNgnBalance : usdtNgnBalance;

  const resetForm = () => {
    setFormData({
      bankCode: "",
      accountNumber: "",
      accountName: "",
      amount: "",
    });
    setShowSummary(false);
    setLoading(false);
    setVerifying(false);
    setTxHash(null);
    setApprovalFee(0);
  };

  const getBankName = (code: string) => {
    const bank = banks.find((bank) => bank.code === code);
    return bank ? bank.name : "";
  };

  useEffect(() => {
    let isMounted = true;

    const fetchBanks = async () => {
      try {
        const response = await fetch("/api/banks");
        const result = await response.json();

        if (result.success && isMounted) {
          const uniqueBanks = result.data.reduce((acc: Bank[], current: Bank) => {
            const x = acc.find((item) => item.code === current.code);
            if (!x) {
              return acc.concat([current]);
            } else {
              console.warn(`Duplicate bank code found: ${current.code} - ${current.name}`);
              return acc;
            }
          }, []);
          setBanks(uniqueBanks);
        }
      } catch (error) {
        console.error("Failed to fetch banks:", error);
      }
    };

    if (open) {
      fetchBanks();
    }

    return () => {
      isMounted = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "accountNumber" && value.length === 10 && formData.bankCode) {
      verifyAccount(formData.bankCode, value);
    } else if (name === "bankCode" && formData.accountNumber.length === 10) {
      verifyAccount(value, formData.accountNumber);
    }
  };

  const verifyAccount = async (bankCode: string, accountNumber: string) => {
    if (accountNumber.length !== 10) return;

    setVerifying(true);
    setFormData((prev) => ({ ...prev, accountName: "" }));

    try {
      const response = await fetch("/api/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankCode, accountNumber }),
      });
      const result = await response.json();

      if (result.success) {
        setFormData((prev) => ({ ...prev, accountName: result.data.account_name }));
      } else {
        toast.error("Could not verify account details");
      }
    } catch (error) {
      console.error("Account verification error:", error);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.bankCode ||
      !formData.accountNumber ||
      !formData.accountName ||
      !formData.amount
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amountValue = parseFloat(formData.amount);
    if (
      isNaN(amountValue) ||
      amountValue <= 0 ||
      amountValue > parseFloat(selectedTokenBalance.replace(/,/g, ""))
    ) {
      toast.error("Please enter a valid amount within your available balance");
      return;
    }

    setLoading(true);

    // Calculate approval fee during submit
    const price = selectedToken.name === "USDC" ? usdcPrice : usdtPrice;
    const tokenAmount = await convertFiatToToken(
      amountValue,
      selectedToken.name,
      price
    );
    const fee = (tokenAmount * 100) / 10000; // 1% fee
    setApprovalFee(fee);

    setTimeout(() => {
      if (open) {
        setShowSummary(true);
        setLoading(false);
      }
    }, 2000);
  };

  const handleConfirmTransfer = async () => {
    setLoading(true);
    const price = selectedToken.name === "USDC" ? usdcPrice : usdtPrice;
    const amountValue = parseFloat(formData.amount);
    const tokenAmount = await convertFiatToToken(
      amountValue,
      selectedToken.name,
      price
    );

    try {
      if (!walletClient || !publicClient) {
        throw new Error("Wallet or public client is not available");
      }

      await approveTransaction(
        tokenAmount,
        selectedToken.address,
        publicClient,
        walletClient
      );

      const txHash = await initiateTransaction(
        tokenAmount,
        selectedToken.address,
        formData.accountNumber,
        amountValue,
        formData.accountName,
        getBankName(formData.bankCode),
        publicClient,
        walletClient
      );
      setTxHash(txHash);

      // Add pending transaction
      const pendingTx: Transaction = {
        id: txHash.slice(0, 8),
        recipient: formData.accountName,
        bank: getBankName(formData.bankCode),
        amount: amountValue,
        status: "pending",
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).replace(",", ""),
        rawTimestamp: Date.now(),
        txHash,
      };
      addPendingTransaction(pendingTx);

      // Store initial transaction in backend
      const transactionData = {
        txId: txHash,
        userAddress: walletClient.account.address,
        token: selectedToken.address,
        amountSpent: "0.00",
        transactionFee: approvalFee.toFixed(2), // Use approval fee
        transactionTimestamp: Math.floor(Date.now() / 1000),
        fiatBankAccountNumber: formData.accountNumber,
        fiatBank: getBankName(formData.bankCode),
        recipientName: formData.accountName,
        fiatAmount: amountValue.toFixed(2),
        isCompleted: false,
        isRefunded: false,
      };

      console.log("Sending initial transaction data:", transactionData);

      const initialResponse = await fetch(
        "https://backend-cf8a.onrender.com/transaction/transactions/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        }
      );

      if (!initialResponse.ok) {
        const errorText = await initialResponse.text();
        throw new Error(
          `Backend POST failed: ${initialResponse.status} - ${errorText}`
        );
      }

      const initialResponseData = await initialResponse.json();
      console.log("Initial backend response:", initialResponseData);
      const backendId = initialResponseData.id;

      await fetchBalances();

      onOpenChange(false);
      const truncateAddress = (address: string): string => {
        return `${address.slice(0, 10)}...${address.slice(-4)}`;
      };
      toast.info(
        `Transaction sent: ${truncateAddress(txHash)}. Waiting for confirmation...`,
        {
          autoClose: 5000,
        }
      );

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      if (receipt.status === "success") {
        const parsedReceipt = await parseTransactionReceipt(receipt);
        if (parsedReceipt) {
          const response = await fetch("/api/initiate-transfer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bankCode: formData.bankCode,
              accountNumber: formData.accountNumber,
              accountName: formData.accountName,
              amount: amountValue,
            }),
          });
          const result = await response.json();

          if (result.success) {
            await completeTransaction(parsedReceipt.txId, parsedReceipt.amount);

            // Update transaction in backend
            const updateData = {
              txId: txHash,
              userAddress: walletClient.account.address,
              token: selectedToken.address,
              amountSpent: parsedReceipt.amount.toString(),
              transactionFee: approvalFee.toFixed(2), // Use approval fee
              transactionTimestamp: transactionData.transactionTimestamp,
              fiatBankAccountNumber: formData.accountNumber,
              fiatBank: getBankName(formData.bankCode),
              recipientName: formData.accountName,
              fiatAmount: amountValue.toFixed(2),
              isCompleted: true,
              isRefunded: false,
            };

            console.log("Sending update transaction data:", updateData);

            const updateResponse = await fetch(
              `https://backend-cf8a.onrender.com/transaction/transactions/${backendId}/`,
              {
                method: "PUT",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
              }
            );

            if (!updateResponse.ok) {
              const errorText = await updateResponse.text();
              throw new Error(
                `Backend PUT failed: ${updateResponse.status} - ${errorText}`
              );
            }

            const updateResponseData = await updateResponse.json();
            console.log("Update backend response:", updateResponseData);

            await fetchBalances();
            refetchTransactions();
            clearPendingTransaction(txHash);
            toast.success(
              `Your transfer of ₦${formData.amount.toString()} is complete!`
            );
          } else {
            throw new Error("Could not complete your transfer request");
          }
        } else {
          throw new Error("Failed to parse transaction receipt");
        }
      } else {
        throw new Error(`Transaction failed. Check hash: ${txHash}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Transfer error:", error);
      toast.error(`Error: ${errorMessage}`);
      if (txHash) {
        clearPendingTransaction(txHash);
      }
    } finally {
      setLoading(false);
    }
  };

  if (showSummary) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl border-none bg-transparent p-0">
          <TransferSummary
            verifying={verifying}
            loading={loading}
            amount={parseFloat(formData.amount)}
            recipient={formData.accountName}
            accountNumber={formData.accountNumber}
            bankName={formData.bankCode}
            txHash={txHash}
            approvalFee={approvalFee}
            tokenName={selectedToken.name}
            onBack={() => {
              setShowSummary(false);
              setLoading(false);
            }}
            onConfirm={handleConfirmTransfer}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md border-none bg-[#1C1C27] p-0 text-white">
          <div className="space-y-6 rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold">Transfer</h2>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full bg-[#2F2F3A] px-4 py-2 text-sm"
                >
                  <img
                    src={selectedToken.logo}
                    alt={`${selectedToken.name} logo`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  {selectedToken.name}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {dropdownOpen && (
                  <div className="absolute z-10 left-0 mt-2 w-32 rounded-lg bg-[#2F2F3A] shadow-lg">
                    {tokens.map((token) => (
                      <button
                        key={token.name}
                        onClick={() => {
                          setSelectedToken(token);
                          setDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-[#3B3B4F]"
                      >
                        <img
                          src={token.logo}
                          alt={token.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        {token.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-2xl bg-[#14141B] p-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <div className="relative">
                    <select
                      name="bankCode"
                      value={formData.bankCode}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl bg-[#2F2F3A] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="" disabled>
                        Select Bank
                      </option>
                      {banks.map((bank) => (
                        <option key={`${bank.id}-${bank.code}`} value={bank.code}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter Account number"
                    className="w-full rounded-xl bg-[#2F2F3A] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                {verifying && (
                  <div className="text-sm text-gray-400">Verifying account...</div>
                )}
                {formData.accountName && (
                  <div className="rounded-xl bg-[#2F2F3A]/50 px-4 py-3">
                    <p className="text-sm text-gray-400">Account Name</p>
                    <p className="font-medium">{formData.accountName}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                    className="w-full rounded-xl bg-[#2F2F3A] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={100}
                    max={parseFloat(selectedTokenBalance.replace(/,/g, ""))}
                    required
                  />
                  <p className="text-sm text-gray-400">
                    Available balance: ₦{selectedTokenBalance}
                  </p>
                </div>
                <button
                  type="submit"
                  className={`mt-6 flex w-full items-center bg-purple-600/50 justify-center gap-2 rounded-xl px-4 py-3 text-white transition-opacity`}
                >
                  {loading ? "Loading..." : "Transfer"}
                </button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}



