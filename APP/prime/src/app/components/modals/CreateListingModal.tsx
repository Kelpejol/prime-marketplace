"use client";

import Modal from "./Modal";
import { useCallback, useEffect, useMemo, useState } from "react";
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Heading from "../Heading";
import ToggleSwitch from "../ToggleSwitch";
import { useActiveAccount } from "thirdweb/react";
import CurrencySelect, { CurrencySelectValue } from "../CurrencySelect";
import { createListing } from "@/app/contracts/listing";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";
import {getListingType} from "../../contracts/getPlatformInfo"
import useListingsStore from "@/app/hooks/useListingsStore"
import { TimeHelper } from "@/app/utils/timeHelper";


enum STEPS {
  TYPE = 0,
  INFO = 1,
  
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

export default function CreateListingModal() {
  const [selectedType, setSelectedType] = useState<LISTING_TYPE>();
  const [checked, setChecked] = useState(false);
    const [step, setStep] = useState(STEPS.TYPE);
  const [selectedValue, setSelectedValue] = useState<CurrencySelectValue>();
   const [isLoading, setIsLoading] = useState(false);
  const createListingModal = useCreateListingModal();
  const account = useActiveAccount();
  const [basicData, setBasicData] = useState<LISTING_TYPE_DATA>({})
  const [advancedData, setAdvancedData] = useState<LISTING_TYPE_DATA>({})
  const [proData, setProData] = useState<LISTING_TYPE_DATA>({})
  const listingsStore = useListingsStore();
  
  


const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      listingType: null,
      assetContract: "",
      tokenId: null,
      tokenPrice: null,
      currency: "",
      isReserved: checked
    },
     mode: 'onSubmit', // Validate on form submission
    reValidateMode: 'onSubmit'
  })




    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
 
  if (step !== STEPS.INFO) {
    return onNext();
  }
   

  if (account) {
     const listingData = {
      assetContract: data.assetContract,
      tokenId: BigInt(data.tokenId), 
      currency: data.currency,
      pricePerToken: data.tokenPrice, 
      listingType: data.listingType, 
      reserved: data.isReserved
    };
       if(!data.currency) {
        toast.error("Please select a currency");
        return;
      }
    setIsLoading(true);
    try{
  await createListing( listingData, account).then(async (data: any) => {
    if (data.success) {
          createListingModal.onClose();
      toast.success(data.message);
       reset();
        setSelectedType(undefined);
        setChecked(false);
        setSelectedValue(undefined);
        setStep(STEPS.TYPE);
        await listingsStore.refreshListings()
 } else {
      toast.error(data.message);
    }
  })} catch (error: any) {
    toast.error(error.message);
    console.error(error)
  }
  finally{
    setIsLoading(false);
  }
   
  } else {
    createListingModal.onClose();
  showToast()
  }
 
};

const listingTypeLabel = useCallback(() => {
  if(selectedType === LISTING_TYPE.ADVANCED || selectedType === LISTING_TYPE.PRO || selectedType === LISTING_TYPE.BASIC) {
    return "Next";
  } 
  else {
    return undefined
  }
}, [selectedType])



useEffect(() => {
  const fetchListingData = async() => {
    try{
const [basicResult, advancedResult, proResult] = await Promise.all([
   getListingType(LISTING_TYPE.BASIC),
   getListingType(LISTING_TYPE.ADVANCED),
   getListingType(LISTING_TYPE.PRO)

]);
 setBasicData({
        duration: TimeHelper.secondsToMonths(basicResult?.[0]),
        price: basicResult?.[1].toString()
      });
      
      setAdvancedData({
        duration: TimeHelper.secondsToMonths(advancedResult?.[0]),
        price: advancedResult?.[1].toString()
      });
      
      setProData({
        duration: TimeHelper.secondsToMonths(proResult?.[0]),
        price: proResult?.[1].toString()
      });

    } catch (error) {
      console.error('Error fetching listing data:', error)
    }
  }

  fetchListingData();
}, [])



 
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
      case STEPS.TYPE:
        return listingTypeLabel();
      case STEPS.INFO:
        return "Submit";
      default:
        return "Next";
    }
  }, [step, listingTypeLabel]);

  const secondaryActionLabel = useMemo(() => {
    switch (step) {
      case STEPS.TYPE:
        return undefined;
      case STEPS.INFO:
        return "Back";
      default:
        return "Back";
    }
  }, [step]);


  let bodyContent = (
    <div className="flex flex-col  gap-7">
     <Heading
     title="Choose Listing Plan"
     subtitle="Select the listing plan of your choice"
     />
   <div className="flex justify-between space-x-3">
      <div onClick={() => handleSelect(LISTING_TYPE.BASIC)} className={`${selectedType == LISTING_TYPE.BASIC ? "bg-black text-white" : "border-gray-300"} flex-1 cursor-pointer rounded-lg border p-4 text-center`}> 
        <div className="text-center">
         <div className="md:text-lg text-sm font-bold">Basic</div>
      <div className={`${selectedType == LISTING_TYPE.BASIC && "text-white"} font-light text-neutral-500 mt-2 md:text-sm text-[10px]`}>
        ${basicData.price}</div>
      <div className={`${selectedType == LISTING_TYPE.BASIC && "text-white"} text-black font-semibold mt-1 md:text-sm text-[10px]`}>
        {TimeHelper.formatDuration(basicData.duration).toString()}</div>
        </div>
         </div>
 <div onClick={() => handleSelect(LISTING_TYPE.ADVANCED)} className={`${selectedType == LISTING_TYPE.ADVANCED ? "bg-black text-white" : "border-gray-300"} flex-1 cursor-pointer rounded-lg border p-4 text-center`}>   
  <div className="text-center">
         <div className="md:text-lg text-sm font-bold">Advanced</div>
      <div className={`${selectedType == LISTING_TYPE.ADVANCED && "text-white"} font-light text-neutral-500 mt-2 md:text-sm text-[10px]`}>
        ${advancedData.price}</div>
      <div className={`${selectedType == LISTING_TYPE.ADVANCED && "text-white"} text-black font-semibold mt-1 md:text-sm text-[10px]`}>{TimeHelper.formatDuration(advancedData.duration).toString()}</div>
        </div>  
  
     </div>
 <div onClick={() => handleSelect(LISTING_TYPE.PRO)} className={`${selectedType == LISTING_TYPE.PRO ? "bg-black text-white" : "border-gray-300"} flex-1 cursor-pointer rounded-lg border p-4 text-center`}>   
  <div className="text-center">
         <div className="md:text-lg text-sm font-bold">Pro</div>
      <div className={`${selectedType == LISTING_TYPE.PRO && "text-white"} font-light text-neutral-500 mt-2 md:text-sm text-[10px]`}>${proData.price}</div>
      <div className={`${selectedType == LISTING_TYPE.PRO && "text-white"} text-black font-semibold mt-1 md:text-sm text-[10px]`}>{TimeHelper.formatDuration(proData.duration).toString()}</div>
        </div>  
  
     </div>
     </div>

    </div>
      
  );

  

  if(step == STEPS.INFO) {
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
          <label htmlFor="tokenPrice" className="block text-xs md:text-sm font-medium text-gray-700">
                      Token price
                    </label>
          <input type="number" id="tokenPrice"  {...register("tokenPrice", {
          required: true,
        })} className={`${errors.tokenPrice ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} placeholder="0" />
 
      
        
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
      title="Create a Listing"
      isOpen={createListingModal.isOpen}
      onClose={createListingModal.onClose}  // Fixed: Add proper onClose handler
      onSubmit={handleSubmit(onSubmit)}           // Fixed: Add proper onSubmit handler
      actionlabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryActions={step === STEPS.TYPE ? undefined : onBack}
      disabled={isLoading}
      body={bodyContent}
    />
    </div>
  );
}