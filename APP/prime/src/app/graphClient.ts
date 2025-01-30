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

const myListingLengthQuery = `
query ListingsLengthQuery($creator: String!) {
newListingCreateds( where: { listingCreator: $creator }){
listingId
}
}`

export const getListingLength = async (creatorAddress: string) => {
  try {
    const variables = { creator: creatorAddress };
    const data: any = await request(GRAPHQL_ENDPOINT, myListingLengthQuery, variables);
    console.log(data.newListingCreateds?.length)
    return data.newListingCreateds?.length || 0;
    
  } catch (error) {
   throw error
   
  }
};

export const getLimitedListings = async (
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