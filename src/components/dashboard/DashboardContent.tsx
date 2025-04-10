"use client"

import { Suspense } from "react"
import WalletBalance from "@/components/dashboard/wallet-balance"
import TransactionList from "./transactions/transaction-list"
import StableCoinList from "./stablecoins/stable-coin-list"
import WalletBalanceSkeleton from "@/components/dashboard/wallet-balance-skeleton"
import TransactionListSkeleton from "./transactions/transaction-list-skeleton"
import StableCoinListSkeleton from "@/components/dashboard/stablecoins/stable-coin-list-skeleton"

export default function Dashboard() {
  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 h-[calc(100vh-80px)] overflow-hidden">
      <div className="space-y-6 overflow-hidden flex flex-col">
        <Suspense fallback={<WalletBalanceSkeleton />}>
          <div className="flex-shrink-0">
            <WalletBalance />
          </div>
        </Suspense>
        <Suspense fallback={<TransactionListSkeleton />}>
          <div className="flex-1 overflow-hidden">
            <TransactionList />
          </div>
        </Suspense>
      </div>
      <div className="overflow-hidden">
        <Suspense fallback={<StableCoinListSkeleton />}>
          <StableCoinList />
        </Suspense>
      </div>
    </div>
  )
}
