"use client"

import type React from "react"

import { ChevronDown } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { BankSelect } from "./bank-select"
import { useState, useEffect } from "react"
import { TransferSummary } from "./transfer-summary"

interface TransferModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  balance: number
}

interface TransferFormData {
  bank: string
  bankName: string
  accountNumber: string
  amount: string
}

export function TransferModal({ open, onOpenChange, balance }: TransferModalProps) {
  const [showSummary, setShowSummary] = useState(false)
  const [formData, setFormData] = useState<TransferFormData>({
    bank: "",
    bankName: "",
    accountNumber: "",
    amount: "",
  })

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      // Reset form data and view when modal is closed
      setTimeout(() => {
        setFormData({
          bank: "",
          bankName: "",
          accountNumber: "",
          amount: "",
        })
        setShowSummary(false)
      }, 300) // Small delay to ensure animation completes
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSummary(true)
  }

  const handleConfirmTransfer = () => {
    console.log("Transfer confirmed:", formData)
    onOpenChange(false) // Close the modal after confirmation
  }

  const isFormValid = formData.bank && formData.accountNumber && formData.amount

  if (showSummary) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl border-none bg-transparent p-0">
          <TransferSummary
            amount={Number.parseFloat(formData.amount)}
            recipient="Leo Joseph"
            accountNumber={formData.accountNumber}
            bankName={formData.bankName}
            onBack={() => setShowSummary(false)}
            onConfirm={handleConfirmTransfer}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-none bg-[#1C1C27] p-0 text-white">
        <div className="space-y-6 rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Transfer</h2>
            <button className="flex items-center gap-2 rounded-full bg-[#2F2F3A] px-4 py-2 text-sm">
              <Image src="/placeholder.svg" alt="Nigeria flag" width={24} height={24} className="rounded-full" />
              Nigeria
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-2xl bg-[#14141B] p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <BankSelect
                    onSelect={(bankId, bankName) => {
                      setFormData((prev) => ({
                        ...prev,
                        bank: bankId,
                        bankName,
                      }))
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter Account number"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accountNumber: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl bg-[#2F2F3A] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl bg-[#2F2F3A] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-sm text-gray-400">Available balance of the token should show here</p>
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`mt-8 w-full rounded-2xl py-4 text-white transition-all ${
                  isFormValid
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                }`}
              >
                Transfer
              </button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

