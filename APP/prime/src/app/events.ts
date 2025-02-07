import { prepareEvent, watchContractEvents } from "thirdweb";
import { contract } from "./contracts/getContract";
import { getMyListings } from "./graphClient";


const myListings = await getMyListings("0xBF2492901e51fd2f8D25B91CdBba538624b228B4")



const newOfferEvent = prepareEvent({
  signature: "event NewOffer(uint256 indexed totalPrice, uint256 indexed expirationTime, uint256 indexed listingId, address sender, uint256 offerId)",
  filters: {
    listingId: myListings.map((listing: any) => listing.listingId),
  }
});


export const offerEvents = await watchContractEvents({
  contract, 
  events: [newOfferEvent],
  onEvents: (events) => {
    events.forEach((event) => {
      const { args } = event;
      const { listingId, sender, offerId, totalPrice, expirationTime } = args;
      
    
    });
  },
});