import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  syncWithServer: (userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, item],
        }));
      },
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== itemId),
        }));
      },
      isInWishlist: (itemId) => {
        return get().items.some((item) => item._id === itemId);
      },
      syncWithServer: async (userId) => {
        try {
          // Fetch wishlist from server
          const response = await fetch(`/api/wishlist/${userId}`);
          if (!response.ok) throw new Error("Failed to fetch wishlist");
          const data = await response.json();

          // Update local state with server data
          set({ items: data.items });
        } catch (error) {
          console.error("Error syncing wishlist:", error);
        }
      },
    }),
    {
      name: "wishlist-storage",
    },
  ),
);
