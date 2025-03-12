// src/lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";


export const config = createConfig({
  chains: [baseSepolia], // Add other chains if needed
  transports: {
    [baseSepolia.id]: http(), // Use the default HTTP provider
  },
});