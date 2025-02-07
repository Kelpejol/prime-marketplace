"use client";

import Modal from "./Modal";
import { useCallback, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Heading from "../Heading";
import { useActiveAccount } from "thirdweb/react";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";
import useOfferModal from "@/app/hooks/useOfferModal";
import SwitchablePicker, { PickerType } from "../SwitchablePicker";
import { makeOffer } from "@/app/contracts/offers"; 
import { formattedTimeStamp } from "@/app/utils/timeHelper";
import { toWei } from "thirdweb";




export default function OfferModal() {
  const account = useActiveAccount();
  const [isDisabled, setIsDisabled] = useState(false);
  const offerModal = useOfferModal();
  const [type, setType] = useState<PickerType>('date');
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      offerAmount: null,
      offerDuration: {
        date: 0,
        time: 0
      }
    },
  });


  

  // Watch the current duration value based on type
  const pickerValue = watch(`offerDuration.${type}`);

  

  const onSubmit = async(data: FieldValues) => {
   const timeStamp = formattedTimeStamp(data.offerDuration.time, data.offerDuration.date);
   if(timeStamp < Math.floor(Date.now() / 1000)) {
     toast.error('Offer duration should be greater than current time');
     return;
   }
  const duration = timeStamp - Math.floor(Date.now() / 1000);
    if(account) {
      
      setIsDisabled(true);
      try{
        console.log(
          offerModal.listingId!,
          account,
          BigInt(duration),
          data.offerAmount,
        );
      await makeOffer(offerModal.listingId!, account, BigInt(duration), toWei(data.offerAmount.toString())).then((data) => {
        
           if(data.success){
          toast.success(data.message!);
          offerModal.onClose();
          reset();
           } else {
            toast.error(data.message!)
           }
          
        
      })
    } catch(error: any){
      toast.error(error.message);
      console.error(error)
    }
    finally{
      setIsDisabled(false)
    }
    } else {
       offerModal.onClose();
      showToast();
    }
    
  };

  const setCustomValues = useCallback((key: any, value: any) => {
    setValue(key, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [setValue]);

  const onDurationChange = useCallback((value: any) => { 
 
    setCustomValues(`offerDuration.${type}`, value);
  }, [setCustomValues, type]);

  const bodyContent = (
    <div className="flex flex-col gap-7">
      <Heading
        title="Make an offer"
        subtitle="Make a reasonable amount and duration for this offer"
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="tokenPrice" 
            className="block sm:text-xs text-[10px] font-black text-black"
          >
            Amount
          </label>
          <input 
            type="number" 
            id="tokenPrice"  
            {...register("offerAmount", { required: true })} 
            className={`${errors.offerAmount ? "border-red-500" : "border-gray-300"} p-2 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
            placeholder="0" 
          />
        </div>

        <SwitchablePicker 
          onChange={onDurationChange} 
          setType={setType} 
          type={type} 
          value={pickerValue}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        title="Make an offer"
        isOpen={offerModal.isOpen}
        onClose={offerModal.onClose}  
        onSubmit={handleSubmit(onSubmit)}   
        actionlabel="Submit"
        secondaryActionLabel={undefined}
        body={bodyContent}
        disabled={isDisabled}
      />
    </div>
  );
}