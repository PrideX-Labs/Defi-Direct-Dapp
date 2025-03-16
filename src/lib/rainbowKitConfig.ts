// lib/rainbowKitConfig.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {scrollSepolia } from 'wagmi/chains';


// Replace with your WalletConnect Project ID
const projectId = '159bf96cf1aa026dad215f2782ba2f1d';

// Create the RainbowKit configuration
const config = getDefaultConfig({
  appName: 'Defi-Direct', // Your app name
  projectId, // WalletConnect Project ID
  chains: [scrollSepolia], // Supported chains
  ssr: true, // Enable server-side rendering (SSR) support
 multiInjectedProviderDiscovery: true
});

export { config };