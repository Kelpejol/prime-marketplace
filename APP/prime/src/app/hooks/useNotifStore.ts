import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NFTAddressData {
  address: string;
  timestamp: number;
  image: string;
  name: string
}

interface NotificationStore {
  readNotifications: string[];
  unreadCount: number;
  isRehydrated: boolean;
  setIsRehydrated: (value: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (ids: string[]) => void;
  setUnreadCount: (count: number) => void;
   nftAddresses: NFTAddressData[];
  setNftAddress: (data: NFTAddressData[]) => void;
  getNftAddresses: () => NFTAddressData[];
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      readNotifications: [],
      unreadCount: 0,
      isRehydrated: false,
      nftAddresses: [], // Initialize empty array
      setIsRehydrated: (value: boolean) => set({ isRehydrated: value }),
      markAsRead: (id: string) =>
        set((state) => ({
          readNotifications: [...new Set([...state.readNotifications.filter((existingId) => existingId !== null), id])],
        })),
      markAllAsRead: (ids: string[]) =>
        set((state) => ({
          readNotifications: [...new Set([...state.readNotifications.filter((existingId) => existingId !== null), ...ids.filter((id) => id !== null)])],
        })),
      setUnreadCount: (count: number) => set({ unreadCount: count }),
      setNftAddress: (NFTAddressData: NFTAddressData[]) => set({ nftAddresses: NFTAddressData }),
      getNftAddresses: () => get().nftAddresses,
    }),
    {
      name: 'notification-storage',
      onRehydrateStorage: (state) => {
        return (state) => {
          if (state) {
            state.setIsRehydrated(true);
          }
        };
      }
    }
  )
);