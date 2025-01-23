"use client";

import MenuItem from "./MenuItem";
import { useState, useCallback } from "react";
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


export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifIsOpen, setNotifIsOpen] = useState(false);
  const createNFTModal = useCreateNftModal();
  const createListingModal = useCreateListingModal();
  const createAuctionModal = useCreateAuctionModal();
  const router = useRouter();
   const account = useActiveAccount();

  const handleMyListings = useCallback(() => {
    
    router.push(queryParams("/dashboard","listings", account?.address!));
    setIsOpen(false);
  
  }, []);

  const handleMyAuctions = useCallback(() => {    
    router.push(queryParams("/dashboard","auctions", account?.address!));
    setIsOpen(false);
     
  }, []);
  
  const handleMyOffers = useCallback(() => {     
    router.push(queryParams("/dashboard","offers", account?.address!));
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

  const notifOpen = useCallback(() => {
    setIsOpen(false);
    setNotifIsOpen((value) => !value);
  }, []);

  return (
    <div className="w-full">
      <div className=" mx-auto xl:px-20 md:px-10 sm:px-6 px-2">
        <div className="h-20 flex items-center justify-between gap-2 relative">
            <div className="flex-shrink-0 cursor-pointer"> {/* Add this wrapper */}
       <Link href="/">
        <Logo />
        </Link>
    </div>
            <div className="max-w-2xl ">
              <Search />
            </div>
          

          <div className="flex justify-between w-[25%]">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition"
              onClick={notifOpen}
            >
              <Bell size={24} />
            </button>
            
            <div className="hidden md:block">
              <ConnectWallet color="primary" size="primary"/>
            </div>

            <button
              onClick={toggleIsOpen}
              className=" p-3 border-2 border-gray-300 rounded-full hover:shadow-md transition"
            >
              <Menu size={16} />
            </button>
        </div>
        </div>


        {isOpen && (
          <div className="absolute md:right-10 right-6 top-20 bg-neutral-100 hover:bg-neutral-50 transition rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="flex flex-col md:py-2">
              <MenuItem
                label="Create listing"
                onClick={openCreateListing}
              />
              <MenuItem
                label="Create auction"
                onClick={openCreateAuction}
              />
              <MenuItem
                label="Create NFTs"
                onClick={openNFT}
              />
              <MenuItem
                label="My listings"
                onClick={handleMyListings}
              />
              <MenuItem
                label="My auctions"
                onClick={handleMyAuctions
                }
              />
              <MenuItem
                label="Offers"
                onClick={handleMyOffers}
              />
              
              <div className="md:hidden border-t h-full">
                <ConnectWallet size="tertiary" color="tertiary" onClick={() => {setIsOpen(false)}}/>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Notification isOpen={notifIsOpen}/>
    </div>
  );
}



