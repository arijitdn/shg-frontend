import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { users } from "../lib/users";

const userRoles = ["SHG", "VO", "CLF"];
const adminRoles = ["NIC", "BMMU", "DMMU"];

export default function HomePage() {
  const [roleType, setRoleType] = useState<"user" | "admin">("user");
  const [idOrEmail, setIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(userRoles[0]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleTypeToggle = (selected: "user" | "admin") => {
    setRoleType(selected);
    setRole(selected === "user" ? userRoles[0] : adminRoles[0]);
    setIdOrEmail("");
    setPassword("");
  };

  const onLogin = () => {
    navigate(role.toLowerCase());
  };
  const onClose = () => {};

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (roleType === "admin") {
      const user = users.find((user) => user.email === idOrEmail);
      if (!user) {
        return toast({
          title: "Invalid credentials",
        });
      }

      if (user.password !== password) {
        return toast({
          title: "Invalid credentials",
        });
      }

      if (user.role !== role) {
        return toast({
          title: "Access Denied",
          description: "You don't have enough permissions",
        });
      }
    } else {
      const user = users.find((user) => user.id === idOrEmail);
      if (!user) {
        return toast({
          title: "Invalid credentials",
        });
      }

      if (user.password !== password) {
        return toast({
          title: "Invalid credentials",
        });
      }

      if (user.role !== role) {
        return toast({
          title: "Access Denied",
          description: "You don't have enough permissions",
        });
      }
    }

    onLogin();
  };
  return (
    <main className="p-5 mx-4 my-5 bg-white rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-center min-h-0">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg min-w-[350px] relative"
        >
          {onclose && (
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
          {/* Credentials */}
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
