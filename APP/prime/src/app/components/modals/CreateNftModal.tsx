"use client";

import Modal from "./Modal";
import { useCallback, useMemo, useState } from "react";
import useCreateNftModal from "@/app/hooks/useCreateNftModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

import Heading from "../Heading";
import ToggleSwitch from "../ToggleSwitch";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import createNFT from "@/app/contracts/createNFT";
import { useActiveAccount } from "thirdweb/react";
import { showToast } from "../WalletToast";
import toast from "react-hot-toast";
import useCreateListingModal from "@/app/hooks/useCreateListingModal";
import { useNotificationStore } from "@/app/hooks/useNotifStore";
import { blobUrlToBase64 } from "@/app/utils/blobUrlToBase64";

enum STEPS {
  TYPE = 0,
  IMAGE = 1,
  INFO = 2,
}

export enum NFT_TYPE {
  SINGLE,
  MULTIPLE,
}

export default function CreateNFTModal() {
  const [selectedType, setSelectedType] = useState<NFT_TYPE>();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const createListingModal = useCreateListingModal();
  const nftModal = useCreateNftModal();
  const account = useActiveAccount();
  const [checked, setChecked] = useState(true);
  const { setNftAddress, getNftAddresses } = useNotificationStore();
  const { mutate } = useSWRConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      nftType: undefined,
      image: File,
      name: "",
      description: "",
      royalties: 0,
      amountToMint: 1,
      symbol: "",
    },
    mode: "onSubmit", // Validate on form submission
    reValidateMode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
  if (step !== STEPS.INFO) {
    return onNext();
  }

  if (account) {
    setIsLoading(true);
    try {
      await createNFT(account, data).then(async (result) => {
        if (result.success) {
          nftModal.onClose();
          toast.success(result.message);
          const currentAddresses = getNftAddresses();
          
          // Convert preview blob URL to base64
          const base64Image = await blobUrlToBase64(preview);
          
          setNftAddress([
            ...currentAddresses,
            {
              address: result.contractAddress!,
              timestamp: Math.floor(Date.now() / 1000),
              image: base64Image!, // Store base64 instead of blob URL
              name: data.name,
            },
          ]);
          
          reset();
          await mutate("fetchMyNotifications");
          setSelectedType(undefined);
          setChecked(false);
          setStep(STEPS.TYPE);
          setPreview("");
          if (checked) {
            createListingModal.onOpen();
            createListingModal.setAddress(result.contractAddress!);
          }
        } else {
          toast.error(result.message);
        }
      });
    } catch (error) {
      toast.error("Unexpected error occurred, Try again");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  } else {
    nftModal.onClose();
    showToast();
  }
};

  const nftTypeLabel = useCallback(() => {
    if (
      selectedType === NFT_TYPE.SINGLE ||
      selectedType === NFT_TYPE.MULTIPLE
    ) {
      return "Next";
    } else {
      return undefined;
    }
  }, [selectedType]);

  const amountToMint = watch("amountToMint");
  const setCustomValues = useCallback(
    (key: any, value: string | number | File | null) => {
      setValue(key, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  const increment = () => {
    const currentValue = parseInt(amountToMint) || 0;
    setCustomValues("amountToMint", currentValue + 1);
  };

  const decrement = () => {
    const currentValue = parseInt(amountToMint) || 1;
    setCustomValues("amountToMint", currentValue - 1);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.[0]) {
        const selectedFile = acceptedFiles[0];
        setCustomValues("image", selectedFile);
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);
        console.log(previewUrl);
      }
    },
    [setCustomValues],
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".svg"],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    multiple: false,
    onDrop,
    noClick: true,
  });

  const [step, setStep] = useState(STEPS.TYPE);
  const onBack = () => {
    setStep((value) => value - 1);
  };
  const onNext = () => {
    if (step === STEPS.IMAGE) {
      if (!preview) {
        toast.error("Please select an image");
        return;
      }
    }
    setStep((value) => value + 1);
  };

  const handleSelect = (type: NFT_TYPE) => {
    setSelectedType(type);
    setCustomValues("nftType", type);
  };

  const actionLabel = useMemo(() => {
    switch (step) {
      case STEPS.TYPE:
        return nftTypeLabel();
      case STEPS.IMAGE:
        return "Next";
      case STEPS.INFO:
        return "Submit";
      default:
        return "Next";
    }
  }, [step, nftTypeLabel]);

  const secondaryActionLabel = useMemo(() => {
    switch (step) {
      case STEPS.TYPE:
        return undefined;
      case STEPS.IMAGE:
        return "Back";
      case STEPS.INFO:
        return "Back";
      default:
        return "Back";
    }
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col  gap-7">
      <Heading
        title="Choose Type"
        subtitle="Select the type of NFT you want to create"
      />
      <div className="flex  w-[90] justify-between space-x-3">
        <div
          onClick={() => handleSelect(NFT_TYPE.SINGLE)}
          className={`${selectedType == NFT_TYPE.SINGLE ? "border-pink-500 border" : "border-gray-300 border"}  rounded-lg p-2 cursor-pointer`}
        >
          <div className="text-center">
            <div className="md:text-lg text-sm font-black">Single</div>
            <div className="font-light text-neutral-500 mt-2 md:text-sm text-xs">
              Create a single unique piece of art
            </div>
          </div>
        </div>
        <div
          onClick={() => handleSelect(NFT_TYPE.MULTIPLE)}
          className={`${selectedType == NFT_TYPE.MULTIPLE ? "border-pink-500 border" : "border-gray-300 border"}  rounded-lg p-2 cursor-pointer`}
        >
          <div className="text-center">
            <div className="md:text-lg text-sm font-black">Multiple</div>
            <div className="font-light text-neutral-500 mt-2 md:text-sm text-xs">
              Create multiple unique piece of art
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (step == STEPS.IMAGE) {
    bodyContent = (
      <div className="flex flex-col  gap-7">
        <Heading subtitle="Enter the image of your NFT" />

        <label
          htmlFor="image"
          className="flex flex-col items-center relative w-[60%] md:py-16 py-10 px-5 max-w-md mx-auto mt-3 bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl"
          {...getRootProps()}
        >
          {preview ? (
            <Image
              src={preview}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg absolute top-0 left-0"
              sizes="(max-width: 640px) 20vw, 40vw"
              priority
              alt=""
            />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-8 h-8 text-gray-500 dark:text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
              <h2 className="mt-1 text-sm font-medium tracking-wide text-gray-700 dark:text-gray-200">
                Art File
              </h2>

              <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
                Upload or drag & drop your file SVG, PNG, JPG or GIF.{" "}
              </p>
            </>
          )}

          <input id="image" {...getInputProps()} className="hidden" />
        </label>
      </div>
    );
  }

  if (step == STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-4 md:gap-7">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="name"
                className="block text-xs md:text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", {
                  required: true,
                  maxLength: 25,
                })}
                className={`${errors.name ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px]`}
                placeholder="My NFT"
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="symbol"
                className="block text-xs md:text-sm font-medium text-gray-700"
              >
                Symbol
              </label>
              <input
                type="text"
                id="symbol"
                {...register("symbol", {
                  required: true,
                  maxLength: 5,
                })}
                className={`${errors.symbol ? "border-red-500" : "border-gray-300"} mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder:text-[13px]`}
                placeholder="MUN"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="block text-xs md:text-sm font-medium text-gray-700"
            >
              Description{" "}
              <span className=" text-xs md:text-sm font-medium text-gray-700">
                (Optional)
              </span>
            </label>

            <textarea
              id="description"
              placeholder="Tell people about your NFT"
              className="block font-xs mt-1 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-4 h-26 py-2.5 text-black placeholder:text-[12px] md:placeholder:text-[13px]"
              {...register("description", {
                maxLength: 500,
              })}
            ></textarea>
          </div>
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="royalties"
              className="block text-xs md:text-sm font-medium text-gray-700"
            >
              Royalties
            </label>
            <input
              type="number"
              min="0"
              max="50"
              id="royalties"
              className="border-2 border-gray-300 rounded-lg mt-1 p-2 w-full pl-6 placeholder:text-[12px] md:placeholder:text-[13px]"
              {...register("royalties", {
                min: 0,
                max: 50,
              })}
              placeholder="10"
            />
            <div className="absolute left-2 top-1/2">%</div>
          </div>
          <div className="md:text-xs text-[8px] text-gray-500">
            {" "}
            Suggested: 0%, 10%, 20%, 30%. Maximum is 50%
          </div>
          {selectedType === NFT_TYPE.MULTIPLE && (
            <div className="flex justify-between w-full">
              <span className=" md:text-xs text-[8px] font-black ">
                How many would you like to mint?
              </span>
              <div className="flex w-[40%] justify-between">
                <span
                  onClick={decrement}
                  className=" text-black md:text-2xl text-lg cursor-pointer w-[5%]"
                >
                  -
                </span>
                <div className="">
                  <input
                    type="number"
                    id="amountToMint"
                    {...register("amountToMint", {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const value = parseInt(e.target.value);
                        setCustomValues("amountToMint", value);
                      },
                      min: 1,
                    })}
                    className="border-b md:text-base w-[90%] text-sm border-b-black border-0 focus:border-b focus:border-b-black focus:border-0 focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <span
                  onClick={increment}
                  className="text-black md:text-2xl text-lg cursor-pointer w-[5%]"
                >
                  +
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <div className="text-black font-bold block md:text-xs text-[10px]">
              Put on marketplace
            </div>
            <div className="flex flex-end">
              <ToggleSwitch
                checked={checked}
                onChange={() => {
                  setChecked(!checked);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Modal
        title="Create your NFT"
        isOpen={nftModal.isOpen}
        onClose={nftModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        actionlabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryActions={step === STEPS.TYPE ? undefined : onBack}
        disabled={step === STEPS.INFO && isLoading}
        body={bodyContent}
      />
    </div>
  );
}
