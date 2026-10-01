import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductItem } from "@/lib/products";

export type CartItem = {
  id: string;
  productSlug: string;
  title: string;
  price: number;
  image: string;
  vendor: string;
  categorySlug?: string;
  categoryName?: string;
  size: string;
  quantity: number;
};

export type ToastItem = {
  id: string;
  itemTitle: string;
  itemImage: string;
  timestamp: number;
};

export type ToastState = {
  show: boolean;
  itemTitle: string;
  itemImage: string;
} | null;

export type AddToCartOptions = {
  product: ProductItem;
  quantity?: number;
  size?: string;
  openDrawer?: boolean;
};

interface CartStoreState {
  cartItems: CartItem[];
  savedForLaterItems: CartItem[];
  isCartOpen: boolean;
  toasts: ToastItem[];
  toast: ToastState;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (options: AddToCartOptions) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeFromSavedForLater: (id: string) => void;
  hideToast: (id?: string) => void;

  // Computed Getters
  cartCount: () => number;
  productCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      savedForLaterItems: [],
      isCartOpen: false,
      toasts: [],
      toast: null,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addToCart: ({ product, quantity = 1, size = "Default", openDrawer = false }) => {
        const cartId = `${product.slug}-${size}`;
        const existing = get().cartItems.find((item) => item.id === cartId);

        let newItems: CartItem[];
        if (existing) {
          newItems = get().cartItems.map((item) =>
            item.id === cartId ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          const newItem: CartItem = {
            id: cartId,
            productSlug: product.slug,
            title: product.title,
            price: product.price,
            image: product.image,
            vendor: product.brand || "LUMINA Exclusive",
            categorySlug: product.categorySlug,
            categoryName: product.categorySlug.toUpperCase(),
            size,
            quantity,
          };
          newItems = [newItem, ...get().cartItems];
        }

        const newToast: ToastItem = {
          id: `toast-${Date.now()}-${Math.random()}`,
          itemTitle: product.title,
          itemImage: product.image,
          timestamp: Date.now(),
        };

        set({
          cartItems: newItems,
          isCartOpen: openDrawer ? true : get().isCartOpen,
          toast: { show: true, itemTitle: product.title, itemImage: product.image },
          toasts: [newToast, ...get().toasts].slice(0, 3),
        });
      },

      removeFromCart: (id) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(99, quantity) } : item
          ),
        });
      },

      clearCart: () => set({ cartItems: [] }),

      saveForLater: (id) => {
        const itemToSave = get().cartItems.find((i) => i.id === id);
        if (!itemToSave) return;
        set({
          cartItems: get().cartItems.filter((i) => i.id !== id),
          savedForLaterItems: [itemToSave, ...get().savedForLaterItems],
        });
      },

      moveToCart: (id) => {
        const itemToMove = get().savedForLaterItems.find((i) => i.id === id);
        if (!itemToMove) return;
        set({
          savedForLaterItems: get().savedForLaterItems.filter((i) => i.id !== id),
          cartItems: [itemToMove, ...get().cartItems],
        });
      },

      removeFromSavedForLater: (id) => {
        set({
          savedForLaterItems: get().savedForLaterItems.filter((i) => i.id !== id),
        });
      },

      hideToast: (id) => {
        if (id) {
          set({ toasts: get().toasts.filter((t) => t.id !== id) });
        } else {
          set({ toast: null, toasts: [] });
        }
      },

      cartCount: () => get().cartItems.reduce((acc, item) => acc + item.quantity, 0),
      productCount: () => get().cartItems.length,
      subtotal: () => get().cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: "lumina_zustand_cart_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cartItems: state.cartItems,
        savedForLaterItems: state.savedForLaterItems,
      }),
    }
  )
);
