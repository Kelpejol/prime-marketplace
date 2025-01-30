"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import CurrencySelect from "../CurrencySelect";
import Modal from "./Modal";
import { ListingItem } from "@/app/dashboard/MyListings";
import { useCurrencyInfo } from "@/app/hooks/useCurrencyInfo";
import { toEther } from "thirdweb";
import { NATIVE_TOKEN } from "@/app/constant";
import { useActiveAccount } from "thirdweb/react";
import { updateListing } from "@/app/contracts/listing";
import toast from "react-hot-toast";
import { showToast } from "../WalletToast";
import useMyListingsStore from "@/app/hooks/useMyListingsStore";

interface UpdateListingModalProps {
  listing: ListingItem;
  onClose: () => void;
  isOpen: boolean;
  onSuccess: () => void;
}

const UpdateListingModal = ({
  listing,
  onClose,
  isOpen,
  onSuccess
}: UpdateListingModalProps) => {
  const { currency } = useCurrencyInfo();
  const account = useActiveAccount();
  const [isDisabled, setIsDisabled] = useState(false);
  const listingsStore = useMyListingsStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>();

  const currencyAddress = watch("currencyAddress");
  const assetPrice = watch("assetPrice");

  // Format the currency options
  const formattedCurrency = useMemo(() => {
    return currency.map((item) =>
      item.address === "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0"
        ? { ...item, address: NATIVE_TOKEN }
        : item,
    );
  }, [currency]);

  // Find the matched currency option
  const matchedCurrency = useMemo(() => {
    return formattedCurrency.find(
      (option) =>
        option.address.toLowerCase() === listing.currency!.toLowerCase(),
    );
  }, [formattedCurrency, listing.currency]);

  // Reset form when listing changes
  useEffect(() => {
    if (listing && matchedCurrency) {
      reset({
        currencyAddress: matchedCurrency,
        assetPrice: listing.pricePerToken,
      });
    }
  }, [listing, matchedCurrency, reset]);

  const setCustomValues = useCallback(
    (key: string, value: any) => {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  const onSubmit: SubmitHandler<FieldValues> = async(data) => {
    
    if (account) {
      try{
      setIsDisabled(true);
      console.log(data.assetPrice, data.currencyAddress.address)
     await updateListing(listing.listingId, data.currencyAddress.address, data.assetPrice,  account).then(async(data) => {
     if(data?.success){
      toast.success(data.message)
      
      onClose()
      onSuccess()
       await listingsStore.refreshListings();

     } else {
      toast.error(data.message)
     }
     })
      

      } catch(error: any){
        toast.error(error.message)
        console.error(error)
      }
      finally{
        setIsDisabled(false)
      }
      // Add your logic for submitting the updated listing here
    } else {
      onClose();
      showToast()
    }
  };

  const bodyContent = (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="assetPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Token price
        </label>
        <input
          type="number"
          id="assetPrice"
          {...register("assetPrice", { required: true })}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-black focus:border-black ${
            errors.assetPrice ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="0"
          value={assetPrice || ""} // Add watched value
          onChange={(e) => setCustomValues("assetPrice", e.target.value)}
        />
      </div>

      <CurrencySelect
        value={currencyAddress} // Pass the watched value
        onChange={(selectedOption) => {
          setCustomValues("currencyAddress", selectedOption);
        }}
      />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionlabel="Submit"
      title="Edit Listing"
      body={bodyContent}
      disabled={isDisabled}
    />
  );
};

export default UpdateListingModal;
