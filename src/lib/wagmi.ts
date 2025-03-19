// src/lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { cronosTestnet } from "wagmi/chains";


export const config = createConfig({
  chains: [cronosTestnet], // Add other chains if needed
  transports: {
    [cronosTestnet.id]: http(), // Use the default HTTP provider
  },
  multiInjectedProviderDiscovery: true
  
});