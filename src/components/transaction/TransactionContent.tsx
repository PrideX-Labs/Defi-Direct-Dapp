"use client"

import { useState, useEffect } from "react"
import { retrieveTransactions } from "@/services/retrieveTransactions"
import { useWallet } from "@/context/WalletContext"
import { usePublicClient } from "wagmi"
import TransactionContentSkeleton from "./transaction-content-skeleton"

export type Transaction = {
  id: string
  name: string
  bank: string
  amount: string
  status: string
  date: string
  timestamp: number // For date filtering
}

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

function TransactionContent() {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All types")
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [selectedDateFilter, setSelectedDateFilter] = useState("Last 7 days")
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { connectedAddress } = useWallet()
  const publicClient = usePublicClient()

  const statusFilters = ["All types", "Successful", "Pending", "Failed"]
  const dateFilters = ["Last 7 days", "Last 30 days", "Last 90 days", "All time"]

  // Function to format the timestamp into a human-readable format and return timestamp
  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000)
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
    return {
      formatted: date.toLocaleString("en-US", options).replace(",", "."),
      timestamp: date.getTime(), // For filtering
    }
  }

  // Function to determine the status
  const getStatus = (isCompleted: boolean, isRefunded: boolean) => {
    if (!isCompleted && !isRefunded) return "pending"
    if (isCompleted && isRefunded) return "failed"
    if (isCompleted && !isRefunded) return "successful"
  }

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!connectedAddress || !publicClient) {
        setError("No connected wallet address or public client found.")
        setLoading(false)
        return
      }

      const supportedChains = [
        1, 10, 25, 56, 137, 338, 43114, 534351, 534352,
        8453, 1101, 11155111, 1135, 4202, 41923, 656476,
        42161, 1001, 10000070
      ]
      const contractDeployedChains = [534351] // Scroll Sepolia
      const currentChainId = publicClient.chain?.id

      if (!currentChainId || !supportedChains.includes(currentChainId)) {
        setError("This chain is not supported by the application.")
        setTransactions([])
        setLoading(false)
        return
      }

      if (!contractDeployedChains.includes(currentChainId)) {
        setError("Contract not deployed on this chain.")
        setTransactions([])
        setLoading(false)
        return
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        const transactionResult = await retrieveTransactions(publicClient!, connectedAddress as `0x${string}`)

        if (Array.isArray(transactionResult) && transactionResult.length > 0) {
          const formattedTransactions = transactionResult.map((tx: TransactionResult, index: number) => {
            const { formatted, timestamp } = formatTimestamp(tx.transactionTimestamp)
            return {
              id: (index + 1).toString(),
              name: tx.recipientName,
              bank: tx.fiatBank,
              amount: Number(tx.fiatAmount).toLocaleString(),
              status: getStatus(tx.isCompleted, tx.isRefunded) as string,
              date: formatted,
              timestamp,
            }
          })
          setTransactions(formattedTransactions)
          setError(null)
        } else {
          setTransactions([])
          setError(null)
        }
      } catch (err: unknown) { // Changed from any to unknown
        if (err instanceof Error && err.message?.includes("contract not deployed") || (err instanceof Error && err.message?.includes("code=CALL_EXCEPTION"))) {
          setError("Contract not deployed on this chain.")
        } else if (err instanceof Error && (err.message?.includes("network") || err.message?.includes("timeout"))) {
          setError("Network error while fetching transactions.")
        } else {
          setError("Failed to fetch transactions. Please try again.")
          console.error("Error fetching transactions:", err)
        }
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [connectedAddress, publicClient])

  // Filter transactions by status and date
  const filteredTransactions = transactions.filter((transaction) => {
    const statusMatch = selectedStatusFilter === "All types" || transaction.status.toLowerCase() === selectedStatusFilter.toLowerCase()
    const now = Date.now()
    let dateMatch = true
    if (selectedDateFilter !== "All time") {
      const days = selectedDateFilter === "Last 7 days" ? 7 : selectedDateFilter === "Last 30 days" ? 30 : 90
      const cutoff = now - days * 24 * 60 * 60 * 1000
      dateMatch = transaction.timestamp >= cutoff
    }
    return statusMatch && dateMatch
  })

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
                  setSelectedStatusFilter(filter)
                  setIsStatusDropdownOpen(false)
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
  )

  // Render date filter UI as a dropdown on all screens
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
                setSelectedDateFilter(filter)
                setIsDateDropdownOpen(false)
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
  )

  if (loading) {
    return <TransactionContentSkeleton />
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
                  setLoading(true)
                  setError(null)
                  const fetchTransactions = async () => {
                    if (!connectedAddress || !publicClient) {
                      setError("No connected wallet address or public client found.")
                      setLoading(false)
                      return
                    }

                    const supportedChains = [
                      1, 10, 25, 56, 137, 338, 43114, 534351, 534352,
                      8453, 1101, 11155111, 1135, 4202, 41923, 656476,
                      42161, 1001, 10000070
                    ]
                    const contractDeployedChains = [534351]
                    const currentChainId = publicClient.chain?.id

                    if (!currentChainId || !supportedChains.includes(currentChainId)) {
                      setError("This chain is not supported by the application.")
                      setTransactions([])
                      setLoading(false)
                      return
                    }

                    if (!contractDeployedChains.includes(currentChainId)) {
                      setError("Contract not deployed on this chain.")
                      setTransactions([])
                      setLoading(false)
                      return
                    }

                    try {
                      const transactionResult = await retrieveTransactions(
                        publicClient!,
                        connectedAddress as `0x${string}`,
                      )
                      if (Array.isArray(transactionResult) && transactionResult.length > 0) {
                        const formattedTransactions = transactionResult.map((tx: TransactionResult, index: number) => {
                          const { formatted, timestamp } = formatTimestamp(tx.transactionTimestamp)
                          return {
                            id: (index + 1).toString(),
                            name: tx.recipientName,
                            bank: tx.fiatBank,
                            amount: Number(tx.fiatAmount).toLocaleString(),
                            status: getStatus(tx.isCompleted, tx.isRefunded) as string,
                            date: formatted,
                            timestamp,
                          }
                        })
                        setTransactions(formattedTransactions)
                        setError(null)
                      } else {
                        setTransactions([])
                        setError(null)
                      }
                    } catch (err: unknown) { // Changed from any to unknown
                      if (err instanceof Error && err.message?.includes("contract not deployed") || (err instanceof Error && err.message?.includes("code=CALL_EXCEPTION"))) {
                        setError("Contract not deployed on this chain.")
                      } else if (err instanceof Error && (err.message?.includes("network") || err.message?.includes("timeout"))) {
                        setError("Network error while fetching transactions.")
                      } else {
                        setError("Failed to fetch transactions. Please try again.")
                        console.error("Error fetching transactions:", err)
                      }
                      setTransactions([])
                    } finally {
                      setLoading(false)
                    }
                  }
                  fetchTransactions()
                }}
                className="px-4 py-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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
    )
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
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; // Chrome, Safari, Edge
            }
          `}</style>
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
                        ? "text-orange-500"
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
  )
}

export default TransactionContent