import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/paydirect'; 
import { ethers } from 'ethers';
import { type PublicClient, type WalletClient } from 'viem';
import { TransactionReceipt as ViemTransactionReceipt } from 'viem';
import { TransactionReceipt as EthersTransactionReceipt } from 'ethers';

type CombinedTransactionReceipt = ViemTransactionReceipt | EthersTransactionReceipt;

const TOKEN_CONTRACT_ABI = [
    {
      "constant": false,
      "inputs": [
        { "name": "spender", "type": "address" },
        { "name": "amount", "type": "uint256" }
      ],
      "name": "approve",
      "outputs": [
        { "name": "", "type": "bool" }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
export const approveTransaction = async (
    amount: number,
    tokenAddress: string,
    publicClient: PublicClient, // Wagmi's publicClient
    walletClient: WalletClient
  ) => {
    if (!walletClient) {
        console.error("Wallet client is undefined. Connect wallet first.");
        return;
      }
      const fee = (amount * 100) / 10000;
      amount = Math.round(amount + fee);
      console.log("TotalAmountwithfee:", amount);
      
      // approve the token
      try {
          // Use walletClient to write to the contract
          const txHash = await walletClient.writeContract({
            address: tokenAddress as `0x${string}`,
            abi: TOKEN_CONTRACT_ABI,
            functionName: 'approve',
            args: [CONTRACT_ADDRESS, BigInt(amount)],
            account: walletClient.account!,
            chain: publicClient.chain,
          });
      
          console.log("Transaction hash:", txHash);
      
          // Wait for the transaction to be mined
          const receipt = await publicClient?.waitForTransactionReceipt?({ hash: txHash }): undefined;
          console.log("Transaction mined:", receipt);
      
          return receipt;
      } catch (error) {
          console.error("Transaction failed:", error);
      }
  };

export const initiateTransaction = async (
    amount: number,
    tokenAddress: string,
    fiatBankAccountNumber: string,
    fiatAmount: number,
    publicClient: PublicClient, // Wagmi's publicClient
    walletClient: WalletClient
  ) => {
    if (!walletClient) {
      console.error("Wallet client is undefined. Connect wallet first.");
      return;
    }
    
    // initiate the transaction
    try {
        // Use walletClient to write to the contract
        const txHash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'initiateFiatTransaction',
          args: [tokenAddress as `0x${string}`, BigInt(amount), BigInt(fiatBankAccountNumber), BigInt(fiatAmount)],
          account: walletClient.account!,
          chain: publicClient.chain
        });
        console.log("Account number:", Number(fiatBankAccountNumber));
        console.log("amount:", amount);
        console.log("Transaction hash:", txHash);
    
        // Wait for the transaction to be mined
        const receipt = await publicClient?.waitForTransactionReceipt({ hash: txHash });
        console.log("Transaction mined:", receipt);
    
        return receipt;
      } catch (error) {
        console.error("Transaction failed:", error);
        throw error; // Re-throw the error for handling in the calling function
      }
  };
  const contractInterface = new ethers.Interface(CONTRACT_ABI);

  export async function parseTransactionReceipt(receipt: CombinedTransactionReceipt) {
    for (const log of receipt.logs) {
      try {
        // Decode the log
        const parsedLog = contractInterface.parseLog(log);
  
        // Check if the log is the TransactionInitiated event
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
        // Skip logs that cannot be parsed (e.g., logs from other contracts
        continue;
      }
    }
  
    console.log("TransactionInitiated event not found in logs");
    return null;
  }