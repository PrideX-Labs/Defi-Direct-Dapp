// import Image from "next/image"
import type { StableCoin } from "./stable-coin-list"
import { Avatar } from "antd"
interface StableCoinItemProps {
  coin: StableCoin
  opacity: number
  isLast: boolean
}

export function StableCoinItem({ coin, opacity,isLast }: StableCoinItemProps) {
  const { name, symbol, balance, transactionId, icon } = coin

  return (
    <div className="relative flex items-center justify-between py-4" style={{ opacity }}>
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
        <Avatar src={icon} size="large" />
        </div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-sm text-gray-400">{symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-white">${balance.toLocaleString()}</p>
        <p className="text-sm text-gray-400">{transactionId}</p>
      </div>
      {!isLast && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
      )}
    </div>
  )
}

