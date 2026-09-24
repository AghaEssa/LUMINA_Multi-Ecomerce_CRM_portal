"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from "react";
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
  productCount: number;
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

const LOCAL_STORAGE_GUEST_KEY = "lumina_guest_cart_v1";
const getUserStorageKey = (userId: string) => `lumina_user_cart_${userId}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const previousUserRef = useRef<string | null>(null);

  // 1. Initial Load on Mount (Reads Guest Cart or User Cart)
  useEffect(() => {
    try {
      if (user) {
        const userSaved = localStorage.getItem(getUserStorageKey(user.id));
        const guestSaved = localStorage.getItem(LOCAL_STORAGE_GUEST_KEY);
        
        let initialUserItems: CartItem[] = userSaved ? JSON.parse(userSaved) : [];
        let guestItems: CartItem[] = guestSaved ? JSON.parse(guestSaved) : [];

        if (guestItems.length > 0) {
          // Merge guest items into user cart
          guestItems.forEach((gItem) => {
            const idx = initialUserItems.findIndex((uItem) => uItem.id === gItem.id);
            if (idx > -1) {
              initialUserItems[idx].quantity += gItem.quantity;
            } else {
              initialUserItems.push(gItem);
            }
          });
          localStorage.removeItem(LOCAL_STORAGE_GUEST_KEY);
          localStorage.setItem(getUserStorageKey(user.id), JSON.stringify(initialUserItems));
        }

        setCartItems(initialUserItems);
        previousUserRef.current = user.id;
      } else {
        const guestSaved = localStorage.getItem(LOCAL_STORAGE_GUEST_KEY);
        if (guestSaved) {
          const parsed = JSON.parse(guestSaved);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        }
      }
    } catch {
      // ignore storage errors
    } finally {
      setIsLoaded(true);
    }
  }, [user]);

  // 2. React to Auth State Changes (Login / Logout / Switch User)
  useEffect(() => {
    if (!isLoaded || isAuthLoading) return;

    const currentUserId = user?.id || null;
    const prevUserId = previousUserRef.current;

    if (prevUserId !== currentUserId) {
      previousUserRef.current = currentUserId;

      if (currentUserId) {
        // User just logged in! Merge guest cart into user cart.
        try {
          const guestSaved = localStorage.getItem(LOCAL_STORAGE_GUEST_KEY);
          const userSaved = localStorage.getItem(getUserStorageKey(currentUserId));

          let userItems: CartItem[] = userSaved ? JSON.parse(userSaved) : [];
          let guestItems: CartItem[] = guestSaved ? JSON.parse(guestSaved) : [];

          // If current state has guest items, include them too
          if (cartItems.length > 0 && guestItems.length === 0) {
            guestItems = cartItems;
          }

          if (guestItems.length > 0) {
            guestItems.forEach((gItem) => {
              const idx = userItems.findIndex((uItem) => uItem.id === gItem.id);
              if (idx > -1) {
                userItems[idx].quantity += gItem.quantity;
              } else {
                userItems.push(gItem);
              }
            });
            localStorage.removeItem(LOCAL_STORAGE_GUEST_KEY);
          }

          localStorage.setItem(getUserStorageKey(currentUserId), JSON.stringify(userItems));
          setCartItems(userItems);
        } catch {
          // ignore storage errors
        }
      } else {
        // User logged out! Reset cart state to empty guest cart.
        setCartItems([]);
        try {
          localStorage.removeItem(LOCAL_STORAGE_GUEST_KEY);
        } catch {
          // ignore storage errors
        }
      }
    }
  }, [user, isAuthLoading, isLoaded, cartItems]);

  // 3. Save active cartItems to appropriate localStorage key whenever cartItems changes
  useEffect(() => {
    if (!isLoaded || isAuthLoading) return;

    try {
      if (user) {
        localStorage.setItem(getUserStorageKey(user.id), JSON.stringify(cartItems));
      } else {
        localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify(cartItems));
      }
    } catch {
      // ignore storage errors
    }
  }, [cartItems, user, isAuthLoading, isLoaded]);

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
      performAddToCart(options);
    },
    [performAddToCart]
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
    try {
      localStorage.removeItem(LOCAL_STORAGE_GUEST_KEY);
      if (user) {
        localStorage.removeItem(getUserStorageKey(user.id));
      }
    } catch {
      // ignore
    }
  }, [user]);

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

  const productCount = useMemo(() => cartItems.length, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      isCartOpen,
      cartCount,
      productCount,
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

