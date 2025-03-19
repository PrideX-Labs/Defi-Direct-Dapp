"use client"; // Ensure this is a Client Component

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { useWallet } from "@/context/WalletContext";
import { retrieveTransactions } from "@/services/retrieveTransactions";
import { TransactionHeader } from "./transaction-header";
import { TransactionItem } from "./transaction-item";

export type Transaction = {
  id: string;
  recipient: string;
  bank: string;
  amount: number;
  status: "successful" | "pending" | "failed";
  timestamp: string;
};

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
const getStatus = (isCompleted: boolean, isRefunded: boolean): "successful" | "pending" | "failed" => {
  if (!isCompleted && !isRefunded) return "pending";
  if (isCompleted && isRefunded) return "failed";
  return "successful"; // Default case when isCompleted is true and isRefunded is false
};

// Map the transaction result to the frontend format
const formatTransaction = (transaction: any, index: number): Transaction => ({
  id: (index + 1).toString(), // Assuming the ID is just the index + 1
  recipient: transaction.recipientName,
  bank: transaction.fiatBank,
  amount: Number(transaction.fiatAmount), // Convert BigInt to Number
  status: getStatus(transaction.isCompleted, transaction.isRefunded),
  timestamp: formatTimestamp(transaction.transactionTimestamp),
});

export default function TransactionList() {
  const { connectedAddress } = useWallet();
  const { address } = useAccount();
  const publicClient = usePublicClient() as any;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) {
        setError("No connected wallet address found.");
        setLoading(false);
        return;
      }

      try {
        const transactionResult = await retrieveTransactions(
          publicClient,
          connectedAddress as `0x${string}`
        );

        if (transactionResult) {
          const formattedTransactions = transactionResult.map(formatTransaction);
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
  }, [connectedAddress, publicClient, address]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading transactions...</div>;
  }

  // if (error) {
  //   return <div className="text-center text-red-400">{error}</div>;
  // }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-4 sm:p-6">
      <TransactionHeader />
      <div className="mt-4 sm:mt-6 space-y-4">
        {transactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            isLast={index === transactions.length - 1}
            opacity={1 - index * 0.2}
          />
        ))}
      </div>
    </div>
  );
}