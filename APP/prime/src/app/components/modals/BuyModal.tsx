"use client";

import Modal from "./Modal";
import { useState } from "react";
import { FieldValues, useForm} from "react-hook-form";
import { useRouter } from "next/navigation";
import Heading from "../Heading";


import useBuyModal from "@/app/hooks/useBuyModal";
import { useActiveAccount } from "thirdweb/react";
import { buyFromListing } from "@/app/contracts/listing";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";




export default function BuyModal() {
  const router = useRouter();
   const account = useActiveAccount();
    const [isDisabled, setIsDisabled] = useState(false);
      const buyModal = useBuyModal();


  
  const {
    register,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      recipientAddress: "",
    },
  });

  const onSubmit = async (data: FieldValues) => {
    if(account) {
      setIsDisabled(true);
      try{
      await buyFromListing(data.recipientAddress, buyModal.listingId!, account!).then(async (data: any)=> {
        if(data.success){
          toast.success(data.message!);
          buyModal.onClose();
          reset();
          await buyModal.mutateListing();
        } else {
          toast.error(data.message!)
        }
      })}

      catch (error) {
        toast.error("Unexpected error occurred, Try again");
        console.error(error)
      } finally {
        setIsDisabled(false);
      }

      

    } else {
      buyModal.onClose();
      showToast();
    }
  };

 

  let bodyContent = (
    <div className="flex flex-col gap-4 w-full">
      <Heading
        title="Who is the recipient?"
        center
        subtitle="Choose who will receive this art"
      />
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="recipientAddress" className="block text-xs md:text-sm font-medium text-gray-700">
          Recipient address
        </label>
        <input
          type="text"
          id="recipientAddress"
          className=" border-gray-300 p-2 pl-3 sm:pl-4 text-sm sm:text-base mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px]"
          {...register("recipientAddress", { required: true })}
          placeholder="0x123...789"
        />
      </div>
    </div>
  );


  

  return (
    <div>
       <Modal
      title="Buy from listing"
      isOpen={buyModal.isOpen}
      onClose={buyModal.onClose}  
      onSubmit={handleSubmit(onSubmit)}   
      actionlabel={"Submit"}
      secondaryActionLabel={undefined}
      body={bodyContent}
      disabled={isDisabled}
    />
    </div>
  );
}
