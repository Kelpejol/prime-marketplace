import { create } from "zustand";

interface BuyModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  listingId: bigint | null;
  setListingId: (id: bigint) => void;
  mutateListing: () => Promise<void>;
  setMutateListings: (fn: () => Promise<void>) => void

}

const useBuyModal = create<BuyModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }), 
  listingId: null,
  setListingId: (id) => set({listingId: id}),
  mutateListing: async() => {},
  setMutateListings: (fn) => set({mutateListing: fn})
}));

export default useBuyModal;
