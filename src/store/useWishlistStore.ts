import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductItem } from "@/lib/products";

interface WishlistStoreState {
  wishlistItems: ProductItem[];
  isWishlistOpen: boolean;

  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlistDrawer: () => void;
  toggleWishlist: (product: ProductItem) => void;
  isInWishlist: (slug: string) => boolean;
  removeFromWishlist: (slug: string) => void;
  clearWishlist: () => void;
  wishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set, get) => ({
      wishlistItems: [],
      isWishlistOpen: false,

      openWishlist: () => set({ isWishlistOpen: true }),
      closeWishlist: () => set({ isWishlistOpen: false }),
      toggleWishlistDrawer: () => set((state) => ({ isWishlistOpen: !state.isWishlistOpen })),

      toggleWishlist: (product) => {
        const exists = get().wishlistItems.some((item) => item.slug === product.slug);
        if (exists) {
          set({ wishlistItems: get().wishlistItems.filter((i) => i.slug !== product.slug) });
        } else {
          set({ wishlistItems: [product, ...get().wishlistItems] });
        }
      },

      isInWishlist: (slug) => get().wishlistItems.some((item) => item.slug === slug),

      removeFromWishlist: (slug) => {
        set({ wishlistItems: get().wishlistItems.filter((i) => i.slug !== slug) });
      },

      clearWishlist: () => set({ wishlistItems: [] }),

      wishlistCount: () => get().wishlistItems.length,
    }),
    {
      name: "lumina_zustand_wishlist_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
