import { ArrowLeft } from "lucide-react"

interface TransferSummaryProps {
  amount: number
  recipient: string
  accountNumber: string
  bankName: string
  loading: boolean
  verifying: boolean
  onBack: () => void
  onConfirm: () => void
}

export function TransferSummary({
  verifying,
  loading,
  amount,
  recipient,
  accountNumber,
  bankName,
  onBack,
  onConfirm,
}: TransferSummaryProps) {
  return (
    <div className="w-full max-w-xl rounded-[2.5rem] bg-gradient-to-b from-[#1C1C27] to-[#14141B] p-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-white hover:opacity-80">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-medium text-white">Transfer Summary</h1>
      </div>

      <div className="mt-12 text-center">
        <p className="text-5xl font-medium text-white">NGN{amount.toLocaleString()}</p>
        <p className="mt-2 text-lg text-gray-500">TO {recipient}</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-b from-[#1C1C27]/80 to-[#14141B]/60">
        <div className="space-y-6 p-6">
          <div className="flex justify-between">
            <p className="text-base text-white">Transfer type</p>
            <p className="text-sm text-gray-500">Bank Transfer</p>
          </div>

          <div className="flex justify-between ">
            <p className="text-base text-white">Recipient Details</p>
            <div className="text-right">
              <p className="text-sm text-gray-500">{recipient}</p>
              <p className="text-sm text-gray-500">
                {accountNumber}, {bankName}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <p className="text-base text-white">Smart Contract ID</p>
            <p className="text-sm text-gray-500">1A1Z6MEA....9UuC</p>
          </div>

          <div className="flex justify-between gap-28 ">
            <p className="text-base text-white">Transaction ID</p>
            <p className="text-xs text-gray-500 text-right" style={{ wordBreak: "break-all" }}>
              0x5eD8b7a3F9cD21A8a74fBc9E716D1698a9D4f7Cb563E9F6a7BBD2E9C4F1A3B7
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-lg text-white">Time</p>
            <p className="text-sm text-gray-500">Dec. 16, 16:31pm</p>
          </div>

          <div className="flex justify-between">
            <p className="text-base text-white">Fee</p>
            <p className="text-sm text-gray-500">-1.00000usdt</p>
          </div>
        </div>
      </div>

      <button
        onClick={onConfirm}
        className={`mt-6 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 py-4 text-lg  ${
                    loading || verifying
                      ? "bg-purple-600/50"
                      : "bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90"
                  } font-medium text-white transition-opacity hover:opacity-90`}>
        {loading ? "Processing..." : "Transfer"}
        Confirm Transfer
      </button>
    </div>
  )
}

