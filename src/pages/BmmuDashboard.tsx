import { useState } from "react";
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
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Upload,
  FileText,
  CalendarIcon,
  Download,
  Eye,
  UserPlus,
  Building2,
  Package,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";

// Types
interface Member {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
}

interface Organization {
  id: string;
  name: string;
  type: "SHG" | "VO" | "CLF";
  members: Member[];
  status: "active" | "inactive";
  createdDate: string;
  village?: string;
  block?: string;
}

interface Product {
  id: string;
  name: string;
  shgId: string;
  shgName: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  uploadDate: string;
}

interface Meeting {
  id: string;
  title: string;
  organizationId: string;
  organizationName: string;
  date: string;
  time: string;
  agenda: string;
  minutes?: string;
  status: "scheduled" | "completed";
}

export default function BMMUDashboard() {
  // State management
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: "1",
      name: "Mahila Shakti SHG",
      type: "SHG",
      members: [
        {
          id: "1",
          name: "Priya Sharma",
          phone: "9876543210",
          joinDate: "2024-01-15",
        },
        {
          id: "2",
          name: "Sunita Devi",
          phone: "9876543211",
          joinDate: "2024-01-20",
        },
      ],
      status: "active",
      createdDate: "2024-01-10",
      village: "Rampur",
    },
    {
      id: "2",
      name: "Gram Vikas VO",
      type: "VO",
      members: [
        {
          id: "3",
          name: "Rajesh Kumar",
          phone: "9876543212",
          joinDate: "2024-02-01",
        },
      ],
      status: "active",
      createdDate: "2024-01-25",
      village: "Shivpur",
    },
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Handmade Bags",
      shgId: "1",
      shgName: "Mahila Shakti SHG",
      category: "Handicrafts",
      price: 250,
      quantity: 50,
      description: "Beautiful handmade jute bags",
      uploadDate: "2024-01-20",
    },
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Monthly Review Meeting",
      organizationId: "1",
      organizationName: "Mahila Shakti SHG",
      date: "2024-01-25",
      time: "10:00",
      agenda: "Discuss monthly progress and upcoming activities",
      status: "completed",
      minutes: "Meeting completed successfully. All members attended.",
    },
  ]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);

  // Form states
  const [newOrg, setNewOrg] = useState({
    name: "",
    type: "SHG" as "SHG" | "VO" | "CLF",
    village: "",
    block: "",
  });

  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    shgId: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    organizationId: "",
    date: new Date(),
    time: "",
    agenda: "",
  });

  // Helper functions
  const createOrganization = () => {
    const org: Organization = {
      id: Date.now().toString(),
      name: newOrg.name,
      type: newOrg.type,
      members: [],
      status: "active",
      createdDate: new Date().toISOString().split("T")[0],
      village: newOrg.village,
      block: newOrg.block,
    };
    setOrganizations([...organizations, org]);
    setNewOrg({ name: "", type: "SHG", village: "", block: "" });
    setIsCreateOrgOpen(false);
  };

  const addMember = () => {
    if (!selectedOrg) return;

    const member: Member = {
      id: Date.now().toString(),
      name: newMember.name,
      phone: newMember.phone,
      joinDate: new Date().toISOString().split("T")[0],
    };

    const updatedOrgs = organizations.map((org) =>
      org.id === selectedOrg.id
        ? { ...org, members: [...org.members, member] }
        : org
    );
    setOrganizations(updatedOrgs);
    setNewMember({ name: "", phone: "" });
    setIsAddMemberOpen(false);
  };

  const addProduct = () => {
    const selectedSHG = organizations.find(
      (org) => org.id === newProduct.shgId
    );
    if (!selectedSHG) return;

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      shgId: newProduct.shgId,
      shgName: selectedSHG.name,
      category: newProduct.category,
      price: Number.parseFloat(newProduct.price),
      quantity: Number.parseInt(newProduct.quantity),
      description: newProduct.description,
      uploadDate: new Date().toISOString().split("T")[0],
    };

    setProducts([...products, product]);
    setNewProduct({
      name: "",
      shgId: "",
      category: "",
      price: "",
      quantity: "",
      description: "",
    });
    setIsAddProductOpen(false);
  };

  const scheduleMeeting = () => {
    const selectedOrgForMeeting = organizations.find(
      (org) => org.id === newMeeting.organizationId
    );
    if (!selectedOrgForMeeting) return;

    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      organizationId: newMeeting.organizationId,
      organizationName: selectedOrgForMeeting.name,
      date: format(newMeeting.date, "yyyy-MM-dd"),
      time: newMeeting.time,
      agenda: newMeeting.agenda,
      status: "scheduled",
    };

    setMeetings([...meetings, meeting]);
    setNewMeeting({
      title: "",
      organizationId: "",
      date: new Date(),
      time: "",
      agenda: "",
    });
    setIsScheduleMeetingOpen(false);
  };

  const toggleOrgStatus = (orgId: string) => {
    const updatedOrgs = organizations.map((org) =>
      org.id === orgId
        ? {
            ...org,
            status: (org.status === "active" ? "inactive" : "active") as
              | "active"
              | "inactive",
          }
        : org
    );
    setOrganizations(updatedOrgs);
  };

  const shgList = organizations.filter((org) => org.type === "SHG");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                BMMU Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Block Mission Management Unit
              </p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setIsCreateOrgOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Organization
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total SHGs
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {organizations.filter((org) => org.type === "SHG").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total VOs
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {organizations.filter((org) => org.type === "VO").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total CLFs
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {organizations.filter((org) => org.type === "CLF").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {organizations.reduce(
                      (total, org) => total + org.members.length,
                      0
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {organizations.slice(0, 5).map((org) => (
                      <div
                        key={org.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-gray-500">
                            {org.type} • {org.village}
                          </p>
                        </div>
                        <Badge
                          variant={
                            org.status === "active" ? "default" : "secondary"
                          }
                        >
                          {org.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {meetings
                      .filter((meeting) => meeting.status === "scheduled")
                      .slice(0, 5)
                      .map((meeting) => (
                        <div
                          key={meeting.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium">{meeting.title}</p>
                            <p className="text-sm text-gray-500">
                              {meeting.organizationName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {meeting.date}
                            </p>
                            <p className="text-sm text-gray-500">
                              {meeting.time}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organizations Management</CardTitle>
                <CardDescription>Manage SHGs, VOs, and CLFs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Village</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">
                          {org.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{org.type}</Badge>
                        </TableCell>
                        <TableCell>{org.village}</TableCell>
                        <TableCell>{org.members.length}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={org.status === "active"}
                              onCheckedChange={() => toggleOrgStatus(org.id)}
                            />
                            <span className="text-sm">
                              {org.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{org.createdDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrg(org);
                                setIsAddMemberOpen(true);
                              }}
                            >
                              <UserPlus className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Members Management</CardTitle>
                <CardDescription>
                  View and manage all members across organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.flatMap((org) =>
                      org.members.map((member) => (
                        <TableRow key={`${org.id}-${member.id}`}>
                          <TableCell className="font-medium">
                            {member.name}
                          </TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell>{org.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{org.type}</Badge>
                          </TableCell>
                          <TableCell>{member.joinDate}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Products Management</CardTitle>
                  <CardDescription>
                    Manage products uploaded by SHGs
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddProductOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SHG</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.shgName}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.uploadDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Meetings & Schedule</CardTitle>
                  <CardDescription>
                    Manage meetings and view minutes
                  </CardDescription>
                </div>
                <Button onClick={() => setIsScheduleMeetingOpen(true)}>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetings.map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell className="font-medium">
                          {meeting.title}
                        </TableCell>
                        <TableCell>{meeting.organizationName}</TableCell>
                        <TableCell>{meeting.date}</TableCell>
                        <TableCell>{meeting.time}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              meeting.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {meeting.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Organization Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive report of all SHGs, VOs, and CLFs
                  </p>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Member Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Detailed member information and statistics
                  </p>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Product Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Product inventory and sales analysis
                  </p>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2" />
                    Meeting Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Meeting attendance and minutes summary
                  </p>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Financial Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Financial summary and transactions
                  </p>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Overall performance metrics and KPIs
                  </p>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Organization Dialog */}
      <Dialog open={isCreateOrgOpen} onOpenChange={setIsCreateOrgOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Add a new SHG, VO, or CLF to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <Label htmlFor="org-type">Type</Label>
              <Select
                value={newOrg.type}
                onValueChange={(value: "SHG" | "VO" | "CLF") =>
                  setNewOrg({ ...newOrg, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHG">SHG (Self Help Group)</SelectItem>
                  <SelectItem value="VO">VO (Village Organization)</SelectItem>
                  <SelectItem value="CLF">
                    CLF (Cluster Level Federation)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="village">Village</Label>
              <Input
                id="village"
                value={newOrg.village}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, village: e.target.value })
                }
                placeholder="Enter village name"
              />
            </div>
            <div>
              <Label htmlFor="block">Block</Label>
              <Input
                id="block"
                value={newOrg.block}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, block: e.target.value })
                }
                placeholder="Enter block name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateOrgOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={createOrganization}>Create Organization</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Add a new member to {selectedOrg?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="member-name">Member Name</Label>
              <Input
                id="member-name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                placeholder="Enter member name"
              />
            </div>
            <div>
              <Label htmlFor="member-phone">Phone Number</Label>
              <Input
                id="member-phone"
                value={newMember.phone}
                onChange={(e) =>
                  setNewMember({ ...newMember, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddMemberOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={addMember}>Add Member</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Upload a new product for an SHG
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="product-shg">Select SHG</Label>
              <Select
                value={newProduct.shgId}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, shgId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SHG" />
                </SelectTrigger>
                <SelectContent>
                  {shgList.map((shg) => (
                    <SelectItem key={shg.id} value={shg.id}>
                      {shg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="product-category">Category</Label>
              <Input
                id="product-category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                placeholder="Enter category"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-price">Price (₹)</Label>
                <Input
                  id="product-price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  placeholder="Enter price"
                />
              </div>
              <div>
                <Label htmlFor="product-quantity">Quantity</Label>
                <Input
                  id="product-quantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, quantity: e.target.value })
                  }
                  placeholder="Enter quantity"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Enter product description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddProductOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={addProduct}>Add Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Dialog */}
      <Dialog
        open={isScheduleMeetingOpen}
        onOpenChange={setIsScheduleMeetingOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>
              Schedule a new meeting for an organization
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input
                id="meeting-title"
                value={newMeeting.title}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, title: e.target.value })
                }
                placeholder="Enter meeting title"
              />
            </div>
            <div>
              <Label htmlFor="meeting-org">Select Organization</Label>
              <Select
                value={newMeeting.organizationId}
                onValueChange={(value) =>
                  setNewMeeting({ ...newMeeting, organizationId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name} ({org.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Meeting Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newMeeting.date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newMeeting.date}
                      onSelect={(date) =>
                        date && setNewMeeting({ ...newMeeting, date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="meeting-time">Time</Label>
                <Input
                  id="meeting-time"
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) =>
                    setNewMeeting({ ...newMeeting, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="meeting-agenda">Agenda</Label>
              <Textarea
                id="meeting-agenda"
                value={newMeeting.agenda}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, agenda: e.target.value })
                }
                placeholder="Enter meeting agenda"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsScheduleMeetingOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={scheduleMeeting}>Schedule Meeting</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
