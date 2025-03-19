// import { TransactionHeader } from "./transaction-header"
// import { TransactionItem } from "./transaction-item"

// export type Transaction = {
//   id: string
//   recipient: string
//   bank: string
//   amount: number
//   status: "successful" | "pending" | "failed"
//   timestamp: string
// }

// const transactions: Transaction[] = [
//   {
//     id: "1",
//     recipient: "James Ovie",
//     bank: "FIRST BANK NIGERIA",
//     amount: 20000,
//     status: "successful",
//     timestamp: "Dec. 16. 16:20pm",
//   },
//   {
//     id: "2",
//     recipient: "Patricia Eunice",
//     bank: "UNITED BANK OF AFRICA",
//     amount: 200000,
//     status: "pending",
//     timestamp: "Dec. 16. 16:20pm",
//   },
//   {
//     id: "3",
//     recipient: "Leo Joseph",
//     bank: "UNITED BANK OF AFRICA",
//     amount: 200000,
//     status: "failed",
//     timestamp: "Dec. 16. 16:20pm",
//   },
//   {
//     id: "4",
//     recipient: "Patricia Eunice",
//     bank: "UNITED BANK OF AFRICA",
//     amount: 200000,
//     status: "pending",
//     timestamp: "Dec. 16. 16:20pm",
//   },
// ]

// export default function TransactionList() {
//   return (
//     <div className="w-full rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
//       <TransactionHeader />
//       <div className="mt-6">
//         {transactions.map((transaction, index) => (
//           <TransactionItem
//             key={transaction.id}
//             transaction={transaction}
//             isLast={index === transactions.length - 1}
//             opacity={1 - index * 0.2}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }


import { TransactionHeader } from "./transaction-header"
import { TransactionItem } from "./transaction-item"

export type Transaction = {
  id: string
  recipient: string
  bank: string
  amount: number
  status: "successful" | "pending" | "failed"
  timestamp: string
}

const transactions: Transaction[] = [
  {
    id: "1",
    recipient: "James Ovie",
    bank: "FIRST BANK NIGERIA",
    amount: 20000,
    status: "successful",
    timestamp: "Dec. 16. 16:20pm",
  },
  {
    id: "2",
    recipient: "Patricia Eunice",
    bank: "UNITED BANK OF AFRICA",
    amount: 200000,
    status: "pending",
    timestamp: "Dec. 16. 16:20pm",
  },
  {
    id: "3",
    recipient: "Leo Joseph",
    bank: "UNITED BANK OF AFRICA",
    amount: 200000,
    status: "failed",
    timestamp: "Dec. 16. 16:20pm",
  },
  {
    id: "4",
    recipient: "Patricia Eunice",
    bank: "UNITED BANK OF AFRICA",
    amount: 200000,
    status: "pending",
    timestamp: "Dec. 16. 16:20pm",
  },
]

export default function TransactionList() {
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
  )
}

