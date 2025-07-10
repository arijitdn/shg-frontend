import { create } from "zustand";

const authStore = (set: any) => {
  return {
    isAuthenticated: false,
    user: {
      id: null,
      role: null,
    },
    setAuthentication: (isAuthenticated: any, user: any) =>
      set({ isAuthenticated, user }),
    logout: () =>
      set({
        isAuthenticated: false,
        user: {
          id: null,
          role: null,
        },
      }),
  };
};

const useAuthStore = create(authStore);

export default useAuthStore;
