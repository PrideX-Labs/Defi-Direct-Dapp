"use client"

import type React from "react"
import { ChevronDown } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { useEffect, useState } from "react"
import toast, { Toaster } from 'react-hot-toast'

interface Bank {
  id: number;
  name: string;
  code: string;
}

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
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankCode: '',
    accountNumber: '',
    accountName: '',
    amount: ''
  });
  const [verifying, setVerifying] = useState(false);

  // Fetch banks on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('/api/banks');
        const result = await response.json();
        
        if (result.success) {
          // Ensure banks have unique codes by filtering any duplicates
          const uniqueBanks = result.data.reduce((acc: Bank[], current: Bank) => {
            const x = acc.find(item => item.code === current.code);
            if (!x) {
              return acc.concat([current]);
            } else {
              console.warn(`Duplicate bank code found: ${current.code} - ${current.name}`);
              return acc;
            }
          }, []);
          
          setBanks(uniqueBanks);
        }
      } catch (error) {
        console.error('Failed to fetch banks:', error);
      }
    };

    if (open) {
      fetchBanks();
    }
  }, [open]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If account number is being changed
    if (name === 'accountNumber') {
      // If account number is cleared or less than 10 digits, clear the account name
      if (value.length < 10) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          accountName: '' // Clear account name when account number is invalid
        }));
      } else if (value.length === 10 && formData.bankCode) {
        // Auto-verify only when exactly 10 digits and bank code exists
        setFormData(prev => ({ ...prev, [name]: value }));
        verifyAccount(formData.bankCode, value);
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // If bank code changes and we already have a 10-digit account number, reverify
      if (name === 'bankCode' && formData.accountNumber.length === 10 && value) {
        verifyAccount(value, formData.accountNumber);
      }
    }
  };

  // Verify account number
  const verifyAccount = async (bankCode: string, accountNumber: string) => {
    if (accountNumber.length !== 10) return;
    
    setVerifying(true);
    setFormData(prev => ({ ...prev, accountName: '' })); // Clear previous account name during verification
    
    try {
      const response = await fetch('/api/verify-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bankCode, accountNumber })
      });

      const result = await response.json();
      
      if (result.success) {
        setFormData(prev => ({ ...prev, accountName: result.data.account_name }));
      } else {
        toast.error(result.message || "Could not verify account details");
      }
    } catch (error) {
      console.error('Account verification error:', error);
    } finally {
      setVerifying(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.bankCode || !formData.accountNumber || !formData.accountName || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0 || amountValue > balance) {
      toast.error("Please enter a valid amount within your available balance");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/initiate-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bankCode: formData.bankCode,
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
          amount: amountValue
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Your transfer of ₦${amountValue.toLocaleString()} is being processed`);
        // Reset form and close modal
        setFormData({
          bankCode: '',
          accountNumber: '',
          accountName: '',
          amount: ''
        });
        onOpenChange(false);
      } else {
        toast.error(result.message || "Could not process your transfer request");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
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
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <div className="relative">
                    <select
                      name="bankCode"
                      value={formData.bankCode}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl bg-[#2F2F3A] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="" disabled>
                        Select Bank
                      </option>
                      {banks.map((bank) => (
                        <option key={`${bank.id}-${bank.code}`} value={bank.code}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter Account number"
                    className="w-full rounded-xl bg-[#2F2F3A] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                {/* Account Name Display - Only show when verifying or when we have a name */}
                {verifying && (
                  <div className="text-sm text-gray-400">Verifying account...</div>
                )}
                
                {formData.accountName && (
                  <div className="rounded-xl bg-[#2F2F3A]/50 px-4 py-3">
                    <p className="text-sm text-gray-400">Account Name</p>
                    <p className="font-medium">{formData.accountName}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                    className="w-full rounded-xl bg-[#2F2F3A] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={100}
                    max={balance}
                    required
                  />
                  <p className="text-sm text-gray-400">Available balance: ₦{balance.toLocaleString()}</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || verifying}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl ${
                    loading || verifying
                      ? "bg-purple-600/50"
                      : "bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90"
                  } px-4 py-3 text-white transition-opacity`}
                >
                  {loading ? "Processing..." : "Transfer"}
                </button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}