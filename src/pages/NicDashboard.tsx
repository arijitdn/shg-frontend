import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import apiClient from "../lib/api";

// Types based on backend entities
interface Post {
  id: string;
  name: string;
  location: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  status: string;
  joinDate: string;
  postId: string;
  level: "DMMU" | "BMMU";
  createdAt: string;
  updatedAt: string;
}

interface CreatePostDto {
  name: string;
  location: string;
}

interface CreateEmployeeDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  designation: string;
  postId: string;
  level: "DMMU" | "BMMU";
  joinDate: string;
}

// API functions
const postsApi = {
  getAll: () => apiClient.get("/admin/posts"),
  create: (data: CreatePostDto) => apiClient.post("/admin/posts/create", data),
  update: (id: string, data: Partial<CreatePostDto>) =>
    apiClient.patch(`/admin/posts/update/${id}`, data),
  delete: (id: string) => apiClient.delete(`/admin/posts/delete/${id}`),
};

const employeesApi = {
  getAll: () => apiClient.get("/admin/employees"),
  create: (data: CreateEmployeeDto) =>
    apiClient.post("/admin/employees/create", data),
  getByPost: (post: string) =>
    apiClient.get(`/admin/employees/by-post/${post}`),
  update: (id: string, data: Partial<CreateEmployeeDto>) =>
    apiClient.patch(`/admin/employees/update/${id}`, data),
  delete: (id: string) => apiClient.delete(`/admin/employees/delete/${id}`),
};

export default function NICAdminDashboard() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedPost, setSelectedPost] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  // Form states
  const [newPost, setNewPost] = useState<CreatePostDto>({
    name: "",
    location: "",
  });
  const [newEmployee, setNewEmployee] = useState<CreateEmployeeDto>({
    name: "",
    email: "",
    phone: "",
    password: "",
    designation: "",
    postId: "",
    level: "DMMU",
    joinDate: new Date().toISOString().split("T")[0],
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Computed values
  const employeesByPost = selectedPost
    ? employees.filter((emp) => {
        const post = posts.find((p) => p.name === selectedPost);
        return post ? emp.postId === post.id : false;
      })
    : [];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || emp.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsResponse, employeesResponse] = await Promise.all([
        postsApi.getAll(),
        employeesApi.getAll(),
      ]);
      setPosts(postsResponse.data || []);
      setEmployees(employeesResponse.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      await postsApi.create(newPost);
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      setNewPost({ name: "", location: "" });
      setIsAddingPost(false);
      loadData();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const handleCreateEmployee = async () => {
    try {
      await employeesApi.create(newEmployee);
      toast({
        title: "Success",
        description: "Employee created successfully",
      });
      setNewEmployee({
        name: "",
        email: "",
        phone: "",
        password: "",
        designation: "",
        postId: "",
        level: "DMMU",
        joinDate: new Date().toISOString().split("T")[0],
      });
      setIsAddingEmployee(false);
      loadData();
    } catch (error) {
      console.error("Error creating employee:", error);
      toast({
        title: "Error",
        description: "Failed to create employee",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEmployee = async (
    id: string,
    data: Partial<CreateEmployeeDto>
  ) => {
    try {
      await employeesApi.update(id, data);
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
      setEditingEmployee(null);
      loadData();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await employeesApi.delete(id);
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
      loadData();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = async (id: string, data: Partial<CreatePostDto>) => {
    try {
      await postsApi.update(id, data);
      toast({
        title: "Success",
        description: "Post updated successfully",
      });
      setEditingPost(null);
      loadData();
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await postsApi.delete(id);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      loadData();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const getPostEmployeeCount = (postName: string) => {
    return employees.filter((emp) => {
      const post = posts.find((p) => p.name === postName);
      return post ? emp.postId === post.id : false;
    }).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="relative h-48 bg-cover bg-center"
        style={{ backgroundImage: "url('/banner.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 flex items-center justify-center h-full px-6">
          <div className="text-white text-center">
            <h1 className="text-2xl font-extrabold">
              National Informatics Center
            </h1>
            <p className="text-sm opacity-90">SHG Portal - Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              NIC Admin Dashboard
            </h2>
            <Button
              variant="secondary"
              className="bg-sky-400 hover:bg-sky-500 text-white"
            >
              Logout
            </Button>
          </div>
          <p className="text-gray-600">
            Manage DMMU/BMMU employees and posts across all government
            departments
          </p>
        </div>

        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Manage Posts</TabsTrigger>
            <TabsTrigger value="employees-by-post">
              Employees by Post
            </TabsTrigger>
            <TabsTrigger value="all-employees">All Employees</TabsTrigger>
          </TabsList>

          {/* Manage Posts Tab */}
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Posts Management</CardTitle>
                    <CardDescription>
                      View and manage all government posts
                    </CardDescription>
                  </div>
                  <Dialog open={isAddingPost} onOpenChange={setIsAddingPost}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Post</DialogTitle>
                        <DialogDescription>
                          Create a new government post
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="post-name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="post-name"
                            className="col-span-3"
                            value={newPost.name}
                            onChange={(e) =>
                              setNewPost({ ...newPost, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="post-location" className="text-right">
                            Location
                          </Label>
                          <Input
                            id="post-location"
                            className="col-span-3"
                            value={newPost.location}
                            onChange={(e) =>
                              setNewPost({
                                ...newPost,
                                location: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleCreatePost}>
                          Create Post
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Post Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          Loading posts...
                        </TableCell>
                      </TableRow>
                    ) : posts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          No posts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            {post.name}
                          </TableCell>
                          <TableCell>{post.location}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getPostEmployeeCount(post.name)} employees
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => setEditingPost(post)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Post
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="mr-2 h-4 w-4" />
                                  View Employees
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Post
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees by Post Tab */}
          <TabsContent value="employees-by-post">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>DMMU/BMMU Employees by Post</CardTitle>
                    <CardDescription>
                      View employees assigned to specific posts
                    </CardDescription>
                  </div>
                  <Select value={selectedPost} onValueChange={setSelectedPost}>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Select a post" />
                    </SelectTrigger>
                    <SelectContent>
                      {posts.map((post) => (
                        <SelectItem key={post.id} value={post.name}>
                          {post.name} - {post.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {selectedPost ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            Loading employees...
                          </TableCell>
                        </TableRow>
                      ) : employeesByPost.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            No employees found for this post
                          </TableCell>
                        </TableRow>
                      ) : (
                        employeesByPost.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">
                              {employee.name}
                            </TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.phone}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  employee.level === "DMMU"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {employee.level}
                              </Badge>
                            </TableCell>
                            <TableCell>{employee.designation}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  employee.status === "active"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {employee.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(employee.joinDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => setEditingEmployee(employee)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {employee.status === "active" ? (
                                      <>
                                        <UserX className="mr-2 h-4 w-4" />
                                        Disable Account
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        Enable Account
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Transfer Post
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDeleteEmployee(employee.id)
                                    }
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Employee
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Please select a post to view employees
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Employees Tab */}
          <TabsContent value="all-employees">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All DMMU/BMMU Employees</CardTitle>
                    <CardDescription>
                      Manage all employees across all posts
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="DMMU">DMMU</SelectItem>
                        <SelectItem value="BMMU">BMMU</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-[300px]"
                      />
                    </div>
                    <Button onClick={() => setShowAddEmployee(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Employee
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Post</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          Loading employees...
                        </TableCell>
                      </TableRow>
                    ) : filteredEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          No employees found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.name}
                          </TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.phone}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                employee.level === "DMMU"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {employee.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {posts.find((p) => p.id === employee.postId)
                              ?.name || "N/A"}
                          </TableCell>
                          <TableCell>{employee.designation}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                employee.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {employee.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(employee.joinDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => setEditingEmployee(employee)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {employee.status === "active" ? (
                                    <>
                                      <UserX className="mr-2 h-4 w-4" />
                                      Disable Account
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Enable Account
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Transfer Post
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleDeleteEmployee(employee.id)
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove Employee
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Employee Dialog */}
        <Dialog
          open={!!editingEmployee}
          onOpenChange={() => setEditingEmployee(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee Details</DialogTitle>
              <DialogDescription>Update employee information</DialogDescription>
            </DialogHeader>
            {editingEmployee && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emp-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="emp-name"
                    defaultValue={editingEmployee.name}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emp-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="emp-email"
                    defaultValue={editingEmployee.email}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emp-designation" className="text-right">
                    Designation
                  </Label>
                  <Input
                    id="emp-designation"
                    defaultValue={editingEmployee.designation}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emp-post" className="text-right">
                    Post
                  </Label>
                  <Select
                    defaultValue={
                      posts.find((p) => p.id === editingEmployee.postId)
                        ?.name || ""
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {posts.map((post) => (
                        <SelectItem key={post.id} value={post.name}>
                          {post.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Post Dialog */}
        <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Post Details</DialogTitle>
              <DialogDescription>Update post information</DialogDescription>
            </DialogHeader>
            {editingPost && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="post-edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="post-edit-name"
                    defaultValue={editingPost.name}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="post-edit-location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="post-edit-location"
                    defaultValue={editingPost.location}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="post-edit-status" className="text-right">
                    Status
                  </Label>
                  <Select defaultValue={editingPost.status}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Employee Dialog */}
        <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Create a new DMMU/BMMU employee account
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-emp-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="new-emp-name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-emp-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="new-emp-email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-emp-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="new-emp-phone"
                  value={newEmployee.phone}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, phone: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-emp-password" className="text-right">
                  Password
                </Label>
                <Input
                  id="new-emp-password"
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, password: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-emp-level" className="text-right">
                  Level
                </Label>
                <Select
                  value={newEmployee.level}
                  onValueChange={(value: "DMMU" | "BMMU") =>
                    setNewEmployee({ ...newEmployee, level: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DMMU">DMMU</SelectItem>
                    <SelectItem value="BMMU">BMMU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-emp-post" className="text-right">
                  Post
                </Label>
                <Select
                  value={newEmployee.postId}
                  onValueChange={(value) =>
                    setNewEmployee({ ...newEmployee, postId: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a post" />
                  </SelectTrigger>
                  <SelectContent>
                    {posts.map((post) => (
                      <SelectItem key={post.id} value={post.id}>
                        {post.name} - {post.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-emp-designation" className="text-right">
                  Designation
                </Label>
                <Input
                  id="new-emp-designation"
                  value={newEmployee.designation}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      designation: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateEmployee}>Create Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
