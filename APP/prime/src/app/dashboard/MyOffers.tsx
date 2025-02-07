"use client";

import { useState, useCallback, useEffect } from "react";
import { fetchNFT, getListing } from "@/app/contracts/getPlatformInfo";
import { toEther } from "thirdweb";
import Card from "../components/card/Card";
import Container from "../components/Container";
import CardContainer from "../components/card/CardContainer";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import EmptyState from "../components/EmptyState";
import Error from "../components/Error";
import SkeletonCardContainer from "../components/card/CardSkeleton";
import { fetchTokenInfo } from "@/app/hooks/useCurrencyInfo";
import { ipfsToHttp } from "../utils/IpfsToHttp";
import { nftContract } from "../contracts/getContract";
import { getMyOffers } from "../graphClient";
import useMyListingsStore from "../hooks/useMyListingsStore";
import { getOffer } from "../contracts/offerInfo";
import {ListingItem} from "./MyListings"
import MyOffersSidebar from "./MyOffersSidebar";
import authAddress from "../utils/authAddress";



type offerItem = {
  offerId: bigint;
  price: bigint
  offerStatus: number
}

export interface Offers extends offerItem, ListingItem {}




export default function MyOffers() {
  const createListing = useCreateListingModal();
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Offers>();
  const setMutate = useMyListingsStore((state) => state.setMutate);


  const [isVisible, setIsVisible] = useState(false);


const handleCardClick =  (offer: Offers) => {
  
   
    setSelectedOffer(offer);
    // Move setIsVisible after we have the data
    setIsVisible(true)
};

 
const onClose = useCallback(() => {
  setIsVisible(false); // Always set to false when closing
  // Optional: Clear the selected listing after animation
  setTimeout(() => {
    setSelectedOffer(undefined);
  }, 300);
}, []);  


  const fetchActiveOffersWithCount = async (page: number, size: number) => {
    try {
          const address = await authAddress()
         

      const limitedOffer = await getMyOffers(
       address!);

      const activeOffers: any[] = [];

      const results = await Promise.allSettled(
        limitedOffer.map(async (offer: any) => {
          const offerResult = await getOffer(offer.offerId, offer.listingId);
          console.log(offerResult);

          
          return {...offerResult, offerId: offer.offerId};
        }),
      );

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          activeOffers.push(result.value);
        }
      });

      const totalActiveLength = activeOffers.length;
      console.log(totalActiveLength);
      const paginatedActiveOffers = activeOffers.slice(page, size);
      console.log(paginatedActiveOffers);

      return { paginatedActiveOffers, totalActiveLength };
    } catch (error) {
      console.error("Error in main function:", error);
      throw error;
    }
  };



  const fetchOffersPage = useCallback(async (key: string) => {
    try {
      const pageIndex =
        parseInt(key.split("-page-")[1]?.split("-")[0], 10) || 0;
      const start = pageIndex * PAGE_SIZE;

      const { paginatedActiveOffers } = await fetchActiveOffersWithCount(
        start,
        PAGE_SIZE,
      );

      if (!Array.isArray(paginatedActiveOffers)) {
        return { items: [], totalCount: 0 };
      }

      const nftCards = await Promise.allSettled(
        paginatedActiveOffers.map(async (offer) => {
          try {
            const listing = await getListing(offer.listingId);
            if(!listing){
              return null 
            }
            const contract = nftContract(listing.assetContract);
            const nftDetails = await fetchNFT(contract, listing);
            const currency = await fetchTokenInfo(listing.currency);

            if (!nftDetails?.metadata) {
              console.error(
                `Missing metadata for listing ${listing?.listingId}`,
              );
              return null;
            }

            const price = toEther(listing.pricePerToken);
            const imageUrl = ipfsToHttp(nftDetails.metadata.image) || "";
            if (!listing) {
              return null;
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
                click={() => {
                  const listingItem: Offers = {
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
                    price: offer.totalPrice,
                    offerId: offer.offerId,
                    offerStatus: offer.status
                  };
                  handleCardClick(listingItem);
                }}
              />
            );
          } catch (error) {
            console.error(
              `Error processing listing ${offer.listingId}:`,
              error,
            );
            // return null;
            throw error;
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
        totalCount: paginatedActiveOffers.length,
      };
    } catch (error) {
      console.error("Error fetching listings page:", error);

      throw error;
    }
  }, []);

  const totalOffer = useCallback(async () => {
    try {
      const { totalActiveLength } = await fetchActiveOffersWithCount(0, 1);
      return totalActiveLength;
    } catch (error) {
      console.error("Error fetching initial total count:", error);
      throw error;
    }
  }, []);

  const { ref, pages, isLoading, error, mutate } = useInfiniteScroll({
    fetchData: fetchOffersPage,
    revalidateKey: "myOffers",
    getTotalCount: totalOffer, // Pass the function to get total count
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

  if (initialLoading || (!pages && !error)) {
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
        subtitle="You have made no offer at the moment. Try making one"
        
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
      {selectedOffer && isVisible && (
        <MyOffersSidebar
          offers={selectedOffer}
          onClose={onClose}
          isVisible={isVisible}
        />
      )}
    </>
  );
}
