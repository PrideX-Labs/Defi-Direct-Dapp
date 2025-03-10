// src/lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet], // Add other chains if needed
  transports: {
    [mainnet.id]: http(), // Use the default HTTP provider
  },
});