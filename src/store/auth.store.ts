import { create } from "zustand";

interface User {
  id: string | null;
  name?: string;
  email?: string;
  phone?: string;
  role: string | null;
  userId?: string;
  organizationId?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User;
  setAuthentication: (isAuthenticated: boolean, user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: {
    id: null,
    role: null,
  },
  setAuthentication: (isAuthenticated: boolean, user: User) =>
    set({ isAuthenticated, user }),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({
      isAuthenticated: false,
      user: {
        id: null,
        role: null,
      },
    });
  },
}));

export default useAuthStore;
