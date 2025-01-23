import { create } from "zustand";

interface CreateAuctionModalStore {
  isOpen: boolean;
  onMarket: boolean;
  setOnMarket: (value: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
  mutateListing: () => void;
  setMutateListings: (fn: () => void) => void
}

const useCreateAuctionModal = create<CreateAuctionModalStore>((set) => ({
  isOpen: false,
  onMarket: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setOnMarket: (onMarket) => set({ onMarket: onMarket}),
  mutateListing: () => {},
  setMutateListings: (fn) => set({mutateListing: fn})
}));

export default useCreateAuctionModal;
