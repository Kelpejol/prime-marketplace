'use client';

import { useState, useCallback, useEffect } from 'react';
import { fetchNFT, getListing } from "@/app/contracts/getPlatformInfo";
import {  toEther } from "thirdweb";
import Card from "../components/card/Card";
import Container from '../components/Container';
import CardContainer from '../components/card/CardContainer';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import useCreateListingModal from '@/app/hooks/useCreateListingModal';
import EmptyState from '../components/EmptyState';
import Error from '../components/Error';
import SkeletonCardContainer from "../components/card/CardSkeleton";
import { fetchTokenInfo } from '@/app/hooks/useCurrencyInfo';
import { ipfsToHttp } from '../utils/IpfsToHttp';
import { nftContract } from '../contracts/getContract';
import { getLimitedListings, getListingLength} from '../graphClient';
import MyListingsSidebar from './MyListingsSidebar';
import useMyListingsStore from '../hooks/useMyListingsStore';


 export type ListingItem = {
  key?: string;
  alt: string;
  id: string;
  src: string;
  pricePerToken: string;
  listingId: bigint;
  name: string;
  symbol?: any;  // Optional since it's using `currency` prop
  status: number;
  currency?: string;
  listingType?: number
}

export default function MyListings() {
  const createListing = useCreateListingModal();
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);
  const setMutate = useMyListingsStore(state => state.setMutate);
 
  const [selectedListing, setSelectedListing] = useState<ListingItem>();
  const [isVisible, setIsVisible] = useState(false);
 
const fetchActiveListingsWithCount = async (page: number, size: number) => {
  try {
    const limitedListing = await getLimitedListings(
      "0xBF2492901e51fd2f8D25B91CdBba538624b228B4",
    );

    const activeListings: any[] = [];

    const results = await Promise.allSettled(
      limitedListing.map(async (list: any) => {
        const listingResult = await getListing(list.listingId);
        console.log(listingResult)
        
        if ( listingResult?.status === 1) {
          return listingResult;
        }
        return null;
      })
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        activeListings.push(result.value);
      }
    });
    
    const totalActiveLength = activeListings.length;
    console.log(totalActiveLength)
    const paginatedActiveListings = activeListings.slice(page, size);
    console.log(paginatedActiveListings);

    return { paginatedActiveListings, totalActiveLength };
  } catch (error) {
    console.error("Error in main function:", error);
    // return { paginatedActiveListings: [], totalActiveLength: 0 };
    throw error
  }
};
   
   const handleCardClick =  (listing: ListingItem) => {
  
   
    setSelectedListing(listing);
    // Move setIsVisible after we have the data
    setIsVisible(true)
};

 
const onClose = useCallback(() => {
  setIsVisible(false); // Always set to false when closing
  // Optional: Clear the selected listing after animation
  setTimeout(() => {
    setSelectedListing(undefined);
  }, 300);
}, []);

  const fetchListingsPage = useCallback(async (key: string) => {
    try {
      const pageIndex =
        parseInt(key.split("-page-")[1]?.split("-")[0], 10) || 0;
      const start = pageIndex * PAGE_SIZE;

      const { paginatedActiveListings } = await fetchActiveListingsWithCount(
       start, PAGE_SIZE
      );

      if (!Array.isArray(paginatedActiveListings)) {
        return { items: [], totalCount: 0 };
      }

      const nftCards = await Promise.allSettled(
        paginatedActiveListings.map(async (listing) => {
          try {
            const contract = nftContract(listing.assetContract);
            const nftDetails = await fetchNFT(contract, listing);
            const currency = await fetchTokenInfo(listing.currency);

            if (!nftDetails?.metadata) {
              console.error(
                `Missing metadata for listing ${listing.listingId}`,
              );
              return null;
            }

            const price = toEther(listing.pricePerToken);
            const imageUrl = ipfsToHttp(nftDetails.metadata.image) || "";
            if(!listing){
              return null
            }
 
            return (
              <Card
                key={`${listing.listingId}-${listing.tokenId}`}
                src={imageUrl}
                name={nftDetails.metadata.name || "Unnamed NFT"}
                tokenId={`${listing.tokenId}`}
                price={price}
                listingId={listing.listingId}
                symbol={currency?.symbol || ""}
                status={listing.status}
                click={() =>
                  handleCardClick({
                    alt: nftDetails.metadata.name || "Unnamed NFT",
                    id: listing.tokenId.toString(),
                    src: imageUrl,
                    pricePerToken: price,
                    listingId: listing.listingId,
                    name: nftDetails.metadata.name || "Unnamed NFT",
                    symbol: currency?.symbol,
                    status: listing.status,
                    currency: listing.currency,
                    listingType: listing.listingType,
                  })
                }
              />
            );
          } catch (error) {
            console.error(
              `Error processing listing ${listing.listingId}:`,
              error,
            );
            // return null;
            throw error
          }
        }),
      );

      const validCards = nftCards
        .filter((result) => result.status === "fulfilled" && result.value)
        .map(
          (result) => (result as PromiseFulfilledResult<React.ReactNode>).value,
        );

      return {
        items: validCards,
        totalCount: paginatedActiveListings.length,
      };
    } catch (error) {
      console.error("Error fetching listings page:", error);
      // Return empty data instead of throwing
      // return {
      //   items: [],
      //   totalCount: 0,
      // };
      throw error
    }
  }, []);

  const totalListing = useCallback(async() => {
    try {
      const {totalActiveLength} = await fetchActiveListingsWithCount(0, 1); 
      return totalActiveLength;
      
    } catch (error) {
      console.error('Error fetching initial total count:', error);
      // return null
      throw error
    }
  }, []);

  

   const { ref, pages, isLoading, error, mutate } = useInfiniteScroll({
    fetchData:  fetchListingsPage,
    revalidateKey: 'myListings',
    getTotalCount: totalListing, // Pass the function to get total count
    initialTotalCount: undefined
    
  });

  useEffect(() => {
    setMutate(mutate);
    setInitialLoading(false);
  }, [mutate]);

  const allListings = pages?.flatMap((page) => page?.items || []);

  if (error) {
    return <Error error={error} />;
  }

  if (initialLoading || !pages && !error) {
    return (
      <Container>
        <SkeletonCardContainer />
      </Container>
    );
  }

  if (!initialLoading && allListings?.length === 0 && !error) {
    return (
      <EmptyState
        title="Oops!"
        subtitle="No listing at the moment. Try creating one"
        showButton={true}
        onClick={createListing.onOpen}
        label="Create Listing"
      />
    );
  }

  return (
    <>
      <Container>
        <div className="relative">
          {isVisible && (
            <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
          )}
          <div
            className={`relative ${isVisible ? "pointer-events-none" : ""} z-0`}
          >
            <CardContainer>{allListings}</CardContainer>
            <div ref={ref} className="h-full mb-auto w-full">
              {isLoading && <SkeletonCardContainer />}
            </div>
          </div>
        </div>
      </Container>
      {selectedListing && isVisible && (
        <MyListingsSidebar
          listing={selectedListing}
          onClose={onClose}
          isVisible={isVisible}
        />
      )}
    </>
  );
}