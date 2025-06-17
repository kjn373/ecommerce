import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ApiCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  syncWithDatabase: () => Promise<void>;
  loadFromDatabase: () => Promise<void>;
  resetCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i._id === item._id);

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
            total: get().total + item.price,
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: 1 }],
            total: get().total + item.price,
          });
        }

        // Sync with database after adding item
        get().syncWithDatabase();
      },
      removeItem: (itemId) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find((i) => i._id === itemId);

        if (itemToRemove) {
          set({
            items: currentItems.filter((i) => i._id !== itemId),
            total: get().total - itemToRemove.price * itemToRemove.quantity,
          });

          // Sync with database after removing item
          get().syncWithDatabase();
        }
      },
      updateQuantity: (itemId, quantity) => {
        const currentItems = get().items;
        const item = currentItems.find((i) => i._id === itemId);

        if (item) {
          const quantityDiff = quantity - item.quantity;
          set({
            items: currentItems.map((i) =>
              i._id === itemId ? { ...i, quantity } : i,
            ),
            total: get().total + item.price * quantityDiff,
          });

          // Sync with database after updating quantity
          get().syncWithDatabase();
        }
      },
      clearCart: () => {
        set({ items: [], total: 0 });

        // Sync with database after clearing cart
        get().syncWithDatabase();
      },
      resetCart: () => {
        // This function is specifically for when a user logs out
        // We don't sync with the database since the user is no longer authenticated
        set({ items: [], total: 0 });
      },
      syncWithDatabase: async () => {
        try {
          // Check if user is logged in by making a GET request that will include session info
          const response = await fetch("/api/cart", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: get().items.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                images: [item.image],
              })),
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to sync cart with database");
          }
        } catch (error) {
          console.error("Error syncing cart with database:", error);
        }
      },
      loadFromDatabase: async () => {
        try {
          const response = await fetch("/api/cart");

          if (!response.ok) {
            throw new Error("Failed to load cart from database");
          }

          const data = await response.json();

          // Only update if we have items in the response and it's a proper cart object
          if (data && data.items) {
            const cartItems = data.items.map((item: ApiCartItem) => ({
              _id: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image:
                item.images && item.images.length > 0 ? item.images[0] : "",
            }));

            const cartTotal = cartItems.reduce(
              (sum: number, item: CartItem) => sum + item.price * item.quantity,
              0,
            );

            set({
              items: cartItems,
              total: cartTotal,
            });
          }
        } catch (error) {
          console.error("Error loading cart from database:", error);
        }
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items, total: state.total }),
    },
  ),
);
