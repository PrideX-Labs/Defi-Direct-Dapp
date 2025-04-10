// lib/rainbowKitConfig.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  cronos,
  cronosTestnet,
  scroll,
  scrollSepolia,
  base,
  sepolia,
  arbitrum,
  polygon,
  bsc,
  avalanche,
  lisk,
  eduChain,
  eduChainTestnet,
  liskSepolia
} from 'wagmi/chains';
// src/lib/rainbowKitConfig.ts




// Replace with your WalletConnect Project ID
const projectId = '159bf96cf1aa026dad215f2782ba2f1d';

// Create the RainbowKit configuration
const config = getDefaultConfig({
  appName: 'Defi-Direct', // Your app name
  projectId, // WalletConnect Project ID
  chains: [
    eduChain,
    cronos,
    cronosTestnet,
    scroll,
    scrollSepolia,
    lisk,
    base,
    sepolia,
    arbitrum,
    polygon,
    bsc,
    avalanche,
    liskSepolia,
    eduChainTestnet,
    
  ], // Supported chains
  ssr: true, // Enable server-side rendering (SSR) support
 multiInjectedProviderDiscovery: true
});

export { config };