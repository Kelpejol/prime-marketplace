'use client';

import { useState, useCallback, useEffect } from 'react';
import { fetchNFT, LimitedListings, listings } from "../contracts/getPlatformInfo";
import { getContract, toEther } from "thirdweb";
import { client } from "../client";
import Card from "../components/card/Card";
import Container from '../components/Container';
import CardContainer from '../components/card/CardContainer';
import { useInfiniteScroll } from '@/app/hooks/useInfiniteScroll';
import useCreateListingModal from '@/app/hooks/useCreateListingModal';
import EmptyState from '../components/EmptyState';
import Error from '../components/Error';
import SkeletonCardContainer from "../components/card/CardSkeleton";
import { fetchTokenInfo } from '@/app/hooks/useCurrencyInfo';
import { anvil } from 'thirdweb/chains';
import useListingsStore from "@/app/hooks/useListingsStore"
import { ipfsToHttp } from '../utils/IpfsToHttp';
import { chain } from '../contracts/constant';


export function getContractAddress(address: string) {
  return getContract({
    address,
    chain,
    client,
  });
}

export default function Listings() {
  const createListing = useCreateListingModal();
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);
  const setMutate = useListingsStore(state => state.setMutate);


  const fetchListingsPage = useCallback(async (key: string) => {
    try {
      const pageIndex = parseInt(key.split('-page-')[1]?.split('-')[0], 10) || 0;
      const start = pageIndex * PAGE_SIZE;
      
      // Only fetch the listings for this specific page
      const pageListings = await LimitedListings(start, PAGE_SIZE)

      if (!Array.isArray(pageListings)) {
        return { items: [], totalCount: 0 };
      }

      const nftCards = await Promise.all(pageListings.map(async (listing) => {
          try {
            const contract = getContractAddress(listing.assetContract);
            const [nftDetails, currency] = await Promise.all([
              fetchNFT(contract, listing),
              fetchTokenInfo(listing.currency),
            ]);
 
            if (!nftDetails?.metadata) {
              console.error(`Missing metadata for listing ${listing.listingId}`);
              return null;
            }
            // const formattedPrice = Number(listing.pricePerToken) / 10 ** 18;
            const price = toEther(listing.pricePerToken)
            return (
              <Card
                key={`${listing.listingId}-${listing.tokenId}`}
                src={ipfsToHttp(nftDetails.metadata.image) || ''}
                name={nftDetails.metadata.name || 'Unnamed NFT'}
                tokenId={`${listing.tokenId}`}
                price={`${price}`}
                listingId={listing.listingId}
                symbol={currency?.symbol || ''}
                status={listing.status}
              />
            );
          } catch (error) {
            console.error(`Error processing listing ${listing.listingId}:`, error);
            return null;
          }
        })
  )

      const validCards = nftCards.filter(Boolean);
      return {
        items: validCards,
        totalCount: pageListings.length 
      };
    } catch (error) {
      console.error('Error fetching listings page:', error);
      throw error;
    }
  }, []);

  const { ref, pages, isLoading, error, setTotalCount, mutate } = useInfiniteScroll({
    fetchData: fetchListingsPage,
    initialTotalCount: null,
    revalidateKey: 'listings',
  });

  // useEffect(() => {
    
  // }, []); 

  

  useEffect(() => {
    const initializeTotalCount = async () => {
      try {
        const totalListing = await listings(); // New method needed
        setTotalCount(totalListing.length); 
      } catch (error) {
        console.error('Error fetching initial total count:', error);
      } finally {
        setInitialLoading(false);
      } 
    };
    setMutate(mutate);
    initializeTotalCount();
  }, [mutate]);

  const allListings = pages?.flatMap((page) => page?.items || []);

  if (error) {
    return <Error error={error} />;
  }

  if (initialLoading || !pages) {
    return (
      <Container>
        <SkeletonCardContainer />
      </Container>
    );
  }

  if (!initialLoading && allListings?.length === 0) {
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
    <Container>
      <CardContainer>
        {allListings}
      </CardContainer>
      <div ref={ref} className="h-full mb-auto w-full">
        {isLoading && <SkeletonCardContainer />}
      </div>
    </Container>
  );
}