import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/paydirect";

dotenv.config();

const privateKey = process.env.NEXT_PUBLIC_TRANSACTION_MANAGER_PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_JSON_RPC_SERVER_URL
);

if (!privateKey) {
  throw new Error("TRANSACTION_MANAGER_PRIVATE_KEY is not defined");
}
const signer = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

export const completeTransaction = async (
  transactionId: string,
  amountSpent: number
) => {
  try {
    // Ensure transactionId is properly formatted as bytes32
    const encodedTxId = ethers.AbiCoder.defaultAbiCoder().encode(
      ["bytes32"],
      [transactionId]
    );
    const tx = await contract.completeTransaction(encodedTxId, BigInt(amountSpent));
    console.log("Transaction:", tx);

    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt);

    return receipt;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};