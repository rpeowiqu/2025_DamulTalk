import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SideBarTabType = "FRIEND" | "CHAT";

interface SideBarTabStore {
  currentTab: SideBarTabType;
  setCurrentTab: (_tab: SideBarTabType) => void;

  tabNotifications: Record<SideBarTabType, boolean>;
  setTabNotifications: (
    _tab: SideBarTabType,
    _hasNotification: boolean,
  ) => void;
}

const useSideBarTabStore = create<SideBarTabStore>()(
  persist(
    (set) => ({
      currentTab: "FRIEND",
      setCurrentTab: (tab) => set({ currentTab: tab }),

      tabNotifications: {
        FRIEND: false,
        CHAT: false,
      },
      setTabNotifications: (tab, hasNotification) =>
        set((prev) => ({
          tabNotifications: {
            ...prev.tabNotifications,
            [tab]: hasNotification,
          },
        })),
    }),
    {
      name: "tab-store",
      storage: createJSONStorage(() => sessionStorage), // 세션 스토리지 사용
      partialize: (state) => ({
        currentTab: state.currentTab,
        tabNotifications: state.tabNotifications,
      }),
    },
  ),
);

export default useSideBarTabStore;
