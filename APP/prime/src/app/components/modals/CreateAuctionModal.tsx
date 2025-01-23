"use client";

import Modal from "./Modal";
import { useCallback, useEffect, useMemo, useState } from "react";
import useCreateAuctionModal from "@/app/hooks/useCreateAuctionModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import ToggleSwitch from "../ToggleSwitch";

import { useActiveAccount } from "thirdweb/react";
import CurrencySelect, { CurrencySelectValue } from "../CurrencySelect";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";
import {getListingType} from "../../contracts/getPlatformInfo"
import { createAuction } from "@/app/contracts/auction";


enum STEPS {
  INFO = 0,
  DURATION = 1
  
}

enum LISTING_TYPE {
  BASIC,
  ADVANCED ,
  PRO 
}

interface LISTING_TYPE_DATA {
  duration?: number,
  price?: string
}

export default function CreateAuctionModal() {
  const [selectedType, setSelectedType] = useState<LISTING_TYPE>();
  const [checked, setChecked] = useState(false);
    const [step, setStep] = useState(STEPS.INFO);
  const [selectedValue, setSelectedValue] = useState<CurrencySelectValue>();
   const [isLoading, setIsLoading] = useState(false);
  const createAuctionModal = useCreateAuctionModal();
  const account = useActiveAccount();
 



    

  


const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      minimumBidAmount: null,
      assetContract: "",
      tokenId: null,
      buyOutBidAmount: null,
      currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      bidBufferBps: null,
      startTimestamp: null,
      endTimestamp: null
    },
     mode: 'onSubmit', // Validate on form submission
    reValidateMode: 'onSubmit'
  })




    const onSubmit: SubmitHandler<FieldValues> = (data) => {
 
  if (step !== STEPS.DURATION) {
    return onNext();
  }
   

  if (account) {
     
       if(!data.currency) {
        toast.error("Please select a currency");
        return;
      }
    setIsLoading(true);
   createAuction(data.assetContract, 
                 data.tokenId,
                 data.currency,
                 data.minimumBidAmount,
                 data.buyOutBidAmount,
                 data.bidBufferBps,
                 data.startTimestamp,
                 data.endTimestamp,
                  account
                ).then((data) => {
    if (data.success) {
          createAuctionModal.onClose();
      toast.success(data.message);
       reset();
        
    } else {
      toast.error(data.message);
    }
    setIsLoading(false);
   })
  } else {
    createAuctionModal.onClose();
  showToast()
  }
 
};



 
  const setCustomValues = useCallback((key: any, value: string | number | File | null | CurrencySelectValue | undefined | boolean) => {
  setValue(key, value, {
    shouldValidate: true,
    shouldDirty: true,
  });
}, [setValue]);


 
  const handleSelectedValue = (selectedOption: CurrencySelectValue | null) => {
    if(selectedOption) {
      setSelectedValue(selectedOption);
      setCustomValues("currency", selectedOption.address)
    } else {
      setSelectedValue(undefined);
      setCustomValues("currency", undefined)
    }
   
  }

  const handleToggleChange = (value: boolean) => {
    setChecked(value);
    setCustomValues("isReserved", value);
    
  };

   
  
  


 



  const onBack = () => {
    setStep((value) => value - 1);
  };
  const onNext = () => {
   
    setStep((value) => value + 1);
  };

  const handleSelect = (type: LISTING_TYPE) => {
    setSelectedType(type);
    setCustomValues("listingType", type);
  };




  const actionLabel = useMemo(() => {
    switch (step) {
      case STEPS.INFO:
        return "Next";
      case STEPS.DURATION:
        return "Submit";
      default:
        return "Next";
    }
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    switch (step) {
      case STEPS.INFO:
        return undefined;
      case STEPS.DURATION:
        return "Back";
      default:
        return "Back";
    }
  }, [step]);


  let bodyContent = (
    <div className="flex flex-col  gap-7">
    
   <div className="flex flex-col gap-4">
     <div>
          <label htmlFor="assetContract" className="block text-xs md:text-sm font-medium text-gray-700">
                      Asset address
           </label>
          <input type="text"  id="assetContract" className={`${errors.assetContract ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px]`} {...register("assetContract", {
          required: true
        })} placeholder="0x123...789" />
          </div>
           
          <div className="flex gap-4">
                  <div className="flex-1">
          <label htmlFor="tokenId" className="block text-xs md:text-sm font-medium text-gray-700">
                      Token ID
                    </label>
          <input type="number" id="tokenId"  {...register("tokenId", {
          required: true
        })} className={`${errors.tokenId ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
 

       </div>
          

        <div className="flex-1">
          <div className=" relative">
         <label htmlFor="bidBufferBps" className="block text-xs md:text-sm font-medium text-gray-700">Bid buffer bps</label>
          <input type="number"  min ="0" max = "50" id="bidBufferBps" className={`${errors.bidBufferBps ? "border-red-500" : "border-gray-300"} border-2 rounded-lg mt-1 p-2 w-full pl-6 placeholder:text-[12px] md:placeholder:text-[13px]`} {...register("bidBufferBps", {
            min: 0,
          max: 50
        })} placeholder="10" />
          <div className="absolute left-2 top-1/2">%</div>
           
       </div>
       
          </div>


          </div>

           <div className="flex gap-4">
                  <div className="flex-1">
          <label htmlFor="minimumBidAmount" className="block text-xs md:text-sm font-medium text-gray-700">
                     Minimum bid amount
                    </label>
          <input type="number" id="minimumBidAmount"  {...register("minimumBidAmount", {
          required: true
        })} className={`${errors.minimumBidAmount ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
 

       </div>
          

           <div className="flex-1">
          <label htmlFor="buyOutBidAmount" className="block text-xs md:text-sm font-medium text-gray-700">
                      Buyout bid amount
                    </label>
          <input type="number" id="buyOutBidAmount"  {...register("buyOutBidAmount", {
          required: true
        })} className={`${errors.buyOutBidAmount ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
 

       </div>


          </div>

       
         <CurrencySelect
          value={selectedValue}
          onChange={handleSelectedValue}
         />
          <div className="md:text-[12px] text-[10px] text-gray-500 break-words">**Bid Buffer bps: The percentage a bidder must match to the existing winning bid. The Bid buffer bps would be a percentage of the actual minimum bid amount** </div>
    </div>
    </div>
      
  );

  

  if(step == STEPS.DURATION) {
    bodyContent = (
      <div className="flex flex-col  gap-7">
       <div className="flex flex-col gap-4">
          <label htmlFor="assetContract" className="block text-xs md:text-sm font-medium text-gray-700">
                      Asset address
                    </label>
          <input type="text"  id="assetContract" className={`${errors.assetContract ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px]`} {...register("assetContract", {
          required: true
        })} placeholder="0x123...789" />
          
           
         <div className="flex gap-4">
                  <div className="flex-1">
          <label htmlFor="tokenId" className="block text-xs md:text-sm font-medium text-gray-700">
                      Token ID
                    </label>
          <input type="number" id="tokenId"  {...register("tokenId", {
          required: true
        })} className={`${errors.tokenId ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
 

       </div>
          

        <div className="flex-1">
          <div className=" relative">
         <label htmlFor="royalties" className="block text-xs md:text-sm font-medium text-gray-700">Bid buffer bps</label>
          <input type="number"  min ="0" max = "50" id="royalties" className="border-2 border-gray-300 rounded-lg mt-1 p-2 w-full pl-6 placeholder:text-[12px] md:placeholder:text-[13px]" {...register("royalties", {
            min: 0,
          max: 50
        })} placeholder="10" />
          <div className="absolute left-2 top-1/2">%</div>
           
       </div>
          </div>


          </div>



       
         <CurrencySelect
          value={selectedValue}
          onChange={handleSelectedValue}
         />
        
       
        
       
        <div className="flex items-center justify-between">
          <div className="text-black font-bold block md:text-xs text-[10px]">Reserve listing?</div>
          <div className="flex flex-end">
         <ToggleSwitch
         checked={checked}
         onChange={handleToggleChange}
         
         />
         </div>
         </div>
       </div>
       
       </div>
       )
  }



 
  return (
    <div>
       <Modal
      title="Create an auction"
      isOpen={createAuctionModal.isOpen}
      onClose={createAuctionModal.onClose}  // Fixed: Add proper onClose handler
      onSubmit={handleSubmit(onSubmit)}           // Fixed: Add proper onSubmit handler
      actionlabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryActions={step === STEPS.INFO ? undefined : onBack}
      disabled={isLoading}
      body={bodyContent}
    />
    </div>
  );
}
