import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  googleId: string;
  isActive: boolean;
  pages: { [key: string]: { pageId: string; title: string }[] }; // Generic string categories
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  addPage: (category: string, page: { pageId: string; title: string }) => void; // Allow any string category
}

const useUserStore = create<UserStore>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    addPage: (category, page) => {
      set((state) => {
        if (state.user) {
          const updatedPages = {
            ...state.user.pages,
            [category]: [...(state.user.pages[category] || []), page], // Add page to the specified category
          };

          return { user: { ...state.user, pages: updatedPages } };
        }
        return state;
      });
    },
  }))
);

export default useUserStore;
