import {
  sendTransaction,
  prepareContractCall,
} from "thirdweb";

import { Account } from "thirdweb/wallets";
import { contract } from "./getContract";




   
 export const createAuction = async (
  assetContract: string,
  tokenId: bigint,
  currency: string,
  minimumBidAmount: bigint,
  buyoutBidAmount: bigint,
  bidBufferBps: bigint,
  startTimestamp: bigint,
  endTimestamp: bigint, 
  account:Account) => {

  




    
  const transaction = prepareContractCall({
  contract,
  method: "createAuction",
  params: [{
    assetContract,
    tokenId,
    currency,
    minimumBidAmount,
    buyoutBidAmount,
    bidBufferBps,
    startTimestamp,
    endTimestamp, 
  }],
  


});

try {
    const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Auction created successfully"
  }
} catch (error: any) {
  let message;
  if (error?.message.includes('__Auction_InvalidTime')) {
   message = "Error: Invalid Time"  
  }
  if (error?.message.includes('__Auction_InvalidBuyoutBidAmount')) {
   message = "Your buyout bid cannot be less than minimum bid"  
  }
  if (error?.message.includes('__Auction_InvalidBidBuffer')) {
   message = "Error: Max bid buffer is 100 bps"  
  }
  if (error?.message.includes('__Auction_InvalidDuration')) {
   message = "Error: Max duration for auction is 90 minutes"  
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








export const cancelAuction = async (auctionId: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "cancelAuction",
  params: [auctionId],
  


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Auction cancelled"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Auction_UnAuthorizedToCall')) {
   message = "Error: You cannot cancel this auction"  
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





export const updateAuction = async (auctionId: bigint,  
  currency: string, 
  minimumBidAmount: bigint, 
  buyoutBidAmount: bigint,
  bidBufferBps: bigint,
  startTimestamp: bigint,
  endTimestamp: bigint, 
  account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "updateAuction",
  params: [auctionId, {
  currency, 
  minimumBidAmount, 
  buyoutBidAmount,
  bidBufferBps,
  startTimestamp,
  endTimestamp
}],
  


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Auction updated"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Auction_UnAuthorizedToCall')) {
   message = "Error: You cannot update this auction"  
  }
  if (error?.message.includes('__Auction_InvalidAuctionState') || error?.message.includes('__Auction_InvalidTime')) {
   message = "Error: Auction is no longer valid"  
  }
  if (error?.message.includes('__Auction_InvalidBuyoutBidAmount')) {
   message = "Your buyout bid cannot be less than minimum bid"  
  }
   if (error?.message.includes('__Auction_InvalidBidBuffer')) {
   message = "Error: Max bid buffer is 100 bps"  
  }
  if (error?.message.includes('__Auction_InvalidDuration')) {
   message = "Error: Max duration for auction is 90 minutes"  
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



export const bidInAuction = async (auctionId: bigint , bidAmount: bigint, account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "bidInAuction",
  params: [auctionId, bidAmount],
  


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Bid placed"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Auction_InvalidBidTime')) {
   message = "Error: Auction is no longer valid"  
  }
   
   if (error?.message.includes('__Auction_InvalidBidAmount')){
    message = "Error placing bid: Try adjusting your bid"
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


export const collectAuctionPayout = async (auctionId: bigint,  account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "collectAuctionPayout",
  params: [auctionId],
  


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Auction payout transferred"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Auction_InvalidAuctionState')) {
   message = "Error: Auction is no longer valid"  
  }
   
   if (error?.message.includes('__Auction_UnAuthorizedToCall')){
    message = "You are not authorized to collect payout for this listing"
  }
   if (error?.message.includes('__Auction_NoBidYet')){
    message = "Error: No bid placed"
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

export const collectAuctionTokens = async (auctionId: bigint,  account: Account) => {


  const transaction = prepareContractCall({
  contract,
  method: "collectAuctionTokens",
  params: [auctionId],
  


});
try {

const { transactionHash } = await sendTransaction({
  account,
  transaction,
}); 
console.log(transactionHash)

return {
  success: true,
  message: "Auction payout transferred"
  }
} catch (error: any) {
   let message;
  if (error?.message.includes('__Auction_InvalidAuctionState')) {
   message = "Error: Auction is no longer valid"  
  }
   
   if (error?.message.includes('__Auction_UnAuthorizedToCall')){
    message = "You are not authorized to collect payout for this listing"
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
































