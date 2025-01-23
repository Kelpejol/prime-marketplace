// "use client"




// import React, { useState } from 'react';
// import  Heading  from '@/app/components/Heading';
// import { TimeHelper } from '@/app/utils/timeFormatter';
// import { ListingType, updateListingPlan} from '@/app/contracts/listing';
// import { useActiveAccount } from 'thirdweb/react';
// import Modal from './Modal';
// import toast from 'react-hot-toast';
// import { showToast } from '@/app/components/WalletToast';
// import { FieldValues, SubmitHandler,  } from 'react-hook-form';



// interface ListingTypeData {
//     duration?: number;
//     price?: string;
// }

// interface UpdateListingPlanModalProps {
//   listingId: bigint,
//   onClose: () => void,
//   isOpen: boolean
// }

// const UpdateListingPlanModal = ({listingId, onClose, isOpen}:UpdateListingPlanModalProps) => {
//   const account = useActiveAccount();
//   const [listingPlan, setListingPlan] = useState<ListingType>(ListingType.BASIC);
//   const [basicData, setBasicData] = useState<ListingTypeData>();
//   const [advancedData, setAdvancedData] = useState<ListingTypeData>();
//   const [proData, setProData] = useState<ListingTypeData>();
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDisabled, setIsDisabled] = useState(false);

//   const handleListingPlan = (plan: ListingType) => {
//     setListingPlan(plan);
//   }

//   // const handleUpdateListingPlan = () => {
//   //   setIsDisabled(true);
//   //   updateListingPlan(listingId, listingPlan, account!).then((data) => {
//   //     if(data.success){
//   //       toast.success(data.message!);
//   //       onClose();
//   //     } else {
//   //       showToast();
//   //     }
//   //   })
//   // }


//    const onSubmit: SubmitHandler<FieldValues> = (data) => {
//      if (account) {
//       setIsDisabled(true);
//      updateListingPlan(listingId, listingPlan, account!).then((data) => {
//       if(data.success){
//         toast.success(data.message!);
//         onClose();
      
//         // updateListingModal.mutateListings();
//       }
//       else {
//         toast.error(data.message!);
//       }
//       setIsDisabled(false);
     
//     })
        
//      } else {
//        showToast();  
//      }
//   }  


//   const bodyContent = (
//        <div className="flex flex-col gap-6 ">
//          <Heading title="Choose Listing Plan" subtitle="Select the listing plan of your choice" titleClassName="text-xl font-bold ml-4" subtitleClassName="font-light text-sm text-neutral-500 mt-1 ml-4"/>
   
//         <div className="flex w-full justify-evenly items-center ">

//           <div className={`border border-gray-300 w-[30%] rounded-lg py-4 px-2 cursor-pointer ${listingPlan == ListingType.BASIC && ("bg-black text-white")}`} onClick={() => { handleListingPlan(ListingType.BASIC)}}>
//              <Heading title="Basic" subtitle={`$${basicData?.price}`} center titleClassName={`md:text-xl font-bold ${listingPlan == ListingType.BASIC && ("text-white")}`} subtitleClassName={`text-xs md:text-base font-light mt-1 ${listingPlan == ListingType.BASIC && ("text-white")}`}/>
//               <div className={`flex items-center justify-center font-semibold text-xs md:text-lg mt-1 ${listingPlan == ListingType.BASIC && ("text-white")}`}>
//                         {TimeHelper.formatDuration(basicData?.duration!)}
//               </div>
//            </div>

//            <div className={`border border-gray-300 w-[35%] rounded-lg py-5 px-2 cursor-pointer ${listingPlan == ListingType.ADVANCED && ("bg-black text-white")}`} onClick={() => { handleListingPlan(ListingType.ADVANCED)}}>
//              <Heading title="Advanced" subtitle={`$${advancedData?.price}`} center titleClassName={`md:text-xl font-bold ${listingPlan == ListingType.ADVANCED && ("text-white")}`}  subtitleClassName={`text-xs md:text-base font-light mt-1 ${listingPlan == ListingType.ADVANCED && ("text-white")}`}/>
//               <div className={`flex items-center justify-center font-semibold text-xs md:text-lg mt-1 ${listingPlan == ListingType.ADVANCED && ("text-white")}`}>
//                          {TimeHelper.formatDuration(advancedData?.duration!)}
//               </div>
//            </div>

//            <div className={`border border-gray-300 w-[30%] rounded-lg py-4 px-2 cursor-pointer ${listingPlan == ListingType.PRO && ("bg-black text-white")}`} onClick={() => { handleListingPlan(ListingType.PRO)}}>
//              <Heading title="Pro" subtitle={`$${proData?.price}`} center titleClassName={`md:text-xl font-bold ${listingPlan == ListingType.PRO && ("text-white")}`}  subtitleClassName={`text-xs md:text-base font-light mt-1 ${listingPlan == ListingType.PRO && ("text-white")}`}/>
//               <div className={`flex items-center justify-center font-semibold text-xs md:text-lg mt-1 ${listingPlan == ListingType.PRO && ("text-white")}`}>
//                         {TimeHelper.formatDuration(proData?.duration!)}
//               </div>
//            </div>
            
                
//             </div>
//             </div>
       
//      )
    

//   return (
//      <Modal
//         isOpen={isOpen}
//         onClose={onClose}
//         forwardLabel='Update'
//         forward={onSubmit}
//         body={bodyContent}
//         backward={() => {}}
//         backwardLabel=''
//         title="Update Listing Plan"
//         disabled={isDisabled}
//     />
//   )
// }

// export default UpdateListingPlanModal;
              

