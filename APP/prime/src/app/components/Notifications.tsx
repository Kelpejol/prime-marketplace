"use client";

import Image from "next/image";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import useSWR from "swr";
import Button from "./Button";
import { getMyListings, getMyOfferNotif } from "../graphClient";
import { prepareEvent, toEther, watchContractEvents } from "thirdweb";
import { contract, nftContract } from "../contracts/getContract";
import { fetchNFT, getListing } from "../contracts/getPlatformInfo";
import { fetchTokenInfo } from "../hooks/useCurrencyInfo";
import { ipfsToHttp } from "../utils/IpfsToHttp";
import { formatTimeAgo } from "../utils/timeHelper";
import { useNotificationStore } from "../hooks/useNotifStore";
import { acceptOffer, rejectOffer } from "../contracts/offers";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { showToast } from "./WalletToast";
import { shortenAddress } from "thirdweb/utils";
import Link from "next/link";
import { Copy } from "lucide-react";

interface Notification {
  id: string;
  action: string;
  time: number;
  tokenId?: string;
  totalPrice?: bigint;
  expirationTime?: string;
  name: string; 
  image: string;
  currency?: string;
  nftAddress?: string;
  notificationType: "offer" | "nftCreated"; // Made required with specific union type
  buttons?: {
    declineLabel: string;
    acceptLabel: string;
    declineAction: () => void;
    acceptAction: () => void;
  };
}

interface NotificationProps {
  isOpen: boolean;
  address: string
}

