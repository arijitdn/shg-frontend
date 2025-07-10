"use client";

import { useState } from "react";
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
import Footer from "../components/Footer";

// Mock data
const posts = [
  {
    id: 1,
    name: "District Collector Office",
    location: "Mumbai",
    employeeCount: 45,
    status: "Active",
  },
  {
    id: 2,
    name: "Regional Transport Office",
    location: "Delhi",
    employeeCount: 32,
    status: "Active",
  },
  {
    id: 3,
    name: "Public Works Department",
    location: "Bangalore",
    employeeCount: 28,
    status: "Active",
  },
  {
    id: 4,
    name: "Health Department",
    location: "Chennai",
    employeeCount: 67,
    status: "Inactive",
  },
];

const employees = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@nic.in",
    post: "District Collector Office",
    designation: "Assistant Collector",
    status: "Active",
    joinDate: "2020-03-15",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@nic.in",
    post: "Regional Transport Office",
    designation: "RTO Officer",
    status: "Active",
    joinDate: "2019-07-22",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit.patel@nic.in",
    post: "Public Works Department",
    designation: "Engineer",
    status: "Disabled",
    joinDate: "2021-01-10",
  },
  {
    id: 4,
    name: "Sunita Reddy",
    email: "sunita.reddy@nic.in",
    post: "Health Department",
    designation: "Medical Officer",
    status: "Active",
    joinDate: "2018-11-05",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.singh@nic.in",
    post: "District Collector Office",
    designation: "Clerk",
    status: "Active",
    joinDate: "2022-02-28",
  },
];

export default function NICAdminDashboard() {
  const [selectedPost, setSelectedPost] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.post.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const employeesByPost = selectedPost
    ? employees.filter((emp) => emp.post === selectedPost)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="relative h-48 bg-cover bg-center"
        style={{ backgroundImage: "url('/banner.jpeg')" }}
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
              Admin Dashboard
            </h2>
            <Button
              variant="secondary"
              className="bg-sky-400 hover:bg-sky-500 text-white"
            >
              Logout
            </Button>
          </div>
          <p className="text-gray-600">
            Manage employees and posts across all government departments
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
                  <Dialog>
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
                          <Input id="post-name" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="post-location" className="text-right">
                            Location
                          </Label>
                          <Input id="post-location" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create Post</Button>
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
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          {post.name}
                        </TableCell>
                        <TableCell>{post.location}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {post.employeeCount} employees
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              post.status === "Active"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {post.status}
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
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Post
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
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
                    <CardTitle>Employees by Post</CardTitle>
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
                        <TableHead>Designation</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeesByPost.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.name}
                          </TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.designation}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                employee.status === "Active"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {employee.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{employee.joinDate}</TableCell>
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
                                  {employee.status === "Active" ? (
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
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove Employee
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
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
                    <CardTitle>All Employees</CardTitle>
                    <CardDescription>
                      Manage all employees across all posts
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-[300px]"
                      />
                    </div>
                    <Button>
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
                      <TableHead>Post</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                          {employee.name}
                        </TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.post}</TableCell>
                        <TableCell>{employee.designation}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              employee.status === "Active"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{employee.joinDate}</TableCell>
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
                                {employee.status === "Active" ? (
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
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Employee
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
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
                  <Select defaultValue={editingEmployee.post}>
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
      </div>

      <footer className="px-4 py-5 mt-10 text-white bg-zinc-700">
        <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2.5 max-sm:text-center">
          <div className="flex items-center gap-6">
            <div>
              <img src="/nic-logo.png" alt="NIC Logo" className="h-8 w-auto" />
            </div>
            <div>
              <div className="mb-1.5 text-xs">
                Website Designed, Developed, hosted and maintained by National
                Informatics Centre
              </div>
              <div className="text-xs">
                <span>{new Date().toDateString()}</span>
                <span> | Copyright © {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs">
              <span>Privacy Policy</span>
              <span> | Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
