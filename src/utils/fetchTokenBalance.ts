// src/utils/fetchTokenBalance.ts
import { readContract } from "@wagmi/core";
import { TOKEN_ADDRESSES } from "@/config";
import { config } from "@/lib/wagmi"; // Import your Wagmi config

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

export const fetchTokenBalance = async (token: "USDC" | "USDT", address: string) => {
  try {
    const balance = (await readContract(config, {
      address: TOKEN_ADDRESSES[token],
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address as `0x${string}`], 
    })) as bigint; // Cast the result to `bigint`

    return balance.toString(); // Convert BigInt to string
  } catch (error) {
    console.error(`Error fetching ${token} balance:`, error);
    return "0"; // Return 0 if there's an error
  }
};