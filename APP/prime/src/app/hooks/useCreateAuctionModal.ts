import { create } from "zustand";

interface CreateAuctionModalStore {
  isOpen: boolean;
  onMarket: boolean;
  setOnMarket: (value: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
  
}

const useCreateAuctionModal = create<CreateAuctionModalStore>((set) => ({
  isOpen: false,
  onMarket: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setOnMarket: (onMarket) => set({ onMarket: onMarket}),
  
}));

export default useCreateAuctionModal;
