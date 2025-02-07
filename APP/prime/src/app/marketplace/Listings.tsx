'use client';

import { useState, useCallback, useEffect } from 'react';
import { fetchNFT, LimitedListings, listings } from "@/app/contracts/getPlatformInfo";
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
import useListingsStore from "@/app/hooks/useListingsStore"
import { ipfsToHttp } from '../utils/IpfsToHttp';
import { nftContract } from '../contracts/getContract';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '../components/WalletToast';




export default function Listings() {
  const createListing = useCreateListingModal();
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);
  const setMutate = useListingsStore(state => state.setMutate);
      const router = useRouter();
       const searchParams = useSearchParams();
       const redirected = searchParams.get("redirected");


       useEffect(() => {
        if (redirected) {
          showToast("Please log in", "Please connect your wallet to log in.");

        }
      }, [redirected]);



  const fetchListingsPage = useCallback(async (key: string) => {
    try {
      const pageIndex = parseInt(key.split('-page-')[1]?.split('-')[0], 10) || 0;
      const start = pageIndex * PAGE_SIZE;
      
      // Only fetch the listings for this specific page
      const pageListings = await LimitedListings(start, PAGE_SIZE)

      if (!Array.isArray(pageListings)) {
        return { items: [], totalCount: 0 };
      }

      const nftCards =  await Promise.all(pageListings.map(async (listing) => {
          try {
            const contract = nftContract(listing.assetContract);
            
              const nftDetails = await fetchNFT(contract, listing);
              const currency = await fetchTokenInfo(listing.currency);
            
 
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
                price={price}
                listingId={listing.listingId}
                symbol={currency?.symbol || ''}
                status={listing.status}
                showButton
                click={() => router.push(`/marketplace/listing/${listing.listingId.toString()}`)}
              />
            );
          } catch (error: any) {
            console.error(error.message)
            throw error
          }
        })
  
      )
      const validCards = nftCards.filter(Boolean);
      return {
        items: validCards,
        totalCount: pageListings.length 
      };
    } catch (error: any) {
        console.error(error.message)
        throw error
    }
  }, []); 

  const totalListing = useCallback(async() => {
    try {
      const totalListing = await listings(); // New method needed
      return totalListing.length;
    } catch (error: any) {
      
      console.error(error.message)
      throw error
    }
  }, []);

  

   const { ref, pages, isLoading, error, mutate } = useInfiniteScroll({
    fetchData: fetchListingsPage,
    revalidateKey: 'listings',
    getTotalCount: totalListing, // Pass the function to get total count
    initialTotalCount: undefined,
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