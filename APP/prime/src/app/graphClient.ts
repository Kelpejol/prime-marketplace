import { request } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'https://subgraph.satsuma-prod.com/be7b52b0aaf6/olukayodes-team--814377/prime-amoy/api';

const myListingsQuery = `
query ListingsQuery(
  $creator: String!, 
  $orderBy: String, 
) {
  newListingCreateds(
    where: { listingCreator: $creator },
    orderBy: $orderBy,
    
  ) {
    listingId
  }
}`; 

const myAuctionsQuery = `
query AuctionsQuery(
  $creator: String!   
  ) {
  newAuctions(where: {
   auctionCreator:
    $creator
  }){
    auctionId
    assetContract

  }
}`

const myOfferQuery = `
query OffersQuery(
  $sender: String!
  ){
  newOffers(
  where: {sender: $sender}
  ){
    offerId
    listingId
    }
  }`

const myOfferNotifQuery = `
  query OffersQuery($listingId_in: [String!]) {
    newOffers(
      where: { listingId_in: $listingId_in }
    ) {
      listingId
      totalPrice
      expirationTime
      blockTimestamp
      transactionHash
      offerId
    }
  }
`;

export const getMyOfferNotif = async (listingId_in: string[]) => {
  try {
    const variables = {
      listingId_in: listingId_in, 
    };
    const data: any = await request(GRAPHQL_ENDPOINT, myOfferNotifQuery, variables);
    return data.newOffers || [];
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
};


export const getMyAuctions = async (
  creatorAddress: string,
) => {
  try {
    const variables = {
      creator: creatorAddress,
    };

    const data: any = await request(GRAPHQL_ENDPOINT, myAuctionsQuery, variables);
    return data.newAuctions || [];
  } catch (error) {
    throw error
  }
}

export const getMyOffers = async (
  sender: string
) => {
  try {
    const variables = {
      sender: sender,
    }
    const data: any = await request(GRAPHQL_ENDPOINT, myOfferQuery, variables);
    return data.newOffers || [];
  } catch (error){
    throw error
  }
}

export const getMyListings = async (
  creatorAddress: string, 
  
) => {
  try {
    const variables = {
      creator: creatorAddress,
      orderBy: 'listing_startTimestamp',
    };

    const data: any = await request(GRAPHQL_ENDPOINT, myListingsQuery, variables);
    return data.newListingCreateds || [];
  } catch (error) {
    throw error
  }
};