"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
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
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn, openSignUp, openUserProfile } = useClerk();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");
  const [pendingProduct, setPendingProduct] = useState<ProductItem | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Map Clerk user data to application's UserProfile schema
  const user: UserProfile | null = useMemo(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) return null;

    const email = clerkUser.primaryEmailAddress?.emailAddress || "";
    const name = clerkUser.fullName || clerkUser.username || email.split("@")[0] || "User";
    const role = (clerkUser.publicMetadata?.role as "admin" | "editor" | "customer") || "customer";

    return {
      id: clerkUser.id,
      name,
      email,
      role,
      isTwoFactorEnabled: clerkUser.twoFactorEnabled || false,
      lastLoginAt: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt).toISOString() : undefined,
      createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : undefined,
    };
  }, [clerkUser, isLoaded, isSignedIn]);

  const isLoading = !isLoaded;

  const checkAuth = useCallback(async () => {
    // Clerk handles session state automatically
  }, []);

  const openAuthModal = useCallback(
    (mode: AuthModalMode = "login", _product: ProductItem | null = null, _onSuccess?: () => void) => {
      if (mode === "register") {
        openSignUp();
      } else {
        openSignIn();
      }
    },
    [openSignIn, openSignUp]
  );

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingProduct(null);
    setPendingAction(null);
  }, []);

  const openProfileModal = useCallback(() => {
    openUserProfile();
  }, [openUserProfile]);

  const closeProfileModal = useCallback(() => setIsProfileModalOpen(false), []);
  const openSecurityModal = useCallback(() => setIsSecurityModalOpen(true), []);
  const closeSecurityModal = useCallback(() => setIsSecurityModalOpen(false), []);

  const logout = useCallback(async () => {
    await signOut({ redirectUrl: "/" });
  }, [signOut]);

  const requireAuth = useCallback(
    (onSuccessAction: () => void, product?: ProductItem): boolean => {
      if (isSignedIn && user) {
        onSuccessAction();
        return true;
      }
      openAuthModal("login", product || null, onSuccessAction);
      return false;
    },
    [isSignedIn, user, openAuthModal]
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

