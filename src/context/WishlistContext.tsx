"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductItem } from "@/lib/products";
import { wishlistService } from "@/services/wishlistService";

interface WishlistContextType {
  wishlistItems: ProductItem[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  isLoading: boolean;
  toggleWishlist: (product: ProductItem) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // 1. Fetch Wishlist using TanStack Query
  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
  });

  // 2. Optimistic Update Mutation for Toggle
  const toggleMutation = useMutation({
    mutationFn: wishlistService.toggleWishlist,
    onMutate: async (product) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData<ProductItem[]>(["wishlist"]) || [];

      // Optimistically update to the new value
      queryClient.setQueryData<ProductItem[]>(["wishlist"], (old = []) => {
        const exists = old.some((item) => item.slug === product.slug);
        if (exists) {
          return old.filter((item) => item.slug !== product.slug);
        } else {
          return [...old, product];
        }
      });

      return { previousWishlist };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: wishlistService.removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    }
  });

  const clearMutation = useMutation({
    mutationFn: wishlistService.clearWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    }
  });

  const isInWishlist = useCallback(
    (productSlug: string) => {
      return wishlistItems.some((item) => item.slug === productSlug);
    },
    [wishlistItems]
  );

  const toggleWishlist = useCallback((product: ProductItem) => {
    toggleMutation.mutate(product);
  }, [toggleMutation]);

  const removeFromWishlist = useCallback((productSlug: string) => {
    removeMutation.mutate(productSlug);
  }, [removeMutation]);

  const clearWishlist = useCallback(() => {
    clearMutation.mutate();
  }, [clearMutation]);

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isWishlistOpen,
        isLoading,
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
