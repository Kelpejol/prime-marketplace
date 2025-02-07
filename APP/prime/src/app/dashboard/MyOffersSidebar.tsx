"use client";

import { useCallback, useMemo, useState } from "react";
import { X, Edit, Trash } from "lucide-react";
import Image from "next/image";
import { cancelListing } from "../contracts/listing";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { showToast } from "@/app/components/WalletToast";
import useMyListingsStore from "../hooks/useMyListingsStore";
import { Offers } from "./MyOffers";
import { cancelOffer } from "../contracts/offers";
import useOfferModal from "../hooks/useOfferModal";
import { toEther } from "thirdweb";

interface MyOffersSidebarProps {
  offers: Offers;
  onClose: () => void;
  isVisible: boolean;
}

export default function MyOffersSidebar({
  offers,
  onClose,
  isVisible,
}: MyOffersSidebarProps) {
  const account = useActiveAccount();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const listingsStore = useMyListingsStore();
  console.log(offers?.price)

  const offerStatus= useMemo(() => {
        if(offers?.offerStatus == 1){
          return "Your offer is awaiting response";
        }
        else if(offers?.offerStatus == 2){
          return "Your offer has been accepted";
        }
        else if(offers?.offerStatus == 3){
          return "Your offer has been rejected";
        }
        else {
          return "Your offer is currently inactive";
        }
  }, [offers?.status])

      const offer = useOfferModal();

       const makeOffer = useCallback(() => {
         offer.setListingId(offers.listingId);
         offer.onOpen();
        }, [offers.listingId, offer]) 


  const handleCancel = async () => {
    if (!account) {
      showToast();
      return;
    }

    try {
      setIsDisabled(true);
      console.log(offers.offerId, offers.listingId)
      const data = await cancelOffer(offers.offerId, offers.listingId, account);

      if (data.success) {
        toast.success(data.message!);
        onClose();
        await listingsStore.refreshListings();
      } else {
        toast.error(data.message!);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex flex-col h-[100vh]
          w-full sm:max-w-[calc(100vw-8rem)] md:max-w-[320px] lg:max-w-[460px]
          transform transition-transform duration-300 ease-in-out
          ${isVisible ? "translate-x-0" : "translate-x-full"}
          bg-white shadow-xl`}
      >
        <div className="flex items-center justify-end p-2 sm:p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 sm:p-4 space-y-4">
            {/* Card */}
            {offers && (
              <div className="w-full max-w-[90vw] sm:max-w-none mx-auto">
                <div className="relative h-[350px]">
                  <Image
                    src={offers.src}
                    alt={offers.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 20vw"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={makeOffer}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold 
                    py-2.5 sm:py-3 px-4 rounded flex items-center justify-center 
                    transition-colors text-sm sm:text-base"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Edit offer
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isDisabled}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold 
                    py-2.5 sm:py-3 px-4 rounded flex items-center justify-center 
                    transition-colors text-sm sm:text-base"
                >
                  <Trash className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Cancel offer
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                  Manage offer
                </h3>
                <div className="space-y-2 h-auto  rounded-lg border border-gray-200">
                  <div
                    className="p-3 sm:p-4 flex flex-col hover:bg-gray-50 transition-colors border-b 
                    last:border-b-0 border-gray-200 gap-3 sm:gap-4"
                  >
                    <div>
                      <span className="text-base font-bold">
                        Your offer was:{" "}
                      </span>
                      <span className="text-base font-bold capitalize">
                        {toEther(offers.price)} {offers.symbol}
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-bold italic">{offerStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
