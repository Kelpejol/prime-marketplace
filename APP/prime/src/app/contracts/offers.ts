import { prepareContractCall, sendAndConfirmTransaction, toWei } from "thirdweb";
import { Account } from "thirdweb/wallets";
import { contract } from "./getContract";
import { NATIVE_TOKEN } from "@/app/constant";
import {getListing} from "./getPlatformInfo"


export const makeOffer = async (listingId: bigint, account: Account, duration : bigint, totalPrice: bigint) => {

  const data = await getListing(listingId);
    console.log(data)
   let fee: bigint | undefined
   console.log(fee)
    if(data?.currency.toLowerCase() == NATIVE_TOKEN.toLowerCase()) {
      fee = totalPrice
      console.log(fee)
    } 
    else {
      fee = undefined
    }
    console.log(fee)
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

            const  transactionReceipt  = await sendAndConfirmTransaction({
      account,
      transaction,
    });
    if(transactionReceipt.status === "success"){
       return {
     success: true,
     message: "Offer sent successfully" 
    }
   
    }

     else{
      return{
        success: false,
        message: "Offer failed to send"
      }
    }

          
          } catch (error: any) {
           let message ;
        if (error?.message) {
        switch (true) {
        case error.message.includes("__Offer_InvalidListing"):
              message = "You can't make an offer on this listing"
            break
             case error.message.includes("__Offer_InsufficientFunds"):
             message = "Insufficient amount"
            break
            default:
              message = "An unexpected error occured: Try again"          
            console.log(error)
            
          }
           
        }

         throw new Error (
      message,
      error
    )
  }

}


export const cancelOffer = async (offerId: bigint, listingId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "cancelOffer",
  params: [ offerId,  listingId],


});
try {

       const  transactionReceipt  = await sendAndConfirmTransaction({
      account,
      transaction,
    });
    if(transactionReceipt.status === "success"){
       return {
     success: true,
     message: "Offer cancelled succesfully" 
    }
   
    }

     else{
      return{
        success: false,
        message: "Offer failed to cancel"
      }
    }

} catch (error: any) {
  console.log(error)
   let message ;
        if (error?.message) {
        switch (true) {
        case error.message.includes('__Offer_InvalidListingId'):
       message = "Error: Invalid listing"  
      break
   
    case error.message.includes('__Offer_UnauthorizedToCall'):
    message = "You are not authorized to cancel this offer"
     break
    default: 
    message = "An unexpected error occured: Try again"
  
console.log(message)
        }
      }

   throw new Error (
      message,
      error
    )
}
}

export const acceptOffer = async (offerId: bigint, listingId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "acceptOffer",
  params: [ offerId,  listingId],


});
  try {

       const  transactionReceipt  = await sendAndConfirmTransaction({
      account,
      transaction,
    });
    if(transactionReceipt.status === "success"){
       return {
     success: true,
     message: "Offer successfully accepted" 
    }
   
    }

     else{
      return{
        success: false,
        message: "Offer failed to be accepted"
      }
    }

} catch (error: any) {
  let message;
    if (error?.message) {
        switch (true) {
        case error.message.includes('__Offer_InvalidListingId'):
       message = "Error: Invalid listing"  
        break
   
    case error.message.includes('__Offer_UnauthorizedToCall'):
    message = "You are not authorized to accept this offer"
      break
    case error.message.includes('__Offer_MarketPlaceUnapproved'):
    message = "Error: Offer is not valid "
      break
    case error.message.includes('__Offer_InsufficientFunds'):
    message = "Error: Insufficient funds"
      break
   default:
    message = "An unexpected error occured: Try again"
  

        }
      }

   throw new Error (
      message,
      error
    )
}
}
export const rejectOffer = async (offerId: bigint, listingId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "rejectOffer",
  params: [ offerId,  listingId],


});
  try {

       const  transactionReceipt  = await sendAndConfirmTransaction({
      account,
      transaction,
    });
    if(transactionReceipt.status === "success"){
       return {
     success: true,
     message: "Offer successfully rejected" 
    }
   
    }

     else{
      return{
        success: false,
        message: "Offer failed to be rejected"
      }
    }

} catch (error: any) {
  let message;
    if (error?.message) {
        switch (true) {
        case error.message.includes('__Offer_InvalidListingId'):
       message = "Error: Invalid listing"  
       break
  
   
   case error.message.includes('__Offer_UnauthorizedToCall'):
    message = "You are not authorized to accept this offer"
      break
  
   case error.message.includes('__Offer_InsufficientFunds'):
    message = "Error: Insufficient funds"
      break
  default: 
    message = "An unexpected error occured: Try again"
  }
    }


  throw new Error (
      message,
      error
    )

}
}
