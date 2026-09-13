"use client";

import { useState, useCallback } from "react";

export function useCart(initialCount = 0) {
  const [cartCount, setCartCount] = useState(initialCount);
  const [lastAddedTime, setLastAddedTime] = useState<number | null>(null);

  const addToCart = useCallback((quantity = 1) => {
    setCartCount((prev) => prev + quantity);
    setLastAddedTime(Date.now());
  }, []);

  const resetCart = useCallback(() => {
    setCartCount(0);
  }, []);

  return {
    cartCount,
    addToCart,
    resetCart,
    lastAddedTime,
  };
}
