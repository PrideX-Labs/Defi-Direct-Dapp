"use client"
import { message } from "antd"
import WalletBalance from "@/components/dashboard/wallet-balance"
import StableCoins from "@/components/dashboard/stable-coins"
import RecentTransactions from "@/components/dashboard/recent-transactions"
import TransactionList from "./transactions/transaction-list"
import StableCoinList from "./stablecoins/stable-coin-list"

// const stableCoins = [
//   {
//     symbol: "USDC",
//     name: "USDC $1",
//     balance: "1,500",
//     price: "NGN2,324,015.00",
//     icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
//   },
//   {
//     symbol: "USDT",
//     name: "USDT $1",
//     balance: "500",
//     price: "NGN2,324,015.00",
//     icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
//   },
//   {
//     symbol: "BUSD",
//     name: "BUSD $1",
//     balance: "2,000",
//     price: "NGN2,324,015.00",
//     icon: "https://cryptologos.cc/logos/binance-usd-busd-logo.png",
//   },
// ]

// const transactions = [
//   {
//     id: "1",
//     name: "James Ovie",
//     bank: "FIRST BANK NIGERIA",
//     amount: "20,000",
//     status: "successful" as const,
//     date: "Dec. 16. 16:20pm",
//   },
//   {
//     id: "2",
//     name: "Patricia Eunice",
//     bank: "UNITED BANK OF AFRICA",
//     amount: "200,000",
//     status: "pending" as const,
//     date: "Dec. 16. 16:20pm",
//   },
//   {
//     id: "3",
//     name: "Leo Joseph",
//     bank: "UNITED BANK OF AFRICA",
//     amount: "200,000",
//     status: "failed" as const,
//     date: "Dec. 16. 16:20pm",
//   },
//   {
//     id: "4",
//     name: "Patricia Eunice",
//     bank: "UNITED BANK OF AFRICA",
//     amount: "200,000",
//     status: "pending" as const,
//     date: "Dec. 16. 16:20pm",
//   },
// ]

export default function Dashboard() {
  const handleTransfer = () => {
    message.info("Transfer feature coming soon!")
  }

  return (
      <div className=" grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-6">
          <WalletBalance balance="4,000.00" onTransfer={handleTransfer} />
          {/* <RecentTransactions transactions={transactions} /> */}
          <TransactionList/>
        </div>
        <div>
        <StableCoinList/>
          {/* <StableCoins coins={stableCoins} /> */}
        </div>
      </div>
  )
}

