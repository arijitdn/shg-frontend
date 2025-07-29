import useAuthStore from "../store/auth.store";

// Custom hook for easier access to user data
export const useUser = () => {
  const store = useAuthStore();

  return {
    // Direct access to user properties
    id: store.user.id,
    name: store.user.name,
    email: store.user.email,
    phone: store.user.phone,
    role: store.user.role,
    userId: store.user.userId,
    organizationId: store.user.organizationId,

    // Authentication state
    isAuthenticated: store.isAuthenticated,

    // Actions
    setAuthentication: store.setAuthentication,
    logout: store.logout,
  };
};

// Individual hooks for specific user properties (for components that only need one property)
export const useUserId = () => useAuthStore((state) => state.user.id);
export const useUserName = () => useAuthStore((state) => state.user.name);
export const useUserEmail = () => useAuthStore((state) => state.user.email);
export const useUserPhone = () => useAuthStore((state) => state.user.phone);
export const useUserRole = () => useAuthStore((state) => state.user.role);
export const useUserUserId = () => useAuthStore((state) => state.user.userId);
export const useOrganizationId = () =>
  useAuthStore((state) => state.user.organizationId);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
