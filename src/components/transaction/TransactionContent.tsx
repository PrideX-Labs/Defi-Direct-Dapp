"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { retrieveTransactions } from "@/services/retrieveTransactions";
import TransactionContentSkeleton from "./transaction-content-skeleton";
import { Transaction } from "@/types/transaction";
import { TransactionDetailsModal } from "../dashboard/transactions/transaction-details-modal";
import { TOKEN_ADDRESSES } from "@/config";

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

// Define the valid token names
type TokenName = keyof typeof TOKEN_ADDRESSES;

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
  pendingTransactions: Transaction[]
): Transaction => {
  const { formatted, raw } = formatTimestamp(transaction.transactionTimestamp);
  // Map token address to token name
  const tokenName = (Object.entries(TOKEN_ADDRESSES) as [TokenName, `0x${string}`][]).find(
    ([, address]) => address === transaction.token
  )?.[0] || "Unknown";

  // Check for matching pending transaction
  const pendingTx = pendingTransactions.find(
    (pt) => pt.txHash && pt.txHash === transaction.txId
  );

  // Use pending transaction's transactionFee if available
  let transactionFee: number | undefined;
  if (pendingTx && pendingTx.transactionFee !== undefined) {
    transactionFee = pendingTx.transactionFee; // Use approvalFee from TransferModal
  } else {
    try {
      // Convert backend's bigint transactionFee to number
      const feeValue = Number(transaction.transactionFee) / 1e18;
      if (isNaN(feeValue) || !isFinite(feeValue)) {
        console.error(`Invalid transactionFee for txId ${transaction.txId}: ${transaction.transactionFee}`);
        transactionFee = undefined; // Don't display invalid fees
      } else {
        transactionFee = Math.abs(feeValue)/1e6; // Ensure positive, matching TransferSummary
      }
    } catch (error) {
      console.error(`Error processing transactionFee for txId ${transaction.txId}:`, error);
      transactionFee = undefined; // Don't display invalid fees
    }
  }

  return {
    id: transaction.txId,
    recipient: transaction.recipientName,
    bank: transaction.fiatBank,
    amount: transaction.fiatAmount,
    amountSpent: Number(transaction.amountSpent) / 1e18,
    transactionFee, // Use pendingTx fee or scaled backend fee
    tokenName,
    status: getStatus(transaction.isCompleted, transaction.isRefunded),
    timestamp: formatted,
    rawTimestamp: raw,
    txHash: transaction.txId as `0x${string}`,
  };
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

  const { connectedAddress, transactionTrigger, pendingTransactions } = useWallet();

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
          const formattedTransactions = transactionResult.map((tx: TransactionResult) =>
            formatTransaction(tx, pendingTransactions)
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
  }, [connectedAddress, transactionTrigger, pendingTransactions]);

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

  // Combine pending and confirmed transactions, prioritizing pending
  const allTransactions = [
    ...pendingTransactions,
    ...filteredTransactions.filter(
      (confirmed) =>
        !pendingTransactions.some(
          (pending) => pending.txHash && confirmed.txHash === pending.txHash
        )
    ),
  ].sort((a, b) => b.rawTimestamp - a.rawTimestamp);

  console.log("All transactions:", allTransactions);

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
                        const formattedTransactions = transactionResult.map((tx: TransactionResult) =>
                          formatTransaction(tx, pendingTransactions)
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

  if (allTransactions.length === 0) {
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
          {allTransactions.map((transaction) => (
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
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {transaction.transactionFee !== undefined && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    Fee: {transaction.transactionFee.toFixed(3)} {transaction.tokenName || "Token"}
                  </p>
                )}
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