"use client"

import { ChevronDown } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

interface TransferModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  balance: number
}

export function TransferModal({ open, onOpenChange, balance }: TransferModalProps) {
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
            <form className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-xl bg-[#2F2F3A] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Bank
                    </option>
                    <option value="first-bank">First Bank</option>
                    <option value="uba">UBA</option>
                    <option value="zenith">Zenith Bank</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter Account number"
                  className="w-full rounded-xl bg-[#2F2F3A] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full rounded-xl bg-[#2F2F3A] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-sm text-gray-400">Available balance of the token should show here</p>
              </div>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-3 text-white transition-opacity hover:opacity-90"
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

