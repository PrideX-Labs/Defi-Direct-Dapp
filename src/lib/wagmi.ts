// src/lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { scrollSepolia } from "wagmi/chains";


export const config = createConfig({
  chains: [scrollSepolia], // Add other chains if needed
  transports: {
    [scrollSepolia.id]: http(), // Use the default HTTP provider
  },
  multiInjectedProviderDiscovery: true
  
});