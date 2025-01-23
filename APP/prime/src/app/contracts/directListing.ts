
import {
  sendTransaction, 
  prepareContractCall,   
  readContract
} from "thirdweb";

import { Account } from "thirdweb/wallets";
import { contract, nftContract } from "./getContract";
import { fetchListingPlanFee, fetchListingPlanInfo } from "./getPlatformInfo";
import { approve, isERC721 } from "thirdweb/extensions/erc721";
import {  isERC1155, setApprovalForAll } from "thirdweb/extensions/erc1155";
import { contractAddress, NATIVE_TOKEN } from "./constant";
import { toWei } from "thirdweb/utils";


export enum ListingType {
  BASIC = 0,
  ADVANCED = 1,
  PRO = 2
}



export const createListing = async (
  {
    assetContract,
    tokenId,
    currency,
    pricePerToken,
    listingType,
    reserved
  }: { 
    assetContract: string,
    tokenId: bigint,
    currency: string,
    pricePerToken: number,
    listingType: ListingType,
    reserved: boolean
  }, 
  account: Account
) => {
 
    // Fetch listing plan info and fee
    const listingPlanInfoData = await fetchListingPlanInfo(listingType);
    const listingFee = await fetchListingPlanFee(listingPlanInfoData, currency);

    let fee: bigint | undefined;
    if(currency == NATIVE_TOKEN) {
      fee = listingFee
    } else {
      fee = undefined
    }

   const tokenContract = nftContract(assetContract)

    const erc721 = await isERC721({
      contract: tokenContract
    })

    const erc1155 = await isERC1155({
      contract: tokenContract
    })
    let approveTransaction;
    if(erc721) {
       approveTransaction = approve({
 contract: tokenContract,
 to: contractAddress,
 tokenId,
 
});
    } else if(erc1155) {
      approveTransaction = setApprovalForAll({
      contract: tokenContract,
      operator: contractAddress,
     approved: true,
      })
    }

 
try {
  await sendTransaction({ transaction: approveTransaction!, account });
} catch (error) {
  return {
    message: "Error approving market: Market must be approved to proceed with transaction"
  }
}

const priceInWei = toWei(pricePerToken.toString());

    
    const transaction = prepareContractCall({
      contract,
      method: "createListing",
      params: [{
        assetContract,
        tokenId,
        currency,
        pricePerToken: priceInWei,
        listingType,
        reserved
      }],
      value: fee, 
    });
    try {
   
     await sendTransaction({
      account,
      transaction,
    });

    return {
     success: true,
     message: "Listing created successfully" 
    }

  
  
  } catch (error: any) {
    let message;
    if(error.message && error.message.includes("__DirectListing_TransferFailed") ) {
      message = "Error transferring fee: Make sure you are sending a sufficient amount"
    }
    else {
      message = "An unexpected error occured: Try again"
    }

    return {
      success: false,
      message: message
    }
    
  }
};

export async function getListing(listingId: bigint) {
  const data = await readContract({
    contract,
    method: "getListing",
    params: [listingId]
  });
  return data;
}

export const buyFromListing = async (recipientAddress: string, listingId: bigint, account: Account) => {

  const data = await getListing(listingId);
  
 let fee: bigint | undefined
  if(data.currency == NATIVE_TOKEN) {
    fee= data.pricePerToken
  } 
  else {
    fee = undefined
  }

   const transaction = prepareContractCall({
      contract,
      method: "buyFromListing",
      params: [ 
       listingId,
       recipientAddress
      ],
      value: fee, 
    });
   
    try {
      await sendTransaction({
      account,
      transaction,
    });
     return {
      success: true,
      message: 'Listing purchased successfully',

    };

    } catch (error: any) {
      let message;
      if(error?.message.includes('__DirectListing_BuyerNotApproved')) {
        message = "You are not approved to buy this reserved listing"
      }
      if(error?.message.includes('__DirectListing_InvalidRequirementToCompleteASale')) {
        message = "Error purchasing listing: You cannot purchase this listing"
      }
      if(error?.message.includes('__DirectListing_InsufficientFunds')){
        message = "Error purchasing listing: Make sure you are sending enough funds"
      }

      return {
        success: false,
        message: message
      }
    }
   
}

