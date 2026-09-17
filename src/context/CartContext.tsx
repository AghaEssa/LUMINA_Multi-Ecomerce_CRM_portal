"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { ProductItem } from "@/lib/products";
import { useAuth } from "@/context/AuthContext";

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

type AddToCartOptions = {
  product: ProductItem;
  quantity?: number;
  size?: string;
  openDrawer?: boolean;
};

type CartContextType = {
  cartItems: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  subtotal: number;
  toast: ToastState;
  toasts: ToastItem[];
  hideToast: (id?: string) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (options: AddToCartOptions) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const INITIAL_CART_ITEMS: CartItem[] = [];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { user, openAuthModal } = useAuth();

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const hideToast = useCallback((id?: string) => {
    if (id) {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    } else {
      setToasts([]);
    }
  }, []);

  const performAddToCart = useCallback(
    ({ product, quantity = 1, size = "M", openDrawer = false }: AddToCartOptions) => {
      const itemId = `${product.slug}-${size}`;
      const vendorName = product.brand || "John Enterprise";

      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === itemId);
        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        } else {
          return [
            ...prevItems,
            {
              id: itemId,
              productSlug: product.slug,
              title: product.title,
              price: product.price,
              image: product.image,
              vendor: vendorName,
              categorySlug: product.categorySlug || "clothes",
              categoryName: product.categorySlug
                ? product.categorySlug.charAt(0).toUpperCase() + product.categorySlug.slice(1).replace(/-/g, " ")
                : "General",
              size: size,
              quantity: quantity,
            },
          ];
        }
      });

      // Append to toast queue (keep max 4 active in queue)
      const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [
        ...prev.slice(-3),
        {
          id: toastId,
          itemTitle: product.title,
          itemImage: product.image,
          timestamp: Date.now(),
        },
      ]);

      if (openDrawer) {
        setIsCartOpen(true);
      }
    },
    []
  );

  const addToCart = useCallback(
    (options: AddToCartOptions) => {
      if (!user) {
        openAuthModal("login", options.product, () => {
          performAddToCart({ ...options, openDrawer: true });
        });
        return;
      }
      performAddToCart(options);
    },
    [user, openAuthModal, performAddToCart]
  );

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return Math.round(total * 100) / 100;
  }, [cartItems]);

  const legacyToast = useMemo<ToastState>(() => {
    if (toasts.length === 0) return null;
    const latest = toasts[toasts.length - 1];
    return {
      show: true,
      itemTitle: latest.itemTitle,
      itemImage: latest.itemImage,
    };
  }, [toasts]);

  const value = useMemo(
    () => ({
      cartItems,
      isCartOpen,
      cartCount,
      subtotal,
      toast: legacyToast,
      toasts,
      hideToast,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      cartItems,
      isCartOpen,
      cartCount,
      subtotal,
      legacyToast,
      toasts,
      hideToast,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
