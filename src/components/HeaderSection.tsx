import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth.store";

export default function HeaderSection() {
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="overflow-hidden relative p-4 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
      <div className="absolute inset-0 opacity-30 bg-[20px_20px]" />
      <img
        src="/banner.png"
        className="object-cover overflow-hidden w-full aspect-square h-[250px]"
        alt="Header background"
      />

      {/* User info and logout button */}
      {isAuthenticated && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <div className="text-sm">
              <div className="font-semibold text-gray-800">
                {user.name || "User"}
              </div>
              <div className="text-gray-600 uppercase text-xs">{user.role}</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
