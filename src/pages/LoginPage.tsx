import React, { useState } from "react";

interface LoginPageProps {
  onLogin: (
    roleType: string,
    role: string,
    credentials: { idOrEmail: string; password: string }
  ) => void;
  onClose?: () => void;
}

const userRoles = ["SHG", "VO", "CLF"];
const adminRoles = ["NIC", "BMMU", "DMMU"];

export default function LoginPage({ onLogin, onClose }: LoginPageProps) {
  const [roleType, setRoleType] = useState<"user" | "admin">("user");
  const [idOrEmail, setIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(userRoles[0]);

  const handleRoleTypeToggle = (selected: "user" | "admin") => {
    setRoleType(selected);
    setRole(selected === "user" ? userRoles[0] : adminRoles[0]);
    setIdOrEmail("");
    setPassword("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(roleType, role, { idOrEmail, password });
  };

  return (
    <div className="flex items-center justify-center min-h-0 bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg min-w-[350px] relative"
      >
        {onClose && (
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        )}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login
        </h2>
        {/* Role Type Toggle */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-l border border-r-0 font-semibold ${
              roleType === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => handleRoleTypeToggle("user")}
          >
            User
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-r border font-semibold ${
              roleType === "admin"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => handleRoleTypeToggle("admin")}
          >
            Admin
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {/* Credentials */}
          <div className="">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {roleType === "user" ? "ID" : "Email"}
              </label>
              <input
                type={roleType === "user" ? "text" : "email"}
                value={idOrEmail}
                onChange={(e) => setIdOrEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={
                  roleType === "user" ? "Enter your ID" : "Enter your email"
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          {/* Role Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="flex gap-3">
              {(roleType === "user" ? userRoles : adminRoles).map((r) => (
                <button
                  type="button"
                  key={r}
                  className={`px-4 py-2 rounded font-semibold border ${
                    role === r
                      ? roleType === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
