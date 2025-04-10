// src/lib/wagmi.ts
import { createConfig, http } from "wagmi";
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
  liskSepolia,
  eduChain,
  eduChainTestnet
} from "wagmi/chains";
// import { eduChain, lisk } from "./customChains"; // Import custom chains

const SCROLL_SEPOLIA_RPC = [
  "https://sepolia-rpc.scroll.io",
  "https://scroll-sepolia-rpc.publicnode.com",
  "https://rpc.ankr.com/scroll_sepolia_testnet",
  "https://scroll-sepolia.blockpi.network/v1/rpc/public",
];

const SCROLL_RPC = [
  "https://rpc.scroll.io",
  "https://scroll-mainnet.public.blastapi.io",
  "https://rpc-scroll.icecreamswap.com",
];

export const config = createConfig({
  chains: [
    eduChain,          // Custom EduChain
    cronos,            // Cronos Mainnet
    cronosTestnet,     // Cronos Testnet
    scroll,            // Scroll Mainnet
    scrollSepolia,     // Scroll Sepolia Testnet
    lisk,              // Custom Lisk L2
    base,              // Base Mainnet
    sepolia,           // Sepolia Testnet
    arbitrum,          // Arbitrum Mainnet
    polygon,           // Polygon Mainnet
    bsc,               // Binance Smart Chain Mainnet
    avalanche,         // Avalanche Mainnet
    liskSepolia,      // Lisk Sepolia Testnet
    eduChainTestnet
  ],
  transports: {
    [eduChain.id]: http("https://rpc.open-campus-codex.gelato.digital", {
      retryCount: 3,
      timeout: 10_000,
    }),
    [cronos.id]: http("https://evm.cronos.org", {
      retryCount: 3,
      timeout: 10_000,
    }),
    [cronosTestnet.id]: http("https://evm-t3.cronos.org", {
      retryCount: 3,
      timeout: 10_000,
    }),
    [scroll.id]: http(SCROLL_RPC[0], {
      retryCount: 3,
      timeout: 10_000,
    }),
    [scrollSepolia.id]: http(SCROLL_SEPOLIA_RPC[0], {
      retryCount: 3,
      timeout: 10_000,
    }),
    [lisk.id]: http("https://rpc.api.lisk.com", {
      retryCount: 3,
      timeout: 10_000,
    }),
    [base.id]: http("https://mainnet.base.org", {
      retryCount: 3,
      timeout: 10_000,
    }),
    [sepolia.id]: http("https://rpc.sepolia.org", {
      retryCount: 3,
      timeout: 10_000,
    }),
    [arbitrum.id]: http("https://arb1.arbitrum.io/rpc", {
      retryCount: 3,
      timeout: 10_000,
    }),
    [polygon.id]: http("https://polygon-rpc.com", {
      retryCount: 3,
      timeout: 10_000,
    }),
    [bsc.id]: http("https://bsc-dataseed.binance.org", {
      retryCount: 3,
      timeout: 10_000,
    }),
    [avalanche.id]: http("https://api.avax.network/ext/bc/C/rpc", {
      retryCount: 3,
      timeout: 10_000,
    }),
    [liskSepolia.id]: http(),
    [eduChainTestnet.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
});