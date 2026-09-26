"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ProductItem } from "@/lib/products";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "customer";
  isTwoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

type AuthModalMode = "login" | "register" | "2fa";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  isProfileModalOpen: boolean;
  isSecurityModalOpen: boolean;
  pendingProduct: ProductItem | null;
  pendingAction: (() => void) | null;
  openAuthModal: (mode?: AuthModalMode, product?: ProductItem | null, onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openSecurityModal: () => void;
  closeSecurityModal: () => void;
  setAuthModalMode: (mode: AuthModalMode) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  requireAuth: (onSuccessAction: () => void, product?: ProductItem) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");
  const [pendingProduct, setPendingProduct] = useState<ProductItem | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Fetch current user session on mount
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      let res = await fetch("/api/auth/me", { method: "GET" });

      if (res.status === 401) {
        // Access token might be expired. Attempt refresh using refresh token cookie.
        const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
        if (refreshRes.ok) {
          res = await fetch("/api/auth/me", { method: "GET" });
        }
      }

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const openAuthModal = useCallback(
    (mode: AuthModalMode = "login", _product: ProductItem | null = null, _onSuccess?: () => void) => {
      const targetPage = mode === "register" ? "/register" : "/login";
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/account";
      const callbackUrl = currentPath !== "/login" && currentPath !== "/register" ? currentPath : "/account";
      window.location.href = `${targetPage}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingProduct(null);
    setPendingAction(null);
  }, []);

  const openProfileModal = useCallback(() => setIsProfileModalOpen(true), []);
  const closeProfileModal = useCallback(() => setIsProfileModalOpen(false), []);
  const openSecurityModal = useCallback(() => setIsSecurityModalOpen(true), []);
  const closeSecurityModal = useCallback(() => setIsSecurityModalOpen(false), []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      closeAuthModal();
      closeProfileModal();
      closeSecurityModal();
      window.location.href = "/";
    }
  }, [closeAuthModal, closeProfileModal, closeSecurityModal]);

  /**
   * Protected Action Helper:
   * If authenticated -> runs onSuccessAction immediately and returns true.
   * If unauthenticated -> opens Auth Modal, saves pending action/product, and returns false.
   */
  const requireAuth = useCallback(
    (onSuccessAction: () => void, product?: ProductItem): boolean => {
      if (user) {
        onSuccessAction();
        return true;
      }
      openAuthModal("login", product || null, onSuccessAction);
      return false;
    },
    [user, openAuthModal]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        isProfileModalOpen,
        isSecurityModalOpen,
        pendingProduct,
        pendingAction,
        openAuthModal,
        closeAuthModal,
        openProfileModal,
        closeProfileModal,
        openSecurityModal,
        closeSecurityModal,
        setAuthModalMode,
        checkAuth,
        logout,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