export default function Notification({ isOpen, address }: NotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const {
    readNotifications,
    markAsRead,
    markAllAsRead,
    setUnreadCount,
    getNftAddresses
  } = useNotificationStore();
  const [mounted, setMounted] = useState(false);
  const account = useActiveAccount();
  const [isDisabled, setIsDisabled] = useState(false);

  function isPromiseFulfilled<T>(
    result: PromiseSettledResult<T>,
  ): result is PromiseFulfilledResult<T> {
    return result.status === "fulfilled";
  }

  const handleAcceptOffer = async (offerId: bigint, listingId: bigint) => {
    if (account) {
      setIsDisabled(true);
      try {
        await acceptOffer(offerId, listingId, account!).then(
          async (data: any) => {
            if (data.success) {
              toast.success(data.message!);
            } else {
              toast.error(data.message!);
            }
          },
        );
      } catch (error: any) {
        toast.error(error.message);
        console.error(error);
      } finally {
        setIsDisabled(false);
      }
    } else {
      showToast();
    }
  };

  const copyToClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false)
    }, 1000);
  } catch(err) {
    console.error('Failed to copy: ', err);
  }
}

  const handleRejectOffer = async (offerId: bigint, listingId: bigint) => {
    if (account) {
      setIsDisabled(true);
      try {
        await rejectOffer(offerId, listingId, account!).then(
          async (data: any) => {
            if (data.success) {
              toast.success(data.message!);
            } else {
              toast.error(data.message!);
            }
          },
        );
      } catch (error: any) {
        toast.error(error.message);
        console.error(error);
      } finally {
        setIsDisabled(false);
      }
    } else {
      showToast();
    }
  };

  const addNotification = (newNotification: Notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      {
        ...newNotification, // Spread the newNotification object
        buttons: newNotification.buttons, // Include buttons only if provided
      },
    ]);
  };

  const handleMarkAllAsRead = () => {
    const validNotificationIds = notifications
      .map((notif) => notif.id)
      .filter(
        (id): id is string =>
          id != null &&
          typeof id === "string" &&
          !readNotifications.includes(id),
      );

    if (validNotificationIds.length > 0) {
      markAllAsRead(validNotificationIds);
    }
  };

  const toggleNotification = (id: string) => {
    if (id == null || typeof id !== "string") return;

    setExpandedId(expandedId === id ? null : id);
    if (!readNotifications.includes(id)) {
      markAsRead(id);
    }
  };

  const fetchMyNotifications = useCallback(async () => {

    if (!address || !mounted) {
      setNotifications([]);
      return [];
    }
    
    try {
      
      // Fetch user's listings
      const myListings = await getMyListings(
       address
      );
      const listingIds = myListings.map((listing: any) => listing.listingId);
      const offers = await getMyOfferNotif(listingIds);

      // Fetch NFT creation notifications
      const nftAddresses = getNftAddresses(); // Retrieve stored NFT addresses

      // Process offer notifications
      const offersWithDetails = await Promise.allSettled(
        offers.map(async (offer: any) => {    
          const {
            listingId,
            totalPrice,
            expirationTime,
            blockTimestamp,
            transactionHash,
            offerId,
          } = offer;
          const listing = await getListing(listingId);
          if (!listing) return null;

          const contract = nftContract(listing.assetContract);
          const nftDetails = await fetchNFT(contract, listing);
          const currency = await fetchTokenInfo(listing.currency);

          const now = Math.floor(Date.now() / 1000);
          const remainingSeconds = Number(expirationTime) - now;
          const remainingDays = Math.ceil(remainingSeconds / 86400);

          const expireTime =
            remainingDays <= 0
              ? "Expired"
              : remainingDays === 1
                ? "Expires in: 1 Day"
                : `Expires in: ${remainingDays} Days`;

          return {
            id: transactionHash,
            action: "You have received an offer",
            time: blockTimestamp,
            tokenId: listing.tokenId.toString(),
            totalPrice,
            expirationTime: expireTime,
            currency: currency?.symbol,
            name: nftDetails?.metadata.name,
            image: ipfsToHttp(nftDetails?.metadata.image),
            notificationType: "offer",
            buttons: {
              declineLabel: "Decline",
              acceptLabel: "Accept",
              declineAction: () => handleRejectOffer(offerId, listingId),
              acceptAction: () => handleAcceptOffer(offerId, listingId),
            },
          };
        }),
      );

      // Process NFT creation notifications
      const nftCreationNotifications = await Promise.allSettled(
        nftAddresses.map((nft) => {
        
          return {
            id: nft.address, // Use address as ID
            action: "Your NFT has been created successfully",
            time: nft.timestamp,
            name: nft.name,
            image: nft.image,
            notificationType: "nftCreated",
            nftAddress: nft.address,
          };
        }),
      );

      const validOffers = offersWithDetails
        .filter(isPromiseFulfilled)
        .filter(
          (
            result,
          ): result is PromiseFulfilledResult<NonNullable<Notification>> =>
            result.value !== null,
        )
        .map((result) => result.value);

      // Updated filtering for NFT notifications
      const validNftNotifications = nftCreationNotifications
        .filter(isPromiseFulfilled)
        .filter(
          (
            result,
          ): result is PromiseFulfilledResult<
            Notification & { nftAddress: string }
          > => result.value !== null && result.value.nftAddress !== undefined,
        )
        .map((result) => result.value);
      return [...validOffers, ...validNftNotifications];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    } 
  }, [address, mounted]);

  const { data: offers, isLoading, error } = useSWR(
    mounted && address ? "fetchMyNotifications" : null,
    fetchMyNotifications,
    {
      revalidateOnReconnect: true,
      revalidateOnFocus: true,
      revalidateIfStale: true,
    },
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (offers && Array.isArray(offers)) {
      setNotifications(offers);
    }
  }, [offers]);

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notif) => notif && notif.id && !readNotifications.includes(notif.id),
    );
    setUnreadCount(unreadNotifications.length); // Update unreadCount in the store
  }, [notifications, readNotifications, setUnreadCount]);

  useEffect(() => {
    if (!mounted || !address) return;

    const fetchEvents = async () => {

      const myListings = await getMyListings(address);

      const newOfferEvent = prepareEvent({
        signature:
          "event NewOffer(uint256 indexed totalPrice, uint256 indexed expirationTime, uint256 indexed listingId, address sender, uint256 offerId)",
        filters: {
          listingId: myListings.map((listing: any) => listing.listingId),
        },
      });

      const unwatch = await watchContractEvents({
        contract,
        events: [newOfferEvent],
        onEvents: (events) => {
          events.forEach(async (event) => {
            const { args, transactionHash } = event;
            const { listingId, totalPrice, expirationTime, offerId } = args;
            const listing = await getListing(listingId);
            if (!listing) return;

            const contract = nftContract(listing.assetContract);
            const nftDetails = await fetchNFT(contract, listing);
            const currency = await fetchTokenInfo(listing.currency);

            const now = Math.floor(Date.now() / 1000);
            const remainingSeconds = Number(expirationTime) - now;
            const remainingDays = Math.ceil(remainingSeconds / 86400);

            const expireTime =
              remainingDays <= 0
                ? "Expired"
                : remainingDays === 1
                  ? "Expires in: 1 Day"
                  : `Expires in: ${remainingDays} Days`;

            addNotification({
              id: transactionHash, // Pass listingId to ensure consistent ID
              action: "You have received an offer",
              time: now,
              tokenId: listing.tokenId.toString(),
              totalPrice,
              expirationTime: expireTime,
              currency: currency?.symbol,
              name: nftDetails?.metadata.name!,
              image: ipfsToHttp(nftDetails?.metadata.image),
              notificationType: "offer",
              buttons: {
                declineLabel: "Decline",
                acceptLabel: "Accept",
                declineAction: () => handleRejectOffer(offerId, listingId),
                acceptAction: () => handleAcceptOffer(offerId, listingId),
              },
            });
          });
        },
      });

      return () => unwatch();
    };

    fetchEvents();
  }, [mounted, address]);

   const message = useMemo(() => {
    if(notifications.length === 0 && !isLoading) {
      return "You have no notifications at the moment"
    } else if (error){
      return " An error occurred while fetching notification"
    } else if(isLoading){
      return " Wait a moment for your notification "
    }
  },[notifications.length, error, isLoading])

  if (!isOpen) {
    return null;
  }

 

  return (
    <div className="absolute md:w-[300px] w-[230px] mx-auto shadow-md sm:right-14 md:right-16 right-6 top-20 z-30">
      <div className="bg-white shadow-lg rounded-lg relative">
        <div className="max-h-[14rem] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="flex justify-between items-center p-4">
              <h2 className="md:text-lg text-[14px] text-grey-300 font-bold">
                Notifications
              </h2>
              <button
                className="text-blue-600 hover:text-blue-800 md:text-base text-xs"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            </div>
          </div>
       
          {message ? (
            <div className="w-full flex justify-center items-center bg-gray-50 p-4">
              {message}
            </div>
          ) : (
            <div className="divide-y">
              {notifications
                .filter((notif) => notif && notif.id)
                .map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 cursor-pointer transition-colors duration-200 ${
                      readNotifications.includes(notif.id)
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => toggleNotification(notif.id)}
                  >
                    {expandedId === notif.id ? (
                      <div>
                        {notif.notificationType === "nftCreated" ? (
                          <div>
                            <p className="md:text-base text-sm font-semibold mb-2 capitalize">
                              {notif.name}
                            </p>
                            <div className="flex gap-2">
                              <p className="mb-2 md:text-sm text-[10px]">
                                Your NFT address is{" "}
                                <Link
                                  href={`https://amoy.polygonscan.com/address/${notif.nftAddress}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className=" hover:text-blue-800 hover:underline"
                                >
                                  {shortenAddress(notif.nftAddress!)}
                                </Link>
                              </p>
                              {copied ? (
                                <p className="text-green-500 text-[10px]">
                                  Copied!
                                </p>
                              ) : (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent toggle when clicking copy
                                    copyToClipBoard(notif.nftAddress!);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Copy className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="md:text-base text-sm font-semibold mb-2 capitalize">
                              {notif.name} #{notif.tokenId}
                            </p>
                            <p className="mb-2 md:text-sm text-[10px]">
                              {notif.action} of {toEther(notif.totalPrice!)}
                              <span className="uppercase">
                                {" "}
                                {notif.currency}
                              </span>
                            </p>
                            <p className="md:text-sm text-[10px] text-gray-500 md:mb-2 mb-4">
                              {notif.expirationTime}
                            </p>
                            {notif.buttons && (
                              <div className="flex space-x-2">
                                <Button
                                  ClassName="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200"
                                  actionLabel={notif.buttons.declineLabel}
                                  action={notif.buttons.declineAction}
                                  disabled={isDisabled}
                                />
                                <Button
                                  ClassName="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                                  actionLabel={notif.buttons.acceptLabel}
                                  action={notif.buttons.acceptAction}
                                  disabled={isDisabled}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={notif.image}
                            alt="Notification image"
                            height={30}
                            width={25}
                            className="rounded"
                          />
                          <div className="flex flex-col space-y-1">
                            <div className="md:text-sm text-xs font-semibold capitalize truncate max-w-[150px]">
                              {notif.notificationType === "nftCreated"
                                ? notif.name
                                : `${notif.name} #${notif.tokenId}`}
                            </div>

                            <div className="md:text-xs text-[10px] text-gray-600">
                              {notif.action}
                            </div>
                          </div>
                        </div>
                        <div className="md:text-xs text-[10px] text-gray-500 whitespace-nowrap">
                          {formatTimeAgo(notif.time as number)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
