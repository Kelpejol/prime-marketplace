import { prepareContractCall, sendTransaction } from "thirdweb";
import { Account } from "thirdweb/wallets";
import { contract } from "./getContract";
import { NATIVE_TOKEN } from "./constant";
import { getListing } from "./directListing";


export const makeOffer = async (listingId: bigint, account: Account, duration : bigint, totalPrice: bigint) => {

  const data = await getListing(listingId);
    
   let fee: bigint | undefined
    if(data.currency == NATIVE_TOKEN) {
      fee= totalPrice
    } 
    else {
      fee = undefined
    }
  

     const transaction = prepareContractCall({
          contract,
          method: "makeOffer",
          params: [{
            totalPrice,
            duration,
          },
            listingId,
          ],
          value: fee
        });

    try {

             await sendTransaction({
              account,
              transaction,
            });
        
            return {
             success: true,
             message: "Offer sent" 
            }        
          
          } catch (error: any) {
            let message;
            if(error.message && error.message.includes("__Offer_InvalidListing")) {
              message = "You can't make an offer on this listing"
            }
            else if(error.message && error.message.includes("__Offer_InsufficientFunds")) {
             message = "Insufficient amount"
            }
            else {
              message = "An unexpected error occured: Try again"
            }
        
            return {
              success: false,
              message: message
            }
            
          }

}


export const cancelOffer = async (offerId: bigint, listingId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "cancelOffer",
  params: [ offerId,  listingId],


});
try {

        const { transactionHash } = await sendTransaction({
        account,
        transaction,
        }); 
        console.log(transactionHash)

        return {
        success: true,
        message: "Offer sent"
        }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Offer_InvalidListingId')) {
   message = "Error: Invalid listing"  
  }
   
   if (error?.message.includes('__Offer_UnauthorizedToCall')){
    message = "You are not authorized to cancel this offer"
  }
  else {
    message = "An unexpected error occured: Try again"
  }



  return {
    success: false,
    message: message 
  }

}
}

export const acceptOffer = async (offerId: bigint, listingId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "acceptOffer",
  params: [ offerId,  listingId],


});
  try {

        const { transactionHash } = await sendTransaction({
        account,
        transaction,
        }); 
        console.log(transactionHash)

        return {
        success: true,
        message: "Offer accepted"
        }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Offer_InvalidListingId')) {
   message = "Error: Invalid listing"  
  }
   
   if (error?.message.includes('__Offer_UnauthorizedToCall')){
    message = "You are not authorized to accept this offer"
  }
   if (error?.message.includes('__Offer_MarketPlaceUnapproved')){
    message = "Error: Offer is not valid "
  }
   if (error?.message.includes('__Offer_InsufficientFunds')){
    message = "Error: Insufficient funds"
  }
  else {
    message = "An unexpected error occured: Try again"
  }



  return {
    success: false,
    message: message 
  }

}
}
export const rejectOffer = async (offerId: bigint, listingId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "rejectOffer",
  params: [ offerId,  listingId],


});
  try {

        const { transactionHash } = await sendTransaction({
        account,
        transaction,
        }); 
        console.log(transactionHash)

        return {
        success: true,
        message: "Offer accepted"
        }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Offer_InvalidListingId')) {
   message = "Error: Invalid listing"  
  }
   
   if (error?.message.includes('__Offer_UnauthorizedToCall')){
    message = "You are not authorized to accept this offer"
  }
  
   if (error?.message.includes('__Offer_InsufficientFunds')){
    message = "Error: Insufficient funds"
  }
  else {
    message = "An unexpected error occured: Try again"
  }



  return {
    success: false,
    message: message 
  }

}
}
