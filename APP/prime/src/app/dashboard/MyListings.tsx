
'use client'
import { useEffect, useState } from "react";
import Card from "@/app/components/card/Card";
// import { anvil } from "thirdweb/chains";
// import { client } from "@/app/client";
// import { fetchNFT, listings } from "@/app/contracts/listingInfo";
// import { ipfsToHttp } from "@/app/utils/ipfsToHttp";
import useSWR from 'swr';
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
// import EmptyState from "@/app/components/EmptyState";
import Error from "@/app/components/Error";
// import {CardContainer} from "@/app/components/card/CardContainer";
// import Container from "@/app/components/Container";
// import CardSkeletonContainer from "@/app/components/card/CardSkeleton";
// // import { fetchCurrencyInfo } from "@/app/utils/currency";
// // import MyListingsSidebar from "./MyListingsSidebar";
// import image4 from "@public/image4.jpeg"
// import Image from "next/image";
import { StaticImageData } from "next/dist/shared/lib/get-img-props";
import { fetchNFT, listings } from "../contracts/getPlatformInfo";
import { getContractAddress } from "../marketplace/Listings";
import { fetchTokenInfo } from "../hooks/useCurrencyInfo";
import { ipfsToHttp } from "../utils/IpfsToHttp";
import CardContainer from "../components/card/CardContainer";
import SkeletonCardContainer from "@/app/components/card/CardSkeleton";
import MyListingsSidebar from "./MyListingsSidebar";
// import { Contract } from "../utils/Contract";

export type ListingItem = {
  key?: string;
  alt: string;
  id: string;
  src: string | StaticImageData;
  price: string;
  listingId: bigint;
  name: string;
  symbol?: any;  // Optional since it's using `currency` prop
  status: number;
  currency: string;
 
}

export default function MyListings() {
    
  const createListingModal = useCreateListingModal();
  const [selectedListing, setSelectedListing] = useState<ListingItem>();
  const [isVisible, setIsVisible] = useState(false)





  const handleCardClick = (listing: ListingItem) => {
    console.log('listingId', listing)
    setSelectedListing(listing);
    setIsVisible(true);

  }

  const onClose = () => {
    setIsVisible(false);
  }
 
  const fetchListings = async () => {
    try {
      const listingsData = await listings();
      if (!listingsData || listingsData.length === 0) {
        return [];
      }
   
      const results = await Promise.allSettled(listingsData.map(async (listing) => {
        try {
          const contract = getContractAddress(listing.assetContract)
            
          const nft = await fetchNFT(contract, listing);
          const currency = await fetchTokenInfo(listing.currency)
          
          if (!nft?.metadata) {
            console.error('Missing NFT metadata for listing:', listing.listingId);
            return null;
          }

          return {
            key: listing.listingId.toString(),
            alt: nft.metadata.name || '',
            id: listing.tokenId.toString(),
            src: ipfsToHttp(nft.metadata.image || ''),
            price: listing.pricePerToken.toString(),
            listingId: listing.listingId,
            name: nft.metadata.name || '',
            symbol: currency.symbol,
            status: listing.status,
            currency: listing.currency
          };
        } catch (error) {
          console.error('Error fetching listing:', listing.listingId, error);
          return null;
        }
      }));

      return results.filter(result => result.status === 'fulfilled').map(result => result.value).reverse();
    } catch (error) {
      console.error('Error fetching listings:', error);
      return [];
    }
  };

  const { data: listing, error, mutate,isLoading } = useSWR(
    'listings',
    fetchListings,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

//   useEffect(() => {
//     createListingModal.setMutateListings(mutate);
//   }, [mutate]);

  if(isLoading) return (
  <CardContainer> 
    <SkeletonCardContainer/> 
  </CardContainer>)

console.log(listing?.length)
  console.log(listing)

  if (error) return <Error error={error} />;

  
  // if (listing?.length === 0) return (
  //   <EmptyState
  //      title="Oops!"
  //     subtitle="No listing at the moment. Try creating one"
  //     label="Create listing"
  //     showButton
  //     onClick={createListingModal.onOpen}
  //   />
  // );

  
  // return (
    // <div className = "w-full flex justify-between overflow-x-hidden">
              {/* <Image 
              
                src={image4}
                alt="NFT artwork 1"
                onClick={() => handleCardClick({alt: "", id: "", src: image4, price: "", listingId: BigInt(1), name: "", symbol: "", status: 1})}
                width={500}
                height={500}
              /> */}

   return ( 
    <>
     <CardContainer>
      
      
      {listing && listing.map((item) => (
      item &&(<Card
          key={item?.key}
        //   alt={item?.alt}
          tokenId={item?.id}
          src={item?.src}
          price={item?.price}
          listingId={item?.listingId}
          name={item?.name}
          symbol={item?.symbol}
          status={item?.status}
        //   variant={"secondary"}
        //   onClick={() => handleCardClick(item)}
        />)
       

        
      ))}
    </CardContainer>
     
     <MyListingsSidebar listing={selectedListing!}  onClose={() => onClose()} isVisible={isVisible}/>
     </>
      
    // </div>
  );
}


