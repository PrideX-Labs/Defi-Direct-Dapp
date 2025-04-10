"use client"

import { useWallet } from "@/context/WalletContext"
import { StableCoinItem } from "./stable-coin-item";
import { formatBalance } from "@/utils/formatBalance"
import { useEffect, useState, useCallback } from "react"
import StableCoinListSkeleton from "./stable-coin-list-skeleton"

export type StableCoin = {
  id: string
  name: string
  symbol: string
  balance: string
  ngnBalance: string
  icon: string
}

export default function StableCoinList() {
  const { usdcBalance, usdtBalance, usdcPrice, usdtPrice } = useWallet()
  const [stableCoins, setStableCoins] = useState<StableCoin[]>([])
  const [loading, setLoading] = useState(true)

  // Function to update stable coin data
  const updateStableCoins = useCallback(() => {
    const usdcBalanceFormatted = usdcBalance
    const usdtBalanceFormatted = usdtBalance

    const usdcNgnBalance = ((Number.parseFloat(usdcBalanceFormatted) * usdcPrice) / 10e5).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    const usdtNgnBalance = ((Number.parseFloat(usdtBalanceFormatted) * usdtPrice) / 10e5).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    // Set stable coins with updated balances
    setStableCoins([
      {
        id: "1",
        symbol: "USDC",
        name: "USDC $1",
        balance: formatBalance(usdcBalanceFormatted),
        ngnBalance: `₦${usdcNgnBalance}`,
        icon: "https://altcoinsbox.com/wp-content/uploads/2023/01/usd-coin-usdc-logo-600x600.webp",
      },
      {
        id: "2",
        symbol: "USDT",
        name: "USDT $1",
        balance: formatBalance(usdtBalanceFormatted),
        ngnBalance: `₦${usdtNgnBalance}`,
        icon: "https://altcoinsbox.com/wp-content/uploads/2023/01/tether-logo-600x600.webp",
      },
    ])

    // Simulate loading delay for better UX
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [usdcBalance, usdtBalance, usdcPrice, usdtPrice])

  // Update stable coins when balances or prices change
  useEffect(() => {
    updateStableCoins()
  }, [updateStableCoins])

  if (loading) {
    return <StableCoinListSkeleton />
  }

  return (
    <div className="w-full h-full rounded-3xl p-6">
      <h2 className="text-2xl font-semibold text-white">Your Stable coins</h2>
      <div className="mt-6">
        {stableCoins.map((coin, index) => (
          <StableCoinItem
            key={coin.id}
            coin={coin}
            opacity={1 - index * 0.2}
            isLast={index === stableCoins.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
