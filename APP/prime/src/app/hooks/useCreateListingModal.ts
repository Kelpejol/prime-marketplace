import { create } from "zustand";

interface CreateListingModalStore {
  isOpen: boolean;
  onMarket: boolean;
  setOnMarket: (value: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
 
}

const useCreateListingModal = create<CreateListingModalStore>((set) => ({
  isOpen: false,
  onMarket: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setOnMarket: (onMarket) => set({ onMarket: onMarket}),
}));

export default useCreateListingModal;
