import { create } from "zustand";

interface OfferModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  listingId: bigint | null;
  setListingId: (id: bigint) => void;

}

const useOfferModal = create<OfferModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }), 
  listingId: null,
  setListingId: (id) => set({listingId: id}),
  
}));

export default useOfferModal;
