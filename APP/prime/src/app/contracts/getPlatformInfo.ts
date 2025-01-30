import { ContractOptions, readContract } from "thirdweb";
import { contract } from "./getContract";
import { LISTING_TYPE } from "./listing";

export const fetchListingPlanFee = async (
  price: bigint, 
  currency: string
): Promise<bigint> => {
  try {
    const fee = await readContract({
      contract,
      method:  "getPlatformFee",
      params: [currency, price]
    });
    return fee;
  } catch (error) {
    throw error;
  }
};

export const fetchListingPlanInfo = async (
  listingType: LISTING_TYPE
): Promise<bigint> => {
  try {
    
    const result = await readContract({
      contract,
      method: "getListingType",
      params: [listingType]
    });

    console.log('Raw result:', result);

    if (!result) {
      console.warn(`No data returned for listing type ${listingType}`);
    }
    
    const returnValue = result[1] as bigint;
    
    return returnValue;

  } catch (error) {
    throw error;
  }
};

export const getApprovedCurrency = async () => {
  try {
    
    const result = await readContract({
      contract,
      method: "getApprovedCurrency",
    });


     // Add type checking and null/empty array handling
    
    return result;

  } catch (error) {
    
   throw error
}
}

export const getListingType = async(params: number) => {
  try {
    const result = await readContract({
      contract,
      method: "getListingType",
      params: [params]
    });
    return result
  } catch (error) {
    throw error
  }
}

export const listings = async () => {
  try {
    console.log("Attempting to fetch listings...");
    const result = await readContract({
      contract,
      method: "getAllListings",
      params: []
    });

    console.log("Raw listings result:", result);
    
    // Add type checking and null/empty array handling
    if (!result || result.length === 0) {
      console.log("No listings found");
      return [];
    }
    
    return result;

  } catch (error) {
    throw error
    
  }
}


export async function fetchNFT(contract: Readonly<ContractOptions<[]>>, listing: any) {
  try {
    let nftData;
    if (listing.tokenType == 0) {
      nftData = (await import("thirdweb/extensions/erc721")).getNFT({
        contract,
        tokenId: listing.tokenId
      });
    }
    else if (listing.tokenType == 1) {
      nftData = (await import("thirdweb/extensions/erc1155")).getNFT({
        contract,
        tokenId: listing.tokenId
      });
    }

    return nftData;
  } catch (error) {
    throw error
  }
}

export async function getListing(listingId: bigint) {
  try{
  const data = await readContract({
    contract,
    method: "getListing",
    params: [listingId]
  });
  return data;
} catch(error: any) {
  console.error(error.message)
}
}


export const LimitedListings = async (start = 0, limit: null | number = null) => {
  try {
    const allListings = await listings();
    if(allListings.length > 0){
    const reversedListings = [...allListings].reverse();
    
    if (limit !== null) {
      return reversedListings.slice(start, start + limit);
    }
    return reversedListings;
  }
    
    return 0;
  } catch (error) {
    throw error
    
  }
};










export const getApprovedBuyer = async (listingId: bigint) => {
  try {
      const data = await readContract({
     contract,
     method:"getApprovedBuyer",
     params:[listingId]
    })

   return data;  
  }
  catch (error) {
   
    throw error;
    
  }
    
}






