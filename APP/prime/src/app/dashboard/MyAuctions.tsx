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
import { getMyAuctions, getMyOffers } from "../graphClient";
import useMyListingsStore from "../hooks/useMyListingsStore";
import { getOffer } from "../contracts/offerInfo";
import { ListingItem } from "./MyListings";
import MyOffersSidebar from "./MyOffersSidebar";
import { getAuction } from "../contracts/auctionInfo";
import MyAuctionsSidebar from "./MyAuctionsSidebar";
import authAddress from "../utils/authAddress";

type offerItem = {
  offerId: bigint;
  price: bigint;
  offerStatus: number;
};

export type auctionItem = {
  auctionId: bigint;
  tokenId: bigint;
  minimumBidAmount: bigint;
  buyoutBidAmount: bigint;
  bidBufferBps: bigint;
  startTimestamp: bigint;
  endTimestamp: bigint;
  auctionCreator: string;
  assetContract: string;
  currency: string;
  tokenType: number;
  status: number;
  src: string;
  name: string;
};

export default function MyAuctions() {
  const createListing = useCreateListingModal();
  const PAGE_SIZE = 8;
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState<auctionItem>();
  const setMutate = useMyListingsStore((state) => state.setMutate);


  

  const [isVisible, setIsVisible] = useState(false);

  const handleCardClick = (auction: auctionItem) => {
    setSelectedAuction(auction);
    // Move setIsVisible after we have the data
    setIsVisible(true);
  };

  const onClose = useCallback(() => {
    setIsVisible(false); // Always set to false when closing
    // Optional: Clear the selected listing after animation
    setTimeout(() => {
      setSelectedAuction(undefined);
    }, 300);
  }, []);

  const fetchActiveAuctionsWithCount = async (page: number, size: number) => {
    try {
          const address = await authAddress();

      const limitedAuction = await getMyAuctions(
      address!
      );

      const activeAuctions: any[] = [];

      const results = await Promise.allSettled(
        limitedAuction.map(async (auction: any) => {
          const auctionResult = await getAuction(auction.auctionId);

          return auctionResult
        }),
      );

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          activeAuctions.push(result.value);
        }
      });

      const totalActiveLength = activeAuctions.length;
      console.log(totalActiveLength);
      const paginatedActiveAuctions = activeAuctions.slice(page, size);
      console.log(paginatedActiveAuctions);

      return { paginatedActiveAuctions, totalActiveLength };
    } catch (error) {
      console.error("Error in main function:", error);
      throw error;
    }
  };

  const fetchAuctionPage = useCallback(async (key: string) => {
    try {
      const pageIndex =
        parseInt(key.split("-page-")[1]?.split("-")[0], 10) || 0;
      const start = pageIndex * PAGE_SIZE;

      const { paginatedActiveAuctions } = await fetchActiveAuctionsWithCount(
        start,
        PAGE_SIZE,
      );

      if (!Array.isArray(paginatedActiveAuctions)) {
        return { items: [], totalCount: 0 };
      }

      const nftCards = await Promise.allSettled(
        paginatedActiveAuctions.map(async (auction) => {
          try {
           
            const contract = nftContract(auction.assetContract);
            const nftDetails = await fetchNFT(contract, auction);
            const currency = await fetchTokenInfo(auction.currency);

            if (!nftDetails?.metadata) {
              console.error(
                `Missing metadata for listing ${auction?.auctionId}`,
              );
              return null;
            }

            const price = toEther(auction.buyoutBidAmount);
            const imageUrl = ipfsToHttp(nftDetails.metadata.image) || "";
            if (!auction) {
              return null;
            }

            return (
              <Card
                key={`${auction.auctionId}-${auction.tokenId}`}
                src={imageUrl}
                name={nftDetails.metadata.name || "Unnamed NFT"}
                tokenId={`${auction.tokenId}`}
                price={price}
                listingId={auction.auctionId}
                symbol={currency?.symbol || ""}
                status={auction.status}
                click={() => {
                  const item: auctionItem = {
                    auctionId: auction.auctionId,
                    tokenId: auction.tokenId,
                    minimumBidAmount: auction.minimumBidAmount,
                    buyoutBidAmount: auction.buyoutBidAmount,
                    bidBufferBps: auction.bidBufferBps,
                    startTimestamp: auction.startTimestamp,
                    endTimestamp: auction.endTimestamp,
                    auctionCreator: auction.auctionCreator,
                    assetContract: auction.assetContract,
                    currency: auction.currency,
                    tokenType: auction.tokenType,
                    status: auction.status,
                    src: imageUrl,
                    name: nftDetails.metadata.name || "Unnamed NFT",
                  };
                  handleCardClick(item);
                }}
              />
            );
          } catch (error) {
            console.error(
              `Error processing listing ${auction.auctionId}:`,
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
        totalCount: paginatedActiveAuctions.length,
      };
    } catch (error) {
      console.error("Error fetching listings page:", error);

      throw error;
    }
  }, []);

  const totalAuction = useCallback(async () => {
    try {
      const { totalActiveLength } = await fetchActiveAuctionsWithCount(0, 1);
      return totalActiveLength;
    } catch (error) {
      console.error("Error fetching initial total count:", error);
      throw error;
    }
  }, []);

  const { ref, pages, isLoading, error, mutate } = useInfiniteScroll({
    fetchData: fetchAuctionPage,
    revalidateKey: "myAuctions",
    getTotalCount: totalAuction, // Pass the function to get total count
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
        subtitle="You have made no auction at the moment. Try making one"
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
      {selectedAuction && isVisible && (
        <MyAuctionsSidebar
          auctions={selectedAuction}
          onClose={onClose}
          isVisible={isVisible}
        />
      )}
    </>
  );
}
