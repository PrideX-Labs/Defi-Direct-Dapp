import { StableCoinItem } from "./stable-coin-item"

export type StableCoin = {
  id: string
  name: string
  symbol: string
  balance: number
  transactionId: string
  icon: string
}

const stableCoins: StableCoin[] = [
//   {
//     id: "1",
//     name: "USDC",
//     symbol: "USDC $1",
//     balance: 1500,
//     transactionId: "NGN234J01500",
//     icon: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "2",
//     name: "USDT",
//     symbol: "USDT $1",
//     balance: 500,
//     transactionId: "NGN234J01500",
//     icon: "/placeholder.svg?height=40&width=40",
//   },
//   {
//     id: "3",
//     name: "BUSD",
//     symbol: "BUSD $1",
//     balance: 2000,
//     transactionId: "NGN234J01500",
//     icon: "/placeholder.svg?height=40&width=40",
//   },
  {
    id: "1",
    symbol: "USDC",
    name: "USDC $1",
    balance: 1500,
    transactionId: "NGN234J01500",
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  },
  {
    id: "2",
    symbol: "USDT",
    name: "USDT $1",
    balance: 500,
    transactionId: "NGN234J01500",
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  {
    id: "3",
    symbol: "BUSD",
    name: "BUSD $1",
    balance: 2000,
    transactionId: "NGN234J01500",
    icon: "https://cryptologos.cc/logos/binance-usd-busd-logo.png",
  },
]

export default function StableCoinList() {
  return (
    <div className="w-full h-full  rounded-3xl bg-gradient-to-b from-[#1C1C27]  to-[#1C1C2700] p-6">
      <h2 className="text-2xl font-semibold text-white">Your Stable coins</h2>
      <div className="mt-6">
        {stableCoins.map((coin, index) => (
          <StableCoinItem key={coin.id} coin={coin} opacity={1 - index * 0.2} isLast={index === stableCoins.length - 1}/>
        ))}
      </div>
    </div>
  )
}

