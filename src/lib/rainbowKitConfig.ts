// lib/rainbowKitConfig.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { http } from 'wagmi';

// Replace with your WalletConnect Project ID
const projectId = '159bf96cf1aa026dad215f2782ba2f1d';

// Create the RainbowKit configuration
const config = getDefaultConfig({
  appName: 'Defi-Direct', // Your app name
  projectId, // WalletConnect Project ID
  chains: [mainnet, polygon, optimism, arbitrum, base], // Supported chains
  ssr: true, // Enable server-side rendering (SSR) support
  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/uHo7ICSBqpDRguF-DhjWWF72l-sPapYX'), // Mainnet RPC
    [polygon.id]: http('https://polygon-mainnet.g.alchemy.com/v2/uHo7ICSBqpDRguF-DhjWWF72l-sPapYX'), // Polygon RPC
    [optimism.id]: http('https://opt-mainnet.g.alchemy.com/v2/uHo7ICSBqpDRguF-DhjWWF72l-sPapYX'), // Optimism RPC
    [arbitrum.id]: http('https://arb-mainnet.g.alchemy.com/v2/uHo7ICSBqpDRguF-DhjWWF72l-sPapYX'), // Arbitrum RPC
    [base.id]: http('https://mainnet.base.org'), // Base RPC
  },
});

export { config };