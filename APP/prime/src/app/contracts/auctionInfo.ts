import { contract } from './getContract';
import { readContract } from 'thirdweb';





export const isNewWinningBid = async (auctionId: bigint, bidAmount: bigint) => {
  try {
    const data = await readContract({
      contract,
      method: "isNewWinningBid",
      params: [auctionId, bidAmount]     
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}


export const getAuction = async (auctionId: bigint) => {
  try {
    const data = await readContract({
      contract,
      method: "getAuction",
      params: [auctionId]     
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}
export const getAllAuctions = async () => {
  try {
    const data = await readContract({
      contract,
      method: "getAllAuctions",
         
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}
export const getWinningBid = async (auctionId: bigint) => {
  try {
    const data = await readContract({
      contract,
      method: "getWinningBid",
    params: [auctionId]        
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}
export const isAuctionExpired = async (auctionId: bigint) => {
  try {
    const data = await readContract({
      contract,
      method: "isAuctionExpired",
    params: [auctionId]        
    });

    if (!data) {
      console.log("No data returned");
     
    }

    return data;
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
    throw error;
  }
}


