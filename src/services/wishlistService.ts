import type { ProductItem } from "@/lib/products";

const LOCAL_STORAGE_KEY = "lumina_wishlist_v1";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const wishlistService = {
  getWishlist: async (): Promise<ProductItem[]> => {
    // await delay(500); // Simulate network
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  },

  toggleWishlist: async (product: ProductItem): Promise<ProductItem[]> => {
    // await delay(500); // Simulate network
    if (typeof window === "undefined") return [];
    
    let currentWishlist: ProductItem[] = [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        currentWishlist = JSON.parse(saved);
      }
    } catch {}

    const exists = currentWishlist.some((item) => item.slug === product.slug);
    let updatedWishlist: ProductItem[];

    if (exists) {
      updatedWishlist = currentWishlist.filter((item) => item.slug !== product.slug);
    } else {
      updatedWishlist = [...currentWishlist, product];
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedWishlist));
    return updatedWishlist;
  },

  removeFromWishlist: async (productSlug: string): Promise<ProductItem[]> => {
    if (typeof window === "undefined") return [];
    
    let currentWishlist: ProductItem[] = [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        currentWishlist = JSON.parse(saved);
      }
    } catch {}

    const updatedWishlist = currentWishlist.filter((item) => item.slug !== productSlug);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedWishlist));
    return updatedWishlist;
  },

  clearWishlist: async (): Promise<ProductItem[]> => {
    if (typeof window === "undefined") return [];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    return [];
  }
};
