"use client"

import Button from "@/app/components/Button";
import {PuffLoader} from 'react-spinners'
import Image from "next/image";
import {useCallback, useMemo} from "react"
import { getContract, NFT, toEther } from "thirdweb";
import useDialog from "@/app/hooks/useDialog";
import useBuyModal from "@/app/hooks/useBuyModal";
import { getListing } from "@/app/contracts/listing"; 
import { anvil } from "thirdweb/chains";
import { fetchNFT } from "@/app/contracts/getPlatformInfo"; 
import { client } from "@/app/client";
import useSWR from "swr";
import useOfferModal from "@/app/hooks/useOfferModal";
import Error from "@/app/components/Error";
import {useWindowWidth} from '@react-hook/window-size'
import { fetchTokenInfo } from "@/app/hooks/useCurrencyInfo";
import SkeletonListingDetails from "@/app/components/card/ListingSkeletonCard"
import { ipfsToHttp } from "@/app/utils/IpfsToHttp";
import { chain } from "@/app/constant";



interface ListingDetailsProps {
  listingId : string;
}



   
 

export default function ListingDetails({listingId}: ListingDetailsProps) {
  const dialog = useDialog();
  const buyModal = useBuyModal();
  const offer = useOfferModal();

  const width = useWindowWidth();
  
      const size = useMemo(() => {
          
           if (width > 768) {
              return 20
           }
          else {
              return 10
          }                        
      }, [width])
  

  const makeOffer = useCallback(() => {
     offer.setListingId(BigInt(listingId));
     offer.onOpen();
    }, [listingId, offer]) 


    const fetchListing = useCallback(async () => {
    try {
      const listing = await getListing(BigInt(listingId));

      const contract = getContract({
        client,
        chain,
        address: listing.assetContract,
      });

      const nft = await fetchNFT(contract, listing);
       const currency = await fetchTokenInfo(listing.currency);
    
      return {
        ...listing, 
        nft: nft || null,
        currencySymbol: currency.symbol
      };
    
    } catch(error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  }, [listingId]);

  // Use SWR with optimized configuration
  const { 
    data, 
    error,
    isLoading,
    mutate,
  } = useSWR('listing/' + listingId, fetchListing, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true
    });

    const listingStatus=useMemo(() => {
      console.log(data?.status)
      if(data?.status == 1){
        return "Live";
      }
      else if(data?.status == 2){
        return "Sold";
      }
      else if(data?.status == 3){
        return "Cancelled";
      }
      else {
        return "Unactive";
      }
}, [data?.status])

 const tokenStandard = useMemo(() => {
    if(data?.tokenType == 0) {
      return "ERC-721";
    }
    else {
      return "ERC-1155";
    }
  }, [data?.tokenType])

 

  // Memoized computations
  const endTime = useMemo(() => {
    if (data?.endTimestamp && data?.startTimestamp) {
      const remainingDays = Math.floor(Number(data.endTimestamp - data.startTimestamp)) / 86400;
      if(remainingDays > 1) {
        return `${remainingDays} Days left`
      }
     return '1 Day left'
    }
    return null;
  }, [data?.endTimestamp, data?.startTimestamp]);

  const rotationStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(132deg, #5ddcff, #3c67e3 43%, #4e00c2)`,
  }), []);

  // Memoized buy listing handler
  const buyListing = useCallback(() => {
    if (data) {
      buyModal.setListingId(data.listingId);
      dialog.onOpen();
      buyModal.setMutateListings(async() => { mutate}) 
    } 
  }, [data, buyModal, dialog, mutate]);

   const imageUrl = useMemo(() => {
    try {
      if (data?.nft?.metadata?.image) {
        return ipfsToHttp(data.nft.metadata.image);
      }
      return "";
    } catch (error) {
      console.error('Error processing image URL:', error);
      return "";
    }
  }, [data?.nft?.metadata?.image]);

  
  if(error) {
    return <Error error={error}/>
  }

  if(isLoading) {
    return <SkeletonListingDetails/>
  }


  if(data) {
   
  return (
    <div className="flex flex-col space-y-10 w-full mb-8 items-center">
      <div className="relative w-[90%] h-[35vh] md:h-[50vh] lg:h-[80vh] aspect-[3/4] group">
        {/* Animated border gradient */}
        <div 
          className="absolute inset-[-1%] z-[-1] rounded-lg opacity-100 duration-200"
          style={rotationStyle}
        />
        
        {/* Blur effect */}
        <div
          className="absolute top-1/6 inset-x-0 w-full h-full mx-auto scale-80 opacity-100 duration-500 blur-xl"
          style={{
            ...rotationStyle,
            zIndex: -1,
          }}
        />


        {/* Main card content */}
        <div className="flex flex-row justify-between h-full">
          <div className="md:w-[45%] w-[40%] h-full flex items-center justify-center">
            <div className="relative md:w-[80%] w-[90%] md:h-[70%] h-[80%]"> 
              <Image
                className=""
                src={
               imageUrl
                }
                alt={
                  data.nft?.metadata.name!
                }
                quality={90}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 640px) 80vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 20vw"
              />
            </div>
          </div>

       
          <div className="md:w-[55%] w-[60%] h-full flex items-center lg:pl-24">
            <div className="flex flex-col space-y-2 md:space-y-6 w-full">
           <div className="flex space-x-2 items-center">
          {data.status === 1 ? (
      <PuffLoader 
      color="red"
      size={size} 
       /> 
      ) : ( 
     <div className="bg-red-500 w-3 h-3 rounded-full"></div>
  )} 
  <div className="text-gray-300 md:text-sm text-[9px] lg:text-lg">
    {listingStatus} 
    </div>
</div>
            <div className="capitalize text-white text-[10px] md:text-base lg:text-2xl truncate">
               {data.nft?.metadata.name}{" "}#{data.tokenId.toString()}
              </div>
            <div className="text-gray-300 md:text-sm text-[9px] lg:text-lg">Listed by: {"  "}
              <span className="text-white text-[7px] md:text-xs break-words">                
                {data.listingCreator} 
                </span>
              </div>
              <div className="text-gray-300 md:text-sm text-[9px] lg:text-lg ">Price: {"  "}
                <span className="text-white text-[7px] md:text-xs capitalize">
                  {toEther(data.pricePerToken)}{" "}{data.currencySymbol}
                    </span>
                </div>    
                 {data.reserved && ( 
                  <div className="text-gray-300 text-[10px] md:text-base lg:text-2xl capitalize font-black">Reserved</div>
                 )}
              <div className="flex lg:space-x-3 space-x-1">
              <Button actionLabel='Buy listing' size='medium' color='primary' action={
               
                buyListing} ClassName="w-auto" />
              <Button actionLabel='Make Offer' size='medium' color='secondary' action={makeOffer} ClassName="w-auto"/>
            </div>
            
            <div className="flex items-center ">
              <div className="space-x-4 text-[7px] md:text-xs">
             ⏰
             </div>
              <div className="text-gray-300 text-[7px] md:text-xs">
                 {endTime}
                {/* 10 Days left */}
                </div>
            </div>
            </div>
          </div>
        </div>

        {/* Existing details section */}
        
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { --rotate: 0deg; }
          100% { --rotate: 360deg; }
        }

        @property --rotate {
          syntax: "<angle>";
          initial-value: 132deg;
          inherits: false;
        }
      `}</style>
    <div className="lg:h-[100vh] h-[90%] flex justify-center w-full items-center">
         <div className='lg:border-gray-400 lg:border-2 lg:h-[80vh] h-[90%] w-[90%] rounded-lg'>
          
          <div className='lg:flex w-full h-[90%] justify-evenly space-y-6 lg:space-y-1 items-center'>
              <div className="lg:w-[30%] w-full border-gray-400 border-2 h-[30vh] lg:h-[80%] rounded-lg p-2">
                <div className='w-full border-gray-400 border-b-2 text-center md:text-base text-sm lg:text-lg font-bold'>Details</div>
                <div className="w-full h-full flex-col items-stretch">
                  <div className='w-full h-[25%] border-gray-400 border-b-2 md:text-sm text-[9px] lg:text-lg font-semibold'>Asset Contract:{' '}<span className='text-[7px] md:text-xs break-words'>
                    {data.assetContract}
                    </span></div>
                  <div className='w-full h-[25%] border-gray-400 border-b-2 md:text-sm text-[9px] lg:text-lg font-semibold'>Asset Id:{' '}<span className='text-[7px] md:text-xs'>
                     #{data.tokenId.toString()} 
                    {/* #1 */}
                    </span> </div>
                  <div className='w-full h-[25%] border-gray-400 border-b-2 md:text-sm text-[9px] lg:text-lg font-semibold'>Asset Standard:{' '}<span className='text-[7px] md:text-xs'>
                    {tokenStandard}
                    {/* ERC-1155 */}
                    </span></div>
                  <div className='w-full h-[25%] md:text-sm text-[9px] lg:text-lg font-semibold'>Royalty:{' '}<span className='text-[7px] md:text-xs'>10%</span></div>
                </div>
           </div>

             <div className="lg:w-[50%] w-full border-gray-400 border-2 h-[40vh] lg:h-[80%] rounded-lg break-words overflow-y-auto p-2">
                <div className='w-full border-gray-400 border-b-2 capitalize text-center md:text-base text-sm lg:text-lg font-bold'>Description</div>
                <div className="md:text-base text-xs">
                {data.nft?.metadata.description}
                
                </div>
                
             </div>
          </div>

         </div>    
      </div>
    </div>
  );
}
};


