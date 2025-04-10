// Map of chain IDs to their respective logo URLs
export const getChainLogo = (chainId: number): string => {
    const chainLogos: Record<number, string> = {
      // EduChain
      41923: "https://www.opencampus.xyz/static/media/coin-logo.39cbd6c42530e57817a5b98ac7621ca7.svg",
      // EduChain Testnet
      656476: "https://www.opencampus.xyz/static/media/coin-logo.39cbd6c42530e57817a5b98ac7621ca7.svg",
      // Cronos
      25: "https://img.cryptorank.io/coins/cronos1677768792540.png",
      // Cronos Testnet
      338: "https://img.cryptorank.io/coins/cronos1677768792540.png",
      // Scroll
      534352: "https://scroll.io/_next/static/media/Scroll_Logomark.ad5d0348.svg",
      // Scroll Sepolia
      534351: "https://scroll.io/_next/static/media/Scroll_Logomark.ad5d0348.svg",
      // Lisk
      1135: "https://thumbs.dreamstime.com/z/lisk-lsk-icon-isolated-white-background-265881406.jpg",
      // Lisk Sepolia
      4202: "https://thumbs.dreamstime.com/z/lisk-lsk-icon-isolated-white-background-265881406.jpg",
      // Base
      8453: "https://github.com/base/brand-kit/raw/main/logo/in-product/Base_Network_Logo.svg",
      // Sepolia (Ethereum Testnet)
      11155111: "https://brandlogos.net/wp-content/uploads/2021/11/ethereum-logo-768x768.png",
      // Arbitrumzx
      42161: "https://logowik.com/content/uploads/images/arbitrum4053.jpghttps://logowik.com/content/uploads/images/arbitrum4053.jpg",
      // Polygon
      137: "https://altcoinsbox.com/wp-content/uploads/2023/03/matic-logo-600x600.webp",
      // Binance Smart Chain
      56: "https://altcoinsbox.com/wp-content/uploads/2023/01/bnb-chain-binance-smart-chain-logo-600x600.webp",
      // Avalanche
      43114: "https://vectorseek.com/wp-content/uploads/2023/02/Avalanche-AVAX-Logo-Vector.jpg",
  
      // Fallbacks for major networks
      // Ethereum Mainnet
      1: "https://brandlogos.net/wp-content/uploads/2021/11/ethereum-logo-768x768.png",
      // Optimism
      10: "https://cryptologos.cc/logos/optimism-op-logo.png",
      // Polygon zkEVM
      1101: "https://altcoinsbox.com/wp-content/uploads/2023/03/matic-logo-600x600.webp",
    }

    return chainLogos[chainId] || ""
  }
  
  // Function to get chain color for UI elements
  export const getChainColor = (chainId: number): string => {
    const chainColors: Record<number, string> = {
      // EduChain
      1001: "#627EEA",
      // Cronos
      25: "#812990",
      // Scroll
      534352: "#FFAA00",
      // Lisk
      10000070: "#0484D5",
      // Base
      8453: "#0052FF",
      // Sepolia (Ethereum Testnet)
      11155111: "#627EEA",
      // Arbitrum
      42161: "#28A0F0",
      // Polygon
      137: "#8247E5",
      // Binance Smart Chain
      56: "#F3BA2F",
      // Avalanche
      43114: "#E84142",
    }
  
    return chainColors[chainId] || "#627EEA"
  }
  