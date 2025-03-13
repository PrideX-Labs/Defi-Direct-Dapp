import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/paydirect'; 
import { type PublicClient, type WalletClient } from 'viem';

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