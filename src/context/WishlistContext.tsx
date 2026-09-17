"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ProductItem } from "@/lib/products";

interface WishlistContextType {
  wishlistItems: ProductItem[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  toggleWishlist: (product: ProductItem) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "lumina_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<ProductItem[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      }
    } catch {
      setWishlistItems([]);
    }
  }, []);

  // Save wishlist to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {
      // Ignore write errors
    }
  }, [wishlistItems]);

  const isInWishlist = useCallback(
    (productSlug: string) => {
      return wishlistItems.some((item) => item.slug === productSlug);
    },
    [wishlistItems]
  );

  const toggleWishlist = useCallback((product: ProductItem) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.slug === product.slug);
      if (exists) {
        return prev.filter((item) => item.slug !== product.slug);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  const removeFromWishlist = useCallback((productSlug: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.slug !== productSlug));
  }, []);


  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isWishlistOpen,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
