import { create } from "zustand";

interface UIStoreState {
  isSearchModalOpen: boolean;
  isNotificationsModalOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProductSlug: string | null;
  activeCategoryFilter: string;

  // Actions
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openNotifications: () => void;
  closeNotifications: () => void;
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;
  setActiveCategoryFilter: (category: string) => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  isSearchModalOpen: false,
  isNotificationsModalOpen: false,
  isQuickViewOpen: false,
  quickViewProductSlug: null,
  activeCategoryFilter: "all",

  openSearch: () => set({ isSearchModalOpen: true }),
  closeSearch: () => set({ isSearchModalOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchModalOpen: !state.isSearchModalOpen })),

  openNotifications: () => set({ isNotificationsModalOpen: true }),
  closeNotifications: () => set({ isNotificationsModalOpen: false }),

  openQuickView: (slug: string) => set({ isQuickViewOpen: true, quickViewProductSlug: slug }),
  closeQuickView: () => set({ isQuickViewOpen: false, quickViewProductSlug: null }),

  setActiveCategoryFilter: (category: string) => set({ activeCategoryFilter: category }),
}));
