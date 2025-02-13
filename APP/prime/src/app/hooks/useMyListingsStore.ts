import { create } from 'zustand';

// Define the type for the mutation function
type MutateFn = (() => void) | (() => Promise<void>) | null;

// Interface for the store state
interface MyListingsState {
  mutate: MutateFn;
  isLoading: boolean;
}

// Interface for the store actions
interface MyListingsActions {
  setMutate: (mutateFn: MutateFn) => void;
  refreshListings: () => Promise<void>;
}

// Combined interface for the entire store
interface MyListingsStore extends MyListingsState, MyListingsActions {}

// Create the typed store
const useMyListingsStore = create<MyListingsStore>((set) => ({
  // Initial state
  mutate: null,
  isLoading: false,

  // Actions
  setMutate: (mutateFn: MutateFn) => {
    set((state) => {
      if (state.mutate !== mutateFn) {
        return { mutate: mutateFn };
      }
      return state;
    });
  },

  refreshListings: async () => {
    set((state) => {
      state.mutate?.();
      return state;
    });
  },
}));

export default useMyListingsStore;