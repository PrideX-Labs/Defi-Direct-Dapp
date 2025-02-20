import { ArrowUpRight } from "lucide-react"
import type { Transaction } from "./transaction-list"

const statusColors = {
  successful: "text-green-500",
  pending: "text-orange-500",
  failed: "text-red-500",
}

interface TransactionItemProps {
  transaction: Transaction
  isLast: boolean
  opacity: number
}

export function TransactionItem({ transaction, isLast, opacity }: TransactionItemProps) {
  const { recipient, bank, amount, status, timestamp } = transaction

  return (
    <div className="relative" style={{ opacity }}>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2F2F3A]">
            <ArrowUpRight className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <p className="font-medium text-white">{recipient}</p>
            <p className="text-sm text-gray-400">{bank}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-medium ${statusColors[status]}`}>NGN{amount.toLocaleString()}</p>
          <p className="text-sm text-gray-400">
            {status} | {timestamp}
          </p>
        </div>
      </div>
      {!isLast && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
      )}
    </div>
  )
}

