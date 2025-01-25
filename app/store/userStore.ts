// stores/userStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  googleId: string;
  isActive: boolean;
  pages: {
    private: { pageId: string; title: string }[];
    teamspace: { pageId: string; title: string }[];
  };
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
  }))
);

export default useUserStore;
