import { create } from "zustand";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  properties?: Record<string, string | number | boolean | string[]>;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>()((set) => ({
  products: [],
  loading: false,
  error: null,
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data: products } = await axios.get("/api/products");
      set({ products, loading: false });
    } catch (error) {
      console.log(error);
      set({ error: "Failed to fetch products", loading: false });
    }
  },
}));
