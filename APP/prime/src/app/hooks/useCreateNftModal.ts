import { create } from "zustand";

interface CreateNftModalStore {
  isOpen: boolean;
  onMarket: boolean;
  setOnMarket: (value: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
}

const useCreateNftModal = create<CreateNftModalStore>((set) => ({
  isOpen: false,
  onMarket: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setOnMarket: (onMarket) => set({ onMarket: onMarket})
}));

export default useCreateNftModal;
