// src/utils/fetchTokenPrice.ts
export const fetchTokenPrice = async (tokenId: string) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=ngn`
      );
      const data = await response.json();
      return data[tokenId].ngn; // Return the price in NGN
    } catch (error) {
      console.error(`Error fetching ${tokenId} price:`, error);
      return 0; // Return 0 if there's an error
    }
  };