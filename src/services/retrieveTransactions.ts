// src/services/retrieveTransactions.ts

export const retrieveTransactions = async (userAddress: `0x${string}`) => {
  if (!userAddress) {
    console.error("User address is undefined. Provide a valid address.");
    return [];
  }

  try {
    // Fetch transactions from the backend
    let backendTransactions: any[] = [];
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
      .filter((tx: any) => {
        const isValid =
          tx.userAddress &&
          tx.userAddress.toLowerCase() === userAddress.toLowerCase();
        if (!isValid) {
          console.warn("Filtered out transaction:", tx);
        }
        return isValid;
      })
      .reduce((acc: any[], tx: any) => {
        const existing = acc.find((t) => t.txId === tx.txId);
        if (!existing && tx.txId) {
          acc.push(tx);
        } else if (existing && tx.isCompleted) {
          acc = acc.filter((t) => t.txId !== tx.txId);
          acc.push(tx);
        }
        return acc;
      }, []);

    console.log(
      `Deduped backend transactions for ${userAddress}:`,
      dedupedBackendTransactions
    );

    // Map to consistent format
    const formattedTransactions = dedupedBackendTransactions.map(
      (tx: any, index: number) => {
        // Validate transactionTimestamp
        const timestamp = Number(tx.transactionTimestamp) || Math.floor(Date.now() / 1000);
        const formattedTx = {
          user: userAddress,
          token: tx.token || "0x0",
          amount: BigInt(tx.amount || 0),
          amountSpent: BigInt(
            Math.round(parseFloat(tx.amountSpent || "0") * 1e18)
          ),
          transactionFee: BigInt(
            Math.round(parseFloat(tx.transactionFee || "0") * 1e18)
          ),
          transactionTimestamp: BigInt(timestamp),
          fiatBankAccountNumber: BigInt(tx.fiatBankAccountNumber || "0"),
          fiatBank: tx.fiatBank || "Unknown",
          recipientName: tx.recipientName || "Unknown",
          fiatAmount: parseFloat(tx.fiatAmount) || 0,
          isCompleted: tx.isCompleted || false,
          isRefunded: tx.isRefunded || false,
          txId: tx.txId || `tx-${index}-${timestamp}`,
        };
        console.log(`Formatted transaction ${index}:`, formattedTx);
        return formattedTx;
      }
    );

    // Sort by transactionTimestamp (newest first)
    const sortedTransactions = formattedTransactions.sort(
      (a, b) =>
        Number(b.transactionTimestamp) - Number(a.transactionTimestamp)
    );

    console.log(`Sorted transactions for ${userAddress}:`, sortedTransactions);

    return sortedTransactions;
  } catch (error) {
    console.error("Failed to retrieve transactions:", error);
    return [];
  }
};