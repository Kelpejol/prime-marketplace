
// 'use client'
// import { useEffect } from "react";
// import Card from "@/app/components/card/Card";
// import { anvil } from "thirdweb/chains";
// import { client } from "@/app/client";
// // import { fetchNFT, listings } from "@/app/contracts/listingInfo";
// // import { ipfsToHttp } from "@/app/utils/ipfsToHttp";
// import useSWR from 'swr';
// import useCreateListingModal from "@/app/hooks/useCreateListingModal";
// import EmptyState from "@/app/components/EmptyState";
// import Error from "@/app/components/Error";
// // import {CardContainer} from "@/app/components/card/CardContainer";
// import Container from "@/app/components/Container";
// import CardSkeletonContainer from "@/app/components/card/CardSkeleton";
// import { fetchNFT, listings } from "../contracts/getPlatformInfo";
// import { getContractAddress } from "../marketplace/Listings";
// import { fetchTokenInfo } from "../hooks/useCurrencyInfo";
// import { ipfsToHttp } from "../utils/IpfsToHttp";
// // import { fetchCurrencyInfo } from "@/app/utils/currency";
// // import { Contract } from "../utils/Contract";


// export default function MyAuctions() {
//   const createListingModal = useCreateListingModal();
 
//   const fetchListings = async () => {
//     try {
//       const listingsData = await listings();
//       if (!listingsData || listingsData.length === 0) {
//         return [];
//       }
   
//       const results = await Promise.allSettled(listingsData.map(async (listing) => {
//         try {
//           const contract = getContractAddress(listing.assetContract);
           
//           const nft = await fetchNFT(contract, listing);
//           const currency = await fetchTokenInfo(listing.currency)
          
//           if (!nft?.metadata) {
//             console.error('Missing NFT metadata for listing:', listing.listingId);
//             return null;
//           }

//           return {
//             key: listing.listingId.toString(),
//             alt: nft.metadata.name || '',
//             id: listing.tokenId.toString(),
//             src: ipfsToHttp(nft.metadata.image || ''),
//             price: listing.pricePerToken.toString(),
//             listingId: listing.listingId,
//             name: nft.metadata.name || '',
//             symbol: currency.symbol,
//             status: listing.status
//           };
//         } catch (error) {
//           console.error('Error fetching listing:', listing.listingId, error);
//           return null;
//         }
//       }));

//       return results.filter(result => result.status === 'fulfilled').map(result => result.value).reverse();
//     } catch (error) {
//       console.error('Error fetching listings:', error);
//       return [];
//     }
//   };

//   const { data: listing, error, mutate,isLoading } = useSWR(
//     'listings',
//     fetchListings,
//     {
//       revalidateOnFocus: false,
//       revalidateOnReconnect: true,
//     }
//   );

//   // useEffect(() => {
//   //   createListingModal.setMutateListings(mutate);
//   // }, [mutate]);

//   if(isLoading) return (
//   <CardContainer> 
//     <CardSkeletonContainer/> 
//   </CardContainer>)

// console.log(listing?.length)
//   console.log(listing)

//   if (error) return <Error error={error} />;

  
//   if (listing?.length === 0) return (
//     <EmptyState
//       title="Oops!"
//       subtitle="No listing at the moment. Try creating one"
//       label="Create listing"
//       showButton
//       onClick={createListingModal.onOpen}
//     />
//   );

  
//   return (
    
//     <CardContainer>
//       {listing && listing.map((item) => (
//         item && (<Card
//           key={item?.key}
//           alt={item?.alt}
//           id={item?.id}
//           src={item?.src}
//           price={item?.price}
//           listingId={item?.listingId}
//           name={item?.name}
//           currency={item?.symbol}
//           status={item?.status}
//           variant="secondary"
//         />)
//       ))}
//     </CardContainer>
//   );
// }


