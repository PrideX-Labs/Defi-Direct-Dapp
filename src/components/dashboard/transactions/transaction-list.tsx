"use client"

import { useEffect, useState, useCallback } from "react"
import { usePublicClient, useAccount } from "wagmi"
import { useWallet, type Transaction } from "@/context/WalletContext"
import { retrieveTransactions } from "@/services/retrieveTransactions"
import { TransactionHeader } from "./transaction-header"
import { TransactionItem } from "./transaction-item"
import type { PublicClient } from "viem"
import TransactionListSkeleton from "./transaction-list-skeleton"
import { usePathname } from "next/navigation"

type TransactionResult = {
  user: `0x${string}`
  token: `0x${string}`
  amount: bigint
  amountSpent: bigint
  transactionFee: bigint
  transactionTimestamp: bigint
  fiatBankAccountNumber: bigint
  fiatBank: string
  recipientName: string
  fiatAmount: bigint
  isCompleted: boolean
  isRefunded: boolean
}

const formatTimestamp = (timestamp: bigint) => {
  const date = new Date(Number(timestamp) * 1000)
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }
  return date.toLocaleString("en-US", options).replace(",", ".")
}

const getStatus = (isCompleted: boolean, isRefunded: boolean): "successful" | "pending" | "failed" => {
  if (!isCompleted && !isRefunded) return "pending"
  if (isCompleted && isRefunded) return "failed"
  return "successful"
}

const formatTransaction = (transaction: TransactionResult, index: number): Transaction => ({
  id: (index + 1).toString(),
  recipient: transaction.recipientName,
  bank: transaction.fiatBank,
  amount: Number(transaction.fiatAmount),
  status: getStatus(transaction.isCompleted, transaction.isRefunded),
  timestamp: formatTimestamp(transaction.transactionTimestamp),
})

export default function TransactionList() {
  const { connectedAddress, transactionTrigger, pendingTransactions } = useWallet()
  const { address } = useAccount()
  const publicClient = usePublicClient() as PublicClient
  const [confirmedTransactions, setConfirmedTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  // Determine if we're on the dashboard or transaction page
  const isDashboard = pathname === "/dashboard"

  // Number of transactions to show on dashboard
  const MAX_DASHBOARD_TRANSACTIONS = 3

  // Memoize fetchTransactions to prevent unnecessary re-renders
  const fetchTransactions = useCallback(async () => {
    if (!address || !publicClient) {
      setError("No connected wallet address found.")
      setLoading(false)
      return
    }

    // All supported chains in your app
    const supportedChains = [
      1, 10, 25, 56, 137, 338, 43114, 534351, 534352,
      8453, 1101, 11155111, 1135, 4202, 41923, 656476,
      42161, 1001, 10000070
    ]

    // Chains where the contract is actually deployed
    const contractDeployedChains = [534351] // Scroll Sepolia only for now

    const currentChainId = publicClient.chain?.id

    // Check if the current chain is supported by the app
    if (!currentChainId || !supportedChains.includes(currentChainId)) {
      setError("This chain is not supported by the application.")
      setConfirmedTransactions([])
      setLoading(false)
      return
    }

    // Check if the contract is deployed on the current chain
    if (!contractDeployedChains.includes(currentChainId)) {
      setError("Contract not deployed on this chain.")
      setConfirmedTransactions([])
      setLoading(false)
      return
    }

    try {
      const transactionResult = await retrieveTransactions(publicClient, connectedAddress as `0x${string}`)

      if (Array.isArray(transactionResult) && transactionResult.length > 0) {
        const formattedTransactions = transactionResult.map(formatTransaction)
        setConfirmedTransactions(formattedTransactions)
        setError(null)
      } else {
        // No transactions found on a chain with the contract
        setConfirmedTransactions([])
        setError(null)
      }
    } catch (err: unknown) { // Changed from any to unknown
      if (err instanceof Error && (err.message?.includes("contract not deployed") || err.message?.includes("code=CALL_EXCEPTION"))) {
        setError("Contract not deployed on this chain.")
      } else if (err instanceof Error && (err.message?.includes("network") || err.message?.includes("timeout"))) {
        setError("Network error while fetching transactions.")
      } else {
        setError("Failed to fetch transactions. Please try again.")
        console.error("Error fetching transactions:", err)
      }
      setConfirmedTransactions([])
    } finally {
      setLoading(false)
    }
  }, [address, publicClient, connectedAddress]) // Dependencies for fetchTransactions

  useEffect(() => {
    // Add a slight delay to make the loading state visible
    const timer = setTimeout(() => {
      fetchTransactions()
    }, 1500)

    return () => clearTimeout(timer)
  }, [fetchTransactions, transactionTrigger]) // Include fetchTransactions and transactionTrigger

  // Combine pending and confirmed transactions, filtering out duplicates
  const allTransactions = [
    ...pendingTransactions,
    ...confirmedTransactions.filter(
      (confirmed) =>
        !pendingTransactions.some((pending) => pending.txHash && confirmed.id === pending.txHash?.slice(0, 8)),
    ),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort by timestamp descending

  // Limit transactions on dashboard
  const displayedTransactions = isDashboard ? allTransactions.slice(0, MAX_DASHBOARD_TRANSACTIONS) : allTransactions

  if (loading) {
    return <TransactionListSkeleton />
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
        <TransactionHeader showViewAll={isDashboard && allTransactions.length > MAX_DASHBOARD_TRANSACTIONS} />
        <div className="text-center text-gray-400 py-8">
          <p>{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              setError(null)
              fetchTransactions()
            }}
            className="mt-4 text-purple-500 hover:text-purple-400"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (allTransactions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
        <TransactionHeader showViewAll={false} />
        <div className="text-center text-gray-400 py-8">
          <p>No transactions found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-4 sm:p-6">
      <TransactionHeader showViewAll={isDashboard && allTransactions.length > MAX_DASHBOARD_TRANSACTIONS} />
      <div className="mt-4 sm:mt-6 space-y-4">
        {displayedTransactions.map((transaction, index) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            isLast={index === displayedTransactions.length - 1}
            opacity={1 - index * 0.2}
          />
        ))}
      </div>
    </div>
  )
}