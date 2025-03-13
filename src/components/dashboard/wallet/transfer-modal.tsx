"use client"

import type React from "react"
import { ChevronDown } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import toast, { Toaster } from 'react-hot-toast'
import { initiateTransaction, approveTransaction } from "@/services/initiateTransaction"
import { usePublicClient, useWalletClient } from "wagmi"
import { convertFiatToToken } from "@/utils/convertFiatToToken"
import { TOKEN_ADDRESSES } from "@/config"
import { useWallet } from "@/context/WalletContext"
import { formatBalance } from "@/utils/formatBalance"
import { fetchTokenPrice } from "@/utils/fetchTokenprice"
import { TransferSummary } from "./transfer-summary"
import { type PublicClient, type WalletClient } from 'viem';

const tokens = [
  { name: "USDC", logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", address: TOKEN_ADDRESSES['USDC'] },
  { name: "USDT", logo: "https://cryptologos.cc/logos/tether-usdt-logo.png", address: TOKEN_ADDRESSES['USDT'] },
];

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

export function TransferModal({ open, onOpenChange }: TransferModalProps) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    bankCode: '',
    accountNumber: '',
    accountName: '',
    amount: ''
  });
  const [verifying, setVerifying] = useState(false);

  const { usdcBalance, usdtBalance } = useWallet();
  const [usdcPrice, setUsdcPrice] = useState<number>(0);
  const [usdtPrice, setUsdtPrice] = useState<number>(0);

  const fetchPrices = async () => {
    try {
      const usdc = await fetchTokenPrice("usd-coin");
      const usdt = await fetchTokenPrice("tether");

      if (usdc) setUsdcPrice(usdc);
      if (usdt) setUsdtPrice(usdt);
    } catch (error) {
      console.error("Failed to fetch token prices. Retaining previous prices.", error);
    }
  };

  const usdcBalanceFormatted = formatBalance(usdcBalance);
  const usdtBalanceFormatted = usdtBalance;

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Reset form when modal is closed
  const resetForm = () => {
    setFormData({
      bankCode: '',
      accountNumber: '',
      accountName: '',
      amount: '',
    });
    setShowSummary(false);
    setLoading(false);
    setVerifying(false);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchBanks = async () => {
      try {
        const response = await fetch('/api/banks');
        const result = await response.json();
        
        if (result.success && isMounted) {
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
    if (open) {
      fetchPrices(); 
      const interval = setInterval(fetchPrices, 5000);
      return () => clearInterval(interval); 
    }
    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmount
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      resetForm(); 
    }
  }, [open]);

  const usdcNgnBalance = (parseFloat(usdcBalanceFormatted) * usdcPrice).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const usdtNgnBalance = ((parseFloat(usdtBalanceFormatted) * usdtPrice)/10e5).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const selectedTokenBalance = selectedToken.name === "USDC" ? usdcNgnBalance : usdtNgnBalance;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'accountNumber') {
      if (value.length < 10) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          accountName: ''
        }));
      } else if (value.length === 10 && formData.bankCode) {
        setFormData(prev => ({ ...prev, [name]: value }));
        verifyAccount(formData.bankCode, value);
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name === 'bankCode' && formData.accountNumber.length === 10 && value) {
        verifyAccount(value, formData.accountNumber);
      }
    }
  };

  const verifyAccount = async (bankCode: string, accountNumber: string) => {
    if (accountNumber.length !== 10) return;
    
    setVerifying(true);
    setFormData(prev => ({ ...prev, accountName: '' }));
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.bankCode || !formData.accountNumber || !formData.accountName || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0 || amountValue > parseFloat(selectedTokenBalance.replace(/,/g, ''))) {
      toast.error("Please enter a valid amount within your available balance");
      return;
    }

    // Set loading state and wait for 4 seconds before showing the summary
    setLoading(true);
    setTimeout(() => {
      if (open) {
        setShowSummary(true);
        setLoading(false); // Reset loading state after the delay
      }
    }, 4000); // 4-second delay
  };

  const handleConfirmTransfer = async () => {
    setLoading(true); // Set loading state while processing

    const price = selectedToken.name === "USDC" ? usdcPrice : usdtPrice;
    console.log("Withdrawal price:", price);
    const amountValue = parseFloat(formData.amount);
    const tokenAmount = await convertFiatToToken(amountValue, selectedToken.name, price);

    try {
      if (walletClient && publicClient) {
        // Step 1: Approve the transaction (user signs for approval)
        await approveTransaction(tokenAmount, selectedToken.address, publicClient, walletClient);

        // Step 2: Initiate the transaction (user signs to initiate the transfer)
        const receipt = await initiateTransaction(tokenAmount, selectedToken.address, formData.accountNumber, amountValue, publicClient, walletClient);

        // Step 3: Call the backend API to complete the transfer
        if (receipt?.status === 'success') {
          const response = await fetch('/api/initiate-transfer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bankCode: formData.bankCode,
              accountNumber: formData.accountNumber,
              accountName: formData.accountName,
              amount: amountValue,
            }),
          });
          const result = await response.json();
          if (result.success) {
            // Show success toast (transfer is complete)
            toast.success(`Your transfer of ₦${amountValue.toLocaleString()} is complete!`);
  
            // Reset form and close modal
            resetForm();
            onOpenChange(false);
          } else {
            toast.error(result.message || "Could not complete your transfer request");
          }
        }


      } else {
        toast.error("Wallet client is not available");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
      console.error('Transfer error:', error);
    } finally {
      if (open) {
        setLoading(false); // Only reset loading state if the modal is still open
      }
    }
  };

  if (showSummary) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>  
        <DialogContent className="max-w-xl border-none bg-transparent p-0">
          <TransferSummary
            verifying={verifying}
            loading={loading}
            amount={parseFloat(formData.amount)}
            recipient={formData.accountName}
            accountNumber={formData.accountNumber}  
            bankName={formData.bankCode}
            onBack={() => {setShowSummary(false)
              setLoading(false);
            }}
            onConfirm={handleConfirmTransfer}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md border-none bg-[#1C1C27] p-0 text-white">
          <div className="space-y-6 rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold">Transfer</h2>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full bg-[#2F2F3A] px-4 py-2 text-sm"
                >
                  <img
                    src={selectedToken.logo}
                    alt={`${selectedToken.name} logo`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  {selectedToken.name}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-10 left-0 mt-2 w-32 rounded-lg bg-[#2F2F3A] shadow-lg">
                    {tokens.map((token) => (
                      <button
                        key={token.name}
                        onClick={() => {
                          setSelectedToken(token);
                          setDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-[#3B3B4F]"
                      >
                        <img src={token.logo} alt={token.name} width={20} height={20} className="rounded-full" />
                        {token.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                    max={parseFloat(selectedTokenBalance.replace(/,/g, ''))}
                    required
                  />
                  <p className="text-sm text-gray-400">
                    Available balance: ₦{selectedTokenBalance}
                  </p>
                </div>

                <button
                  type="submit"
                  className={`mt-6 flex w-full items-center bg-purple-600/50 justify-center gap-2 rounded-xl px-4 py-3 text-white transition-opacity`}
                >
                  {loading ? "Loading..." : "Transfer"} {/* Changed "Processing" to "Loading" */}
                </button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}