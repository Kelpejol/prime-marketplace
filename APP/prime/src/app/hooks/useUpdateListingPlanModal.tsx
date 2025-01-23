


import {create} from "zustand";

interface UpdateListingPlanModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    listingId: bigint | null;
    setListingId: (id: bigint) => void;
  //   mutateListings: () => void;
  // setMutateListings: (fn: () => void) => void; 

   
}

const useUpdateListingPlanModal = create<UpdateListingPlanModalStore>((set) => ({
  isOpen: false,
  listingId: null,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
 setListingId: (id) => set({listingId: id}),
//  mutateListings: () => {},
//  setMutateListings: (fn) => set({mutateListings: fn})
}));

export default useUpdateListingPlanModal;






