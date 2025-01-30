import { create } from "zustand";

interface BuyModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  listingId: bigint | null;
  setListingId: (id: bigint) => void;
 

}

const useBuyModal = create<BuyModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }), 
  listingId: null,
  setListingId: (id) => set({listingId: id}),
 
}));

export default useBuyModal;
