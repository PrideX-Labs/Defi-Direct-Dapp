"use client"

import { useEffect, useState } from "react"
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

  const fetchTransactions = async () => {
    if (!address) {
      setError("No connected wallet address found.")
      setLoading(false)
      return
    }

    try {
      const transactionResult = await retrieveTransactions(publicClient, connectedAddress as `0x${string}`)

      if (transactionResult) {
        const formattedTransactions = transactionResult.map(formatTransaction)
        setConfirmedTransactions(formattedTransactions)
      } else {
        setError("No transactions found.")
      }
    } catch (err) {
      setError("Failed to fetch transactions.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Add a slight delay to make the loading state visible
    const timer = setTimeout(() => {
      fetchTransactions()
    }, 1500)

    return () => clearTimeout(timer)
  }, [connectedAddress, publicClient, address, transactionTrigger])

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
