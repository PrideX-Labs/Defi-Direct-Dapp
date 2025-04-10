import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/paydirect';
import { type PublicClient } from 'viem';

export const retrieveTransactions = async (
  publicClient: PublicClient, // Wagmi's publicClient
  userAddress: `0x${string}` // Explicitly pass the user's address
) => {
  if (!publicClient) {
    console.error("Public client is undefined. Connect wallet first.");
    return;
  }

  if (!userAddress) {
    console.error("User address is undefined. Provide a valid address.");
    return;
  }

  try {
    // Read the user's transactions from the contract
    const transactions = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'getTransactionsByAddress',
      args: [userAddress], // Pass the user's address as an argument
    });

    // Return the transactions directly (no need to wait for receipts)
    return transactions.toReversed();
  } catch (error) {
    console.error("Failed to retrieve transactions:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};