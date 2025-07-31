import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth.store";
import apiClient from "../lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, setAuthentication, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        logout();
        navigate("/");
        return;
      }

      try {
        // Verify token and get user profile
        const response = await apiClient.get("/org-auth/profile");
        const userData = response.data;

        setAuthentication(true, userData);

        // Check if user has required role
        if (allowedRoles && !allowedRoles.includes(userData.role)) {
          navigate("/");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        logout();
        navigate("/");
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    } else if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
      navigate("/");
    } else {
      setIsLoading(false);
    }
  }, [
    isAuthenticated,
    user.role,
    allowedRoles,
    setAuthentication,
    logout,
    navigate,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
