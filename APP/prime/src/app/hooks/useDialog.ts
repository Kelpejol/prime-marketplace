import { create } from "zustand";

interface DialogStore {
  isOpen: boolean;
 option: boolean;
  onOpen: () => void;
  onClose: () => void;
  setNo: () => void;
  setYes: () => void
}

const useDialog = create<DialogStore>((set) => ({
  isOpen: false,
  option: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setNo: () => set({ option: false }),
  setYes: () => set({ option: true })
 
}));

export default useDialog;
