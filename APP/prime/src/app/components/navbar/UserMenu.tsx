"use client";

import MenuItem from "./MenuItem";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Bell, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import ConnectWallet from "../ConnectWallet";
import useCreateNftModal from "@/app/hooks/useCreateNftModal";
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import useCreateAuctionModal from "@/app/hooks/useCreateAuctionModal";
import Notification from "../Notifications";
import Search from "./Search";
import Logo from "../Logo";
import Link from 'next/link'
import { queryParams } from "@/app/utils/queryParams";
import { useActiveAccount } from "thirdweb/react";
import { useNotificationStore } from "@/app/hooks/useNotifStore";
import { showToast } from "../WalletToast";
import authAddress from "../../utils/authAddress";


export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifIsOpen, setNotifIsOpen] = useState(false);
  const createNFTModal = useCreateNftModal();
  const createListingModal = useCreateListingModal();
  const createAuctionModal = useCreateAuctionModal();
  const router = useRouter();
   const account = useActiveAccount();
    const { unreadCount } = useNotificationStore();
    const [address, setAddress] = useState("")

    useEffect(() => {
      if(notifIsOpen && !account){
        setNotifIsOpen(false);
        setAddress("")
      }
    }, [account])

    const count = useMemo(() => {
      if(address){
        return unreadCount
      }
    }, [address, unreadCount])

  const handleMyListings = useCallback(() => {
    
    router.push(queryParams("/dashboard","listings"));
    setIsOpen(false);
  
  }, []);

  const handleMyAuctions = useCallback(() => {    
    router.push(queryParams("/dashboard","auctions"));
    setIsOpen(false);
     
  }, []);
  
  const handleMyOffers = useCallback(() => {     
    router.push(queryParams("/dashboard","offers"));
    setIsOpen(false);
    
  }, []);



  const toggleIsOpen = useCallback(() => {
    setNotifIsOpen(false);
    setIsOpen((value) => !value);
  }, []);

  const openCreateListing = useCallback(() => {
     createListingModal.onOpen();
          setIsOpen(false)
                
  }, [createListingModal])

  const openNFT = useCallback(() => {
    createNFTModal.onOpen();
    setIsOpen(false)
  }, [createNFTModal])

  const openCreateAuction = useCallback(() => {
    createAuctionModal.onOpen();
    setIsOpen(false)
  }, [createAuctionModal])

  const notifOpen = useCallback(async() => {
    const address = await authAddress();
    if(!address){
        showToast("Please log in", "Please connect your wallet to log in.");
      return
    }
    setAddress(address)
    setIsOpen(false);
    setNotifIsOpen((value) => !value);
  }, []);

  return (
    <div className="w-full">
      <div className=" mx-auto xl:px-20 md:px-10 sm:px-6 px-2">
        <div className="h-20 flex items-center justify-between gap-2 relative">
          <div className="flex-shrink-0 cursor-pointer">
            {" "}
            {/* Add this wrapper */}
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="max-w-2xl ">
            <Search />
          </div>

          <div className="flex justify-between lg:w-[28%] w-[24%]">
            <div className="hidden lg:block">
              <ConnectWallet color="primary" size="primary" />
            </div>

            <div className="cursor-pointer flex items-center relative">
              <div
                className="hover:bg-gray-100 rounded-full transition"
                onClick={notifOpen}
              >
                <Bell size={24} />
              </div>
              <span className="absolute -top-2 -right-2 text-red-500 text-xs font-semibold">
               {count}
                
              </span>
            </div>

            <button
              onClick={toggleIsOpen}
              className=" lg:p-3 p-2 border-2 border-gray-300 rounded-full hover:shadow-md transition"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="absolute md:right-10 right-6 top-20 bg-neutral-100 hover:bg-neutral-50 transition rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="flex flex-col">
              <MenuItem label="Create listing" onClick={openCreateListing} />
              <MenuItem label="Create auction" onClick={openCreateAuction} />
              <MenuItem label="Create NFTs" onClick={openNFT} />
              <MenuItem label="My listings" onClick={handleMyListings} />
              <MenuItem label="My auctions" onClick={handleMyAuctions} />
              <MenuItem label="Offers" onClick={handleMyOffers} />

              <div className="lg:hidden border-t h-full">
                <ConnectWallet
                  size="tertiary"
                  color="tertiary"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Notification isOpen={notifIsOpen} address={address} />
    </div>
  );
}



