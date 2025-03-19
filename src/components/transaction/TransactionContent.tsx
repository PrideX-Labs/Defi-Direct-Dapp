"use client";

import React, { useState, useEffect } from "react";
import { retrieveTransactions } from "@/services/retrieveTransactions";
import { useWallet } from "@/context/WalletContext";
import { usePublicClient } from "wagmi";

export type Transaction = {
  id: string;
  name: string;
  bank: string;
  amount: string;
  status: string;
  date: string;
};

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
  fiatAmount: bigint;
  isCompleted: boolean;
  isRefunded: boolean;
}


function TransactionContent() {
  const [selectedFilter, setSelectedFilter] = useState("All types");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const { connectedAddress } = useWallet();
  const publicClient = usePublicClient();

  const filters = ["All types", "Successful", "Pending", "Failed"];

  // Function to format the timestamp into a human-readable format
  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000); // Convert BigInt to Number and then to milliseconds
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options).replace(",", ".");
  };

  // Function to determine the status
  const getStatus = (isCompleted: boolean, isRefunded: boolean) => {
    if (!isCompleted && !isRefunded) return "pending";
    if (isCompleted && isRefunded) return "failed";
    if (isCompleted && !isRefunded) return "successful";
  };

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!connectedAddress || !publicClient) {
        setError("No connected wallet address or public client found.");
        console.log(error);
        setLoading(false);
        return;
      }

      try {
        const transactionResult = await retrieveTransactions(
          publicClient,
          connectedAddress as `0x${string}`
        );

        if (transactionResult) {
          const formattedTransactions = transactionResult.map((tx: TransactionResult, index: number) => ({
            id: (index + 1).toString(),
            name: tx.recipientName,
            bank: tx.fiatBank,
            amount: Number(tx.fiatAmount).toLocaleString(),
            status: getStatus(tx.isCompleted, tx.isRefunded) as string,
            date: formatTimestamp(tx.transactionTimestamp),
          }));
          setTransactions(formattedTransactions);
        } else {
          setError("No transactions found.");
        }
      } catch (err) {
        setError("Failed to fetch transactions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [connectedAddress, publicClient]);

  // Filter transactions based on the selected filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === "All types") return true;
    return transaction.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  if (loading) {
    return <div className="text-center text-gray-400 p-6">Loading transactions...</div>;
  }

  // if (error) {
  //   return <div className="text-center text-red-400 p-6">{error}</div>;
  // }

  return (
    <div className="h-screen text-white px-2 sm:px-4">
      <div className="bg-gradient-to-b from-[#151021] via-[#151021] to-[#2f1256] rounded-t-2xl p-3 sm:p-4 lg:p-6 h-full flex flex-col">
        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 sm:mb-8">
          {/* Filter Buttons - Desktop */}
          <div className="hidden sm:flex rounded-full bg-[#352f3c] text-white">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 ${
                  selectedFilter === filter ? "bg-purple-600 rounded-full" : ""
                } whitespace-nowrap text-sm lg:text-base`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Filter Dropdown - Mobile */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="w-full bg-[#352f3c] px-4 py-2 rounded-full flex justify-between items-center"
            >
              <span>{selectedFilter}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isFilterDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isFilterDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#352f3c] rounded-lg overflow-hidden z-10">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-[#453f4c] ${
                      selectedFilter === filter ? "bg-purple-600" : ""
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Filter */}
          <button className="flex items-center justify-center bg-[#352f3c] px-4 sm:px-6 py-2 rounded-full text-sm lg:text-base whitespace-nowrap">
            <span className="mr-2">Last 7 days</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-gray-700 overflow-y-auto flex-1">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 gap-3 sm:gap-0"
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
                  <h3 className="font-medium text-sm sm:text-base">{transaction.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{transaction.bank}</p>
                </div>
              </div>
              <div className="text-right ml-14 sm:ml-0">
                <p
                  className={`text-base sm:text-lg font-medium ${
                    transaction.status === "successful"
                      ? "text-green-500"
                      : transaction.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  NGN{transaction.amount}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)} | {transaction.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransactionContent;