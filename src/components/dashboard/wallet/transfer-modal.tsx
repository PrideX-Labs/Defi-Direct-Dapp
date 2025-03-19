"use client";

import type React from "react";
import { ChevronDown } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { initiateTransaction, approveTransaction, parseTransactionReceipt } from "@/services/initiateTransaction";
import { usePublicClient, useWalletClient } from "wagmi";
import { convertFiatToToken } from "@/utils/convertFiatToToken";
import { TOKEN_ADDRESSES } from "@/config";
import { useWallet } from "@/context/WalletContext";
import { formatBalance } from "@/utils/formatBalance";
import { TransferSummary } from "./transfer-summary";
import { type PublicClient, type WalletClient } from 'viem';
import { completeTransaction } from "@/services/completeTransaction";
import { Form } from "antd"

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
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

  const { usdcBalance, usdtBalance, usdcPrice, usdtPrice } = useWallet();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Format balances
  const usdcBalanceFormatted = usdcBalance;
  const usdtBalanceFormatted = usdtBalance;

  // Calculate NGN balances
  const usdcNgnBalance = ((parseFloat(usdcBalanceFormatted) * usdcPrice) / 10e5).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const usdtNgnBalance = ((parseFloat(usdtBalanceFormatted) * usdtPrice) / 10e5).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const selectedTokenBalance = selectedToken.name === "USDC" ? usdcNgnBalance : usdtNgnBalance;

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

  const getBankName = (code: string) => {
    const bank = banks.find(bank => bank.code === code);
    return bank ? bank.name : '';
  };

  // Fetch banks when modal opens
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

    return () => {
      isMounted = false; // Cleanup to prevent state updates after unmount
    };
  }, [open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'accountNumber' && value.length === 10 && formData.bankCode) {
      verifyAccount(formData.bankCode, value);
    } else if (name === 'bankCode' && formData.accountNumber.length === 10) {
      verifyAccount(value, formData.accountNumber);
    }
  };

  // Verify account details
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
        toast.error("Could not verify account details");
        // console.error('Account verification error:', result.message);
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
    if (isNaN(amountValue) || amountValue <= 0 || amountValue > parseFloat(selectedTokenBalance.replace(/,/g, ''))) {
      toast.error("Please enter a valid amount within your available balance");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (open) {
        setShowSummary(true);
        setLoading(false);
      }
    }, 4000);
  };

  // Handle transfer confirmation
  const handleConfirmTransfer = async () => {
    setLoading(true);

    const price = selectedToken.name === "USDC" ? usdcPrice : usdtPrice;
    const amountValue = parseFloat(formData.amount);
    const tokenAmount = await convertFiatToToken(amountValue, selectedToken.name, price);

    try {
      if (walletClient && publicClient) {
        await approveTransaction(tokenAmount, selectedToken.address, publicClient, walletClient);

        // Step 2: Initiate the transaction (user signs to initiate the transfer)
        const receipt = await initiateTransaction(tokenAmount, selectedToken.address, formData.accountNumber, amountValue, formData.accountName, getBankName(formData.bankCode), publicClient, walletClient);

        if (receipt && receipt.status === 'success') {
          const parsedReceipt = await parseTransactionReceipt(receipt);
          if (parsedReceipt) {
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
              await completeTransaction(parsedReceipt.txId, parsedReceipt.amount);
              toast.success(`Your transfer of ₦${formData.amount.toString()} is complete!`);
              resetForm();
              onOpenChange(false);
            } else {
              toast.error("Could not complete your transfer request");
              // console.error('Transfer error:', result.message);
            }
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
        setLoading(false);
      }
    }
  };

  // Render transfer summary
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
            onBack={() => {
              setShowSummary(false);
              setLoading(false);
            }}
            onConfirm={handleConfirmTransfer}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Render transfer form
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
                  {loading ? "Loading..." : "Transfer"}
                </button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}