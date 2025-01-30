"use client";

import Modal from "./Modal";
import { useState } from "react";
import { FieldValues, useForm} from "react-hook-form";
import { useRouter } from "next/navigation";
import Heading from "../Heading";
import { usePathname } from "next/navigation";
import { useSWRConfig } from 'swr';
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";
import { approveBuyerForListing } from "@/app/contracts/listing";
import useMyListingsStore from "@/app/hooks/useMyListingsStore";

interface ApproveBuyerProps {
 onClose: () => void,
 isOpen: boolean,
  listingId: bigint,
  onSuccess: () => void
}



export default function ApproveBuyerModal({
  onClose,
  isOpen,
  listingId,
  onSuccess,
}: ApproveBuyerProps) {
  const account = useActiveAccount();
  const [isDisabled, setIsDisabled] = useState(false);
  const listingsStore = useMyListingsStore();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      buyerAddress: "",
    },
  });

  const onSubmit = async (data: FieldValues) => {
    if (account) {
      setIsDisabled(true);
      try {
        await approveBuyerForListing(
          listingId,
          data.buyerAddress,
          account,
        ).then(async (data) => {
          if (data.success) {
            toast.success(data.message!);
           
            onSuccess();

            onClose();
             await listingsStore.refreshListings();
          } else {
            toast.error(data.message!);
          }
        });
      } catch (error) {
        toast.error("Unexpected error occurred, Try again");
        console.error(error);
      } finally {
        setIsDisabled(false);
      }
    } else {
      onClose();
      showToast();
    }
  };

  let bodyContent = (
    <div className="flex flex-col gap-4 w-full">
      <Heading
        title="Approve a buyer"
        center
        subtitle="Choose who can buy this listing"
      />
      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor="buyerAddress"
          className="block text-xs md:text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          type="text"
          id="buyerAddress"
          className=" border-gray-300 p-2 pl-3 sm:pl-4 text-sm sm:text-base mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px]"
          {...register("buyerAddress", { required: true })}
          placeholder="0x123...789"
        />
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        title="Buy from listing"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
        actionlabel={"Submit"}
        secondaryActionLabel={undefined}
        body={bodyContent}
        disabled={isDisabled}
      />
    </div>
  );
}
