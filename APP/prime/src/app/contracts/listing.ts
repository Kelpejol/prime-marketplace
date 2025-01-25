import {
  sendTransaction, 
  sendAndConfirmTransaction,
  prepareContractCall,   
  readContract
} from "thirdweb";

import { Account } from "thirdweb/wallets";
import { contract, nftContract } from "./getContract";
import { fetchListingPlanFee, fetchListingPlanInfo } from "./getPlatformInfo";
import { approve, isERC721 } from "thirdweb/extensions/erc721";
import {  isERC1155, setApprovalForAll } from "thirdweb/extensions/erc1155";
import { contractAddress, NATIVE_TOKEN } from "@/app/constant";
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
 const  transactionReceipt  =  await sendAndConfirmTransaction({ transaction: approveTransaction!, account });
 if(transactionReceipt.status ==="success"){
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
   
    const  transactionReceipt  = await sendAndConfirmTransaction({
      account,
      transaction,
    });
    if(transactionReceipt.status === "success"){
       return {
     success: true,
     message: "Listing created successfully" 
    }
   
    }

     else{
      return{
        success: false,
        message: "Listed creation failed"
      }
    }

   
 } else{
    return{
      success: false,
      message: "Error approving market"
    }
 }
} catch (error: any) {
  // throw error
    
     let message ;

    if (error?.message) {
      switch (true) {
    case error.message.includes("__DirectListing_TransferFailed") :
      message = "Error transferring fee: Make sure you are sending a sufficient amount";
      break;
       default:
          message =  'Unexpected error occurred ';
    }
  


    throw new Error (
      message,
      error
    )
  }
}



  
  
  // } catch (error: any) {
  //   let message;
  //   if(error.message && error.message.includes("__DirectListing_TransferFailed") ) {
  //     message = "Error transferring fee: Make sure you are sending a sufficient amount"
  //   }
  //   else {
  //     message = "An unexpected error occured: Try again"
  //   }

  //   return {
  //     success: false,
  //     message: message
  //   }
    
  // }
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
    fee = data.pricePerToken
  } else {
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
    const transactionReceipt = await sendAndConfirmTransaction({
      account,
      transaction,
    });

    if(transactionReceipt.status === "success"){
      return {
        success: true,
        message: 'Listing purchased successfully',
      };
    } else {
      return {
        success: false,
        message: 'Error purchasing listing'
      }
    }
  } catch (error: any) {
    let message = 'Unexpected error occurred ';

    if (error?.message) {
      switch (true) {
        case error.message.includes('__DirectListing_BuyerNotApproved'):
          message = "You are not approved to buy this reserved listing";
          break;
        case error.message.includes('__DirectListing_InvalidRequirementToCompleteASale'):
          message = "Error purchasing listing: You cannot purchase this listing";
          break;
        case error.message.includes('__DirectListing_InsufficientFunds'):
          message = "Error purchasing listing: Make sure you are sending enough funds";
          break;
        default:
          message = error.message || message;
      }
    }

    console.error('Listing purchase error:', error);

    return {
      success: false,
      message: message
    }
  }
}