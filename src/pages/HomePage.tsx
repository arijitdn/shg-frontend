import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { User, Shield, Building2, Users, Globe } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import apiClient from "../lib/api";
import useAuthStore from "../store/auth.store";

export default function HomePage() {
  const [userId, setUserId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [password, setPassword] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAuthentication, isAuthenticated, user } = useAuthStore();

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (isAuthenticated && user.role) {
      navigate(`/${user.role.toLowerCase()}`);
    }
  }, [isAuthenticated, user.role, navigate]);

  const userRoles = [
    { id: "SHG", label: "SHG", icon: Users, description: "Self Help Group" },
    {
      id: "VO",
      label: "VO",
      icon: Building2,
      description: "Village Organization",
    },
    {
      id: "CLF",
      label: "CLF",
      icon: Globe,
      description: "Cluster Level Federation",
    },
  ];

  const adminRoles = [
    {
      id: "NIC",
      label: "NIC",
      icon: Shield,
      description: "National Informatics Center",
    },
    {
      id: "BMMU",
      label: "BMMU",
      icon: Building2,
      description: "Block Mission Management Unit",
    },
    {
      id: "DMMU",
      label: "DMMU",
      icon: Users,
      description: "District Mission Management Unit",
    },
    {
      id: "CLF",
      label: "CLF",
      icon: Globe,
      description: "Cluster Level Federation",
    },
  ];

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post("/shg-auth/login", {
        userId,
        password,
        role: userRole,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Update auth store
      setAuthentication(true, user);

      toast({
        title: "Login Successful",
        description: `Welcome ${user.name}!`,
      });

      // Navigate to appropriate dashboard
      navigate(`/${userRole.toLowerCase()}`);
    } catch (error: any) {
      toast({
        title: "Invalid Credentials",
        description:
          error.response?.data?.message ||
          "Please check your ID and password again before signing in",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post("/shg-auth/login", {
        email: adminEmail,
        password,
        role: adminRole,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Update auth store
      setAuthentication(true, user);

      toast({
        title: "Login Successful",
        description: `Welcome ${user.name}!`,
      });

      // Navigate to appropriate dashboard
      navigate(`/${adminRole.toLowerCase()}`);
    } catch (error: any) {
      toast({
        title: "Invalid Credentials",
        description:
          error.response?.data?.message ||
          "Please check your email and password again before signing in",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="flex justify-center w-full max-w-3xl">
        <Card className="shadow-xl border-0 w-screen">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your login type and enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4">
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="flex justify-between gap-10">
                    <div className="w-full flex flex-col justify-center">
                      <div className="space-y-2">
                        <Label htmlFor="user-id">User ID</Label>
                        <Input
                          id="user-id"
                          type="text"
                          value={userId}
                          onChange={(e) =>
                            setUserId(e.target.value.toUpperCase())
                          }
                          placeholder="Enter your user ID"
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="user-password">Password</Label>
                        <Input
                          id="user-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 w-full bg-gray-100 px-10 py-3">
                      <Label>Select Role</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {userRoles.map((role) => {
                          const Icon = role.icon;
                          return (
                            <Button
                              key={role.id}
                              type="button"
                              variant={
                                userRole === role.id ? "default" : "outline"
                              }
                              className={`h-auto p-3 justify-start ${
                                userRole === role.id
                                  ? "bg-blue-500 hover:bg-blue-500"
                                  : "hover:bg-blue-50"
                              }`}
                              onClick={() => setUserRole(role.id)}
                            >
                              <div className="flex items-center gap-3 w-full relative">
                                <Icon className="w-5 h-5" />
                                <div className="text-left">
                                  <div className="font-semibold">
                                    {role.label}
                                  </div>
                                  <div className="text-xs opacity-70">
                                    {role.description}
                                  </div>
                                </div>
                                <div className="absolute right-3">
                                  {userRole === role.id && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-400"
                                    >
                                      Selected
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                    disabled={!userRole || isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In as User"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div className="flex justify-center gap-10">
                    <div className="w-full flex flex-col justify-center">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 w-full bg-gray-100 px-10 py-3">
                      <Label>Select Role</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {adminRoles.map((role) => {
                          const Icon = role.icon;
                          return (
                            <Button
                              key={role.id}
                              type="button"
                              variant={
                                adminRole === role.id ? "default" : "outline"
                              }
                              className={`h-auto p-3 justify-start ${
                                adminRole === role.id
                                  ? "bg-blue-500 hover:bg-blue-500"
                                  : "hover:bg-blue-50"
                              }`}
                              onClick={() => setAdminRole(role.id)}
                            >
                              <div className="flex items-center gap-3 w-full relative">
                                <Icon className="w-5 h-5" />
                                <div className="text-left">
                                  <div className="font-semibold">
                                    {role.label}
                                  </div>
                                  <div className="text-xs opacity-70">
                                    {role.description}
                                  </div>
                                </div>
                                <div className="absolute right-3">
                                  {adminRole === role.id && (
                                    <Badge
                                      variant="default"
                                      className="bg-green-400 text-black"
                                    >
                                      Selected
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                    disabled={!adminRole || isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In as Admin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
