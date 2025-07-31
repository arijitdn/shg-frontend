import { useEffect, type ReactNode } from "react";
import useAuthStore from "../store/auth.store";
import apiClient from "../lib/api";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setAuthentication, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        // Verify token and get user profile
        const response = await apiClient.get("/org-auth/profile");
        const userData = response.data;

        setAuthentication(true, userData);
      } catch (error) {
        logout();
      }
    };

    initializeAuth();
  }, [setAuthentication, logout]);

  return <>{children}</>;
}
