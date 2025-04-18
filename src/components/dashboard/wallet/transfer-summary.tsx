import { ArrowLeft } from "lucide-react";

interface TransferSummaryProps {
  amount: number;
  recipient: string;
  accountNumber: string;
  bankName: string;
  loading: boolean;
  verifying: boolean;
  approvalFee: number;
  tokenName: string;
  onBack: () => void;
  onConfirm: () => Promise<void>;
  txHash?: `0x${string}` | null;
}

export function TransferSummary({
  loading,
  amount,
  recipient,
  accountNumber,
  bankName,
  approvalFee,
  tokenName,
  onBack,
  onConfirm,
  txHash,
}: TransferSummaryProps) {


  console.log("approval fee", approvalFee);
  console.log("approval real fee", approvalFee/1e6);
  const formatDateTime = (date: Date): string => {
    const months = [
      "Jan.",
      "Feb.",
      "Mar.",
      "Apr.",
      "May",
      "June",
      "July",
      "Aug.",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dec.",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${month} ${day}, ${hours}:${minutes}${ampm}`;
  };

  return (
    <div className="w-full max-w-xl rounded-[2.5rem] bg-gradient-to-b from-[#1C1C27] to-[#1C1C27] p-6">
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

      <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-b from-[#1C1C27]/80 to-[#1C1C27]/60">
        <div className="space-y-6 p-6">
          <div className="flex justify-between">
            <p className="text-base text-white">Transfer type</p>
            <p className="text-sm text-gray-500">Bank Transfer</p>
          </div>

          <div className={txHash ? "flex justify-between" : "hidden justify-between"}>
            <p className="text-base text-white">Transaction ID</p>
            <p
              className="text-xs text-gray-500 text-right"
              style={{ wordBreak: "break-all" }}
            >
              {txHash || "Not available"}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-base text-white">Recipient Details</p>
            <div className="text-right">
              <p className="text-sm text-gray-500">{recipient}</p>
              <p className="text-sm text-gray-500">
                {accountNumber}, {bankName}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <p className="text-lg text-white">Time</p>
            <p className="text-sm text-gray-500">{formatDateTime(new Date())}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-base text-white">Fee</p>
            <p className="text-sm text-gray-500">
              -{(approvalFee / 1e6).toFixed(3)} {tokenName}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={loading}
        className={`mt-6 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 py-4 text-lg ${
          loading
            ? "bg-purple-600/50 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90"
        } font-medium text-white transition-opacity`}
      >
        {loading ? "Processing..." : "Confirm Transfer"}
      </button>
    </div>
  );
}