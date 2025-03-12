import { fetchTokenPrice } from "@/utils/fetchTokenprice";

export const convertFiatToToken = async (fiatAmount: number, tokenId: string) => {
  try {
    if (tokenId === "USDC"){
      tokenId = "usd-coin"
    } else {
      tokenId = 'tether'
    }
    const tokenPrice = await fetchTokenPrice(tokenId); // Fetch token price in NGN
    const tokenAmount = fiatAmount / tokenPrice; // Convert fiat amount to token amount
    return Math.round(tokenAmount * 10 ** 6); // Return the token amount in the smallest unit as a proper number
  } catch (error) {
    console.error(`Error converting fiat to token:`, error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}