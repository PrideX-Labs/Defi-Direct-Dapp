import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/paydirect';
import { ethers } from 'ethers';
import { type PublicClient, type WalletClient } from 'viem';
import { TransactionReceipt as ViemTransactionReceipt } from 'viem';
import { TransactionReceipt as EthersTransactionReceipt } from 'ethers';

type CombinedTransactionReceipt = ViemTransactionReceipt | EthersTransactionReceipt;

const TOKEN_CONTRACT_ABI = [
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const approveTransaction = async (
  amount: number,
  tokenAddress: string,
  publicClient: PublicClient,
  walletClient: WalletClient
): Promise<{ receipt: CombinedTransactionReceipt | undefined; approvalFee: number }> => {
  if (!walletClient) {
    console.error("Wallet client is undefined. Connect wallet first.");
    throw new Error("Wallet client is undefined");
  }

  const fee = (amount * 100) / 10000; // 1% fee
  const totalAmount = Math.round(amount + fee);
  console.log("Approval fee:", fee, "Total amount with fee:", totalAmount);

  try {
    const txHash = await walletClient.writeContract({
      address: tokenAddress as `0x${string}`,
      abi: TOKEN_CONTRACT_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS, BigInt(totalAmount)],
      account: walletClient.account!,
      chain: publicClient.chain,
    });

    console.log("Approval transaction hash:", txHash);

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    console.log("Approval transaction mined:", receipt);

    return { receipt, approvalFee: fee };
  } catch (error) {
    console.error("Approval transaction failed:", error);
    throw error;
  }
};

export const initiateTransaction = async (
  amount: number,
  tokenAddress: string,
  fiatBankAccountNumber: string,
  fiatAmount: number,
  recipientName: string,
  recipientBank: string,
  publicClient: PublicClient,
  walletClient: WalletClient
): Promise<`0x${string}`> => {
  if (!walletClient) {
    console.error("Wallet client is undefined. Connect wallet first.");
    throw new Error("Wallet client is undefined");
  }

  try {
    const txHash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'initiateFiatTransaction',
      args: [
        tokenAddress as `0x${string}`,
        BigInt(amount),
        BigInt(fiatBankAccountNumber),
        BigInt(fiatAmount),
      ],
      account: walletClient.account!,
      chain: publicClient.chain,
    });

    console.log("Account number:", Number(fiatBankAccountNumber));
    console.log("Amount:", amount);
    console.log("Transaction hash:", txHash);

    return txHash;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};

const contractInterface = new ethers.Interface(CONTRACT_ABI);

export async function parseTransactionReceipt(receipt: CombinedTransactionReceipt) {
  for (const log of receipt.logs) {
    try {
      const parsedLog = contractInterface.parseLog(log);
      if (parsedLog && parsedLog.name === "TransactionInitiated") {
        const txId = parsedLog.args.txId;
        const user = parsedLog.args.user;
        const amount = parsedLog.args.amount;

        console.log("Transaction ID:", txId);
        console.log("User:", user);
        console.log("Amount:", amount.toString());

        return { txId, user, amount };
      }
    } catch {
      continue;
    }
  }

  console.log("TransactionInitiated event not found in logs");
  return null;
}