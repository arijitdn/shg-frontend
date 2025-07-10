"use client";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationTabsProps {
  isLoggedIn: boolean;
  userRole: string | null;
  onLogout?: () => void;
  onShowLogin?: () => void;
}

export default function NavigationTabs({
  isLoggedIn,
  userRole,
  onLogout,
  onShowLogin,
}: NavigationTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const canAccessComparisons =
    isLoggedIn && ["VO", "CLF", "TRLM", "DMMU"].includes(userRole || "");

  return (
    <nav className="px-4 py-2.5 mx-4 my-2.5 rounded-md bg-stone-50 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          {userRole !== "NIC" && (
            <>
              <button
                className="px-4 py-2 text-sm rounded cursor-pointer border-[none]"
                onClick={() => navigate("/")}
                style={{
                  background:
                    currentPath === "/" ? "rgb(91, 192, 222)" : "transparent",
                  color: currentPath === "/" ? "white" : "rgb(119, 119, 119)",
                }}
              >
                Home
              </button>
              {isLoggedIn && (
                <button
                  className="px-4 py-2 text-sm rounded cursor-pointer border-[none]"
                  onClick={() => navigate("/admin")}
                  style={{
                    background:
                      currentPath === "/admin"
                        ? "rgb(91, 192, 222)"
                        : "transparent",
                    color:
                      currentPath === "/admin" ? "white" : "rgb(119, 119, 119)",
                  }}
                >
                  Admin Dashboard
                </button>
              )}
              {canAccessComparisons && (
                <button
                  className="px-4 py-2 text-sm rounded cursor-pointer border-[none]"
                  onClick={() => navigate("/comparisons")}
                  style={{
                    background:
                      currentPath === "/comparisons"
                        ? "rgb(91, 192, 222)"
                        : "transparent",
                    color:
                      currentPath === "/comparisons"
                        ? "white"
                        : "rgb(119, 119, 119)",
                  }}
                >
                  Comparisons
                </button>
              )}
              {isLoggedIn && (
                <button
                  className="px-4 py-2 text-sm rounded cursor-pointer border-[none]"
                  onClick={() => navigate("/inventory")}
                  style={{
                    background:
                      currentPath === "/inventory"
                        ? "rgb(91, 192, 222)"
                        : "transparent",
                    color:
                      currentPath === "/inventory"
                        ? "white"
                        : "rgb(119, 119, 119)",
                  }}
                >
                  Inventory
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {isLoggedIn ? (
            <span
              className="text-sm text-white bg-red-500 cursor-pointer px-4 py-2 rounded"
              onClick={onLogout}
            >
              Logout
            </span>
          ) : (
            <span
              className="text-sm text-white cursor-pointer bg-[#5BC0DE] px-4 py-2 rounded"
              onClick={onShowLogin}
            >
              Login
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
