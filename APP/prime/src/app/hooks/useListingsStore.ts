import { create } from 'zustand';

// Define the type for the mutation function
type MutateFn = (() => void) | (() => Promise<void>) | null;

// Interface for the store state
interface ListingsState {
  mutate: MutateFn;
  isLoading: boolean;
}

// Interface for the store actions
interface ListingsActions {
  setMutate: (mutateFn: MutateFn) => void;
  refreshListings: () => void;
}

// Combined interface for the entire store
interface ListingsStore extends ListingsState, ListingsActions {}

// Create the typed store
const useListingsStore = create<ListingsStore>((set) => ({
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

  refreshListings: () => {
    set((state) => {
      state.mutate?.();
      return state;
    });
  },
}));

export default useListingsStore;