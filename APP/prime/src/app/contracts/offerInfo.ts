import { contract } from './getContract';
import { readContract } from 'thirdweb';




export const getOffer = async (offerId:bigint, listingId:bigint) => {
  try {
    const data = await readContract({
      contract,
      method: "getOffer",
      params: [offerId, listingId]     
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


export const getAllOffers = async (listingId:bigint) => {
  try {
    const data = await readContract({
      contract,
      method: "getAllOffers",
      params: [listingId]     
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