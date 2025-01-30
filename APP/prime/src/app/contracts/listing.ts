import {
  sendTransaction, 
  sendAndConfirmTransaction,
  prepareContractCall,   
  readContract
} from "thirdweb";

import { Account } from "thirdweb/wallets";
import { contract, nftContract } from "./getContract";
import { fetchListingPlanFee, fetchListingPlanInfo, getListing } from "./getPlatformInfo";
import { approve, isERC721 } from "thirdweb/extensions/erc721";
import {  isERC1155, setApprovalForAll } from "thirdweb/extensions/erc1155";
import { contractAddress, NATIVE_TOKEN } from "@/app/constant";
import { toWei } from "thirdweb/utils";


export enum  LISTING_TYPE {
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
    listingType: LISTING_TYPE,
    reserved: boolean
  }, 
  account: Account
) => {

  try {
 
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
}



  
  
  


export const buyFromListing = async (recipientAddress: string, listingId: bigint, account: Account) => {
  try {
  const data = await getListing(listingId);
  
  let fee: bigint | undefined
  if(data?.currency == NATIVE_TOKEN) {
    fee = data?.pricePerToken
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

    throw new Error (
      message,
      error
    )
  }
}







export const updateListing = async (listingId: bigint,  currency: string,  pricePerToken: bigint,  account: Account) => {

  const price = toWei(pricePerToken.toString());

  const transaction = prepareContractCall({
  contract,
  method: "updateListing",
  params: [listingId, {currency, pricePerToken: price}],
  
});


try {

const transactionReceipt = await sendAndConfirmTransaction({
      account,
      transaction,
    });

    if(transactionReceipt.status === "success"){
      return {
        success: true,
        message: 'Listing updated successfully',
      };
    } else {
      return {
        success: false,
        message: 'Error updating listing'
      }
    }
} catch (error: any) {
   let message;

  switch (true) {
    case error?.message.includes('__DirectListing_NotAuthorizedToUpdate'):
      message = "You are not authorized to update this listing";
      break;
    case error?.message.includes('__DirectListing_InvalidId'):
      message = "Error: Invalid listing";
      break;
    case error?.message.includes('__DirectListing_InvalidListingCurrency'):
      message = "Error: Invalid currency";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

 throw new Error(message, error)
}

}




export const updateListingPlan = async (listingId: bigint,  listingPlan:LISTING_TYPE,  account: Account) => {

  try {
   

    const listing = await readContract({
     contract,
     method:"getListing",
      params: [listingId]
    })

    
    let fee: bigint | undefined ;

  if (listing.currency == NATIVE_TOKEN){


    const data = await readContract({
     contract,
     method:"getListingType",
      params: [listingPlan]
    })
   
     fee = await readContract({
     contract,
     method:"getPlatformFee",
      params: [listing.currency, data[1]]
    })
     
   }
   else {
    fee = undefined;
   }


  const transaction = prepareContractCall({
  contract,
  method: "updatedListingPlan",
  params: [listingId, listingPlan],
  value: fee
  
});




const transactionReceipt = await sendAndConfirmTransaction({
      account,
      transaction,
    });

    if(transactionReceipt.status === "success"){
      return {
        success: true,
        message: 'Listing plan updated successfully',
      };
    } else {
      return {
        success: false,
        message: 'Error updating listing plan'
      }
    }
} catch (error: any) {
   let message;

  switch (true) {
    case error?.message.includes('__DirectListing_NotAuthorizedToUpdate'):
      message = "You are not authorized to update this listing";
      break;
    case error?.message.includes('__DirectListing_TransferFailed'):
      message = "Error: Transfer failed";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

  throw new Error(message, error)

}

}



export const cancelListing = async (listingId: bigint, account: Account) => {
try {
  const transaction = prepareContractCall({
  contract,
  method: "cancelListing",
  params: [listingId],
  
});




const transactionReceipt = await sendAndConfirmTransaction({
      account,
      transaction,
    });

    if(transactionReceipt.status === "success"){
      return {
        success: true,
        message: 'Listing cancelled successfully',
      };
    } else {
      return {
        success: false,
        message: 'Error cancelling listing'
      }
    }
} catch (error: any) {
   let message;

  switch (true) {
    case error?.message.includes('__DirectListing_NotAuthorizedToCancel'):
      message = "You are not authorized to cancel this listing";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

 throw new Error(message, error);
 

}

}



export const approveBuyerForListing = async (listingId: bigint, buyer: string, account: Account) => {
try {
  const transaction = prepareContractCall({
  contract,
  method: "approveBuyerForListing",
  params: [listingId, buyer],
  
});




const transactionReceipt = await sendAndConfirmTransaction({
      account,
      transaction,
    });

    if(transactionReceipt.status === "success"){
      return {
        success: true,
        message: 'Buyer approved successfully',
      };
    } else {
      return {
        success: false,
        message: 'Error approving buyer'
      }
    }
} catch (error: any) {
   let message;

  switch (true) {
    case error?.message.includes('__DirectListing_NotAuthorizedToApproveBuyerForListing'):
      message = "You are not authorized to approve a buyer";
      break;
    case error?.message.includes('__DirectListing_InvalidAddress'):
      message = "Error: Invalid address";
      break;
    case error?.message.includes('__DirectListing_CanOnlyApproveABuyer'):
      message = "Error: You can only approve a buyer";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

 throw new Error(message, error)

}

}



export const removeApprovedBuyerForListing = async (listingId: bigint, account: Account) => {
try {
  const transaction = prepareContractCall({
  contract,
  method: "removeApprovedBuyerForListing",
  params: [listingId],
  
});




const transactionReceipt = await sendAndConfirmTransaction({
      account,
      transaction,
    });

    if(transactionReceipt.status === "success"){
      return {
        success: true,
        message: 'Buyer removed successfully',
      };
    } else {
      return {
        success: false,
        message: 'Error removing buyer'
      }
    }
} catch (error: any) {
   let message;

  switch (true) {
    case error?.message.includes('__DirectListing_NotAuthorizedToRemoveBuyerForListing'):
      message = "You are not authorized to unapprove a buyer";
      break;
    case error?.message.includes('__DirectListing_CanOnlyRemoveApprovedBuyer'):
      message = "Error: You can only remove an approved buyer";
      break;
    default:
      message = "An unexpected error occured: Try again";
  }

  throw new Error(message, error)

}

}