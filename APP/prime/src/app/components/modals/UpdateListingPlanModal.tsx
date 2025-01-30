"use client";

import React, { useCallback, useEffect, useState } from "react";
import Heading from "@/app/components/Heading";
import {  updateListingPlan } from "@/app/contracts/listing";
import { useActiveAccount } from "thirdweb/react";
import Modal from "./Modal";
import toast from "react-hot-toast";
import { showToast } from "@/app/components/WalletToast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { getListingType } from "@/app/contracts/getPlatformInfo";
import { TimeHelper } from "@/app/utils/timeHelper";
import useMyListingsStore from "@/app/hooks/useMyListingsStore";



interface UpdateListingPlanModalProps {
  listingId: bigint;
  onClose: () => void;
  isOpen: boolean;
  listingPlan: number | undefined;
  onSuccess: () => void;
}

interface LISTING_TYPE_DATA {
  duration?: number;
  price?: string;
}

enum LISTING_TYPE {
  BASIC,
  ADVANCED,
  PRO,
}

const UpdateListingPlanModal = ({
  listingId,
  onClose,
  isOpen,
  listingPlan,
  onSuccess
}: UpdateListingPlanModalProps) => {
  
 
  const [isDisabled, setIsDisabled] = useState(false);
    const [selectedType, setSelectedType] = useState<LISTING_TYPE>(listingPlan!);
  
  const account = useActiveAccount();
  const [basicData, setBasicData] = useState<LISTING_TYPE_DATA>({})
  const [advancedData, setAdvancedData] = useState<LISTING_TYPE_DATA>({})
  const [proData, setProData] = useState<LISTING_TYPE_DATA>({})
      const listingsStore = useMyListingsStore();


  const {
      
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm<FieldValues>({
      defaultValues: {
        listingType: null,
      },
       mode: 'onSubmit', // Validate on form submission
      reValidateMode: 'onSubmit'
    })
  

   const setCustomValues = useCallback((key: string, value: LISTING_TYPE) => {
    setValue(key, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [setValue]);
  

 

  
  

  const handleSelect = (type: LISTING_TYPE) => {
    setSelectedType(type);
    setCustomValues("listingType", type);
  };

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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (account) {
        try{
      setIsDisabled(true);
      await updateListingPlan(listingId, selectedType, account!).then(async(data) => {
        if (data.success) {
          toast.success(data.message!);
          

          onClose();
          onSuccess();
           await listingsStore.refreshListings();


        } else {
          toast.error(data.message!);
        }
        });
    } catch(error: any) {
        toast.error(error.message)
        console.error(error)
    } finally{
        setIsDisabled(false);
    }
      
    } else {
      showToast();
    }
  };


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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}   
      actionlabel={"Submit"}
      body={bodyContent}
      title="Update Listing Plan"
      disabled={isDisabled}
    />
    
  );
};

export default UpdateListingPlanModal;
