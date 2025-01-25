// store/userStore.ts
import {create} from "zustand";

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface UserStore {
  user: User;
  setUser: (user: User) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: {
    id: "",
    name: null,
    email: null,
  },
  setUser: (user) => set({ user }),
}));

export default useUserStore;
