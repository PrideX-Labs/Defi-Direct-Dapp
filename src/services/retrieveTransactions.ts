// src/services/retrieveTransactions.ts
import type { Transaction, TransactionResult } from "../types/transaction";

export const retrieveTransactions = async (userAddress: `0x${string}`): Promise<TransactionResult[]> => {
  if (!userAddress) {
    console.error("User address is undefined. Provide a valid address.");
    return [];
  }

  try {
    // Fetch transactions from the backend
    let backendTransactions: Transaction[] = [];
    try {
      const response = await fetch(
        "https://backend-cf8a.onrender.com/transaction/transactions/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Backend GET failed: ${response.status} - ${errorText}`
        );
      }
      backendTransactions = await response.json();
      console.log("Backend transactions:", backendTransactions);
    } catch (error) {
      console.error("Backend GET error:", error);
      backendTransactions = [];
    }

    // Log raw transactions
    console.log(
      `Raw transactions for user ${userAddress}:`,
      backendTransactions
    );

    // Filter and deduplicate backend transactions
    const dedupedBackendTransactions = backendTransactions
      .filter((tx) => {
        const isValid = tx.recipient && tx.recipient.toLowerCase() === userAddress.toLowerCase();
        if (!isValid) {
          console.warn("Filtered out transaction:", tx);
        }
        return isValid;
      })
      .reduce((acc: Transaction[], tx) => {
        const existing = acc.find((t) => t.id === tx.id);
        if (!existing && tx.id) {
          acc.push(tx);
        } else if (existing && tx.status === "successful") {
          acc = acc.filter((t) => t.id !== tx.id);
          acc.push(tx);
        }
        return acc;
      }, []);

    console.log(
      `Deduped backend transactions for ${userAddress}:`,
      dedupedBackendTransactions
    );

    // Map to TransactionResult format
    const formattedTransactions: TransactionResult[] = dedupedBackendTransactions.map(
      (tx, index) => {
        // Convert status to boolean flags
        const isCompleted = tx.status === "successful";
        const isRefunded = tx.status === "failed" && tx.amountSpent === 0;
        
        const formattedTx: TransactionResult = {
          user: userAddress,
          token: tx.tokenName ? `0x${tx.tokenName}` : "0x0",
          amount: BigInt(tx.amount || 0),
          amountSpent: BigInt(
            Math.round((tx.amountSpent || 0) * 1e18)
          ),
          transactionFee: BigInt(
            Math.round((tx.transactionFee || 0) * 1e18)
          ),
          transactionTimestamp: BigInt(tx.rawTimestamp || Math.floor(Date.now() / 1000)),
          fiatBankAccountNumber: BigInt(tx.bank || "0"),
          fiatBank: tx.bank || "Unknown",
          recipientName: tx.recipient || "Unknown",
          fiatAmount: tx.amount || 0,
          isCompleted,
          isRefunded,
          txId: tx.id || `tx-${index}-${Date.now()}`,
        };
        console.log(`Formatted transaction ${index}:`, formattedTx);
        return formattedTx;
      }
    );

    // Sort by transactionTimestamp (newest first)
    const sortedTransactions = formattedTransactions.sort(
      (a, b) => Number(b.transactionTimestamp) - Number(a.transactionTimestamp)
    );

    console.log(`Sorted transactions for ${userAddress}:`, sortedTransactions);

    return sortedTransactions;
  } catch (error) {
    console.error("Failed to retrieve transactions:", error);
    return [];
  }
};