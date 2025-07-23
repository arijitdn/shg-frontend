import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import {
  Calendar,
  CalendarDays,
  Download,
  Eye,
  FileText,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

export default function DMMUDashboard() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [_selectedSHG, setSelectedSHG] = useState<string | null>(null);

  const [shgFilters, setSHGFilters] = useState({
    block: "all",
    district: "all",
    vo: "all",
    clf: "all",
  });
  const [voFilters, setVOFilters] = useState({
    block: "all",
    district: "all",
    clf: "all",
  });
  const [clfFilters, setCLFFilters] = useState({
    district: "all",
  });

  // Mock data
  const shgs = [
    {
      id: "1",
      name: "Mahila Shakti SHG",
      members: 12,
      village: "Rampur",
      status: "Active",
      products: 8,
      block: "Rampur Block",
      district: "North District",
      vo: "Rampur VO",
      clf: "North District CLF",
    },
    {
      id: "2",
      name: "Swayam Sahayata Group",
      members: 15,
      village: "Krishnanagar",
      status: "Active",
      products: 5,
      block: "Krishnanagar Block",
      district: "North District",
      vo: "Krishnanagar VO",
      clf: "North District CLF",
    },
    {
      id: "3",
      name: "Ujjwala Women Group",
      members: 10,
      village: "Govindpur",
      status: "Inactive",
      products: 3,
      block: "Govindpur Block",
      district: "South District",
      vo: "Govindpur VO",
      clf: "South District CLF",
    },
    {
      id: "4",
      name: "Pragati Mahila Mandal",
      members: 18,
      village: "Sitapur",
      status: "Active",
      products: 12,
      block: "Sitapur Block",
      district: "South District",
      vo: "Sitapur VO",
      clf: "South District CLF",
    },
  ];

  const vos = [
    {
      id: "1",
      name: "Rampur VO",
      shgs: 8,
      members: 96,
      status: "Active",
      block: "Rampur Block",
      district: "North District",
      clf: "North District CLF",
    },
    {
      id: "2",
      name: "Krishnanagar VO",
      shgs: 6,
      members: 72,
      status: "Active",
      block: "Krishnanagar Block",
      district: "North District",
      clf: "North District CLF",
    },
    {
      id: "3",
      name: "Govindpur VO",
      shgs: 5,
      members: 60,
      status: "Active",
      block: "Govindpur Block",
      district: "South District",
      clf: "South District CLF",
    },
  ];

  const clfs = [
    {
      id: "1",
      name: "North District CLF",
      vos: 12,
      shgs: 84,
      members: 1008,
      status: "Active",
      district: "North District",
    },
    {
      id: "2",
      name: "South District CLF",
      vos: 10,
      shgs: 70,
      members: 840,
      status: "Active",
      district: "South District",
    },
  ];

  const meetings = [
    {
      id: "1",
      title: "Monthly SHG Review",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "Review",
      status: "Completed",
    },
    {
      id: "2",
      title: "VO Coordination Meeting",
      date: "2024-01-20",
      time: "2:00 PM",
      type: "Coordination",
      status: "Scheduled",
    },
    {
      id: "3",
      title: "CLF Planning Session",
      date: "2024-01-25",
      time: "11:00 AM",
      type: "Planning",
      status: "Scheduled",
    },
  ];

  const allProducts = [
    {
      id: "1",
      name: "Handwoven Sarees",
      shg: "Mahila Shakti SHG",
      price: 1200,
      stock: 25,
      category: "Textiles",
    },
    {
      id: "2",
      name: "Organic Honey",
      shg: "Swayam Sahayata Group",
      price: 350,
      stock: 50,
      category: "Food",
    },
    {
      id: "3",
      name: "Bamboo Baskets",
      shg: "Ujjwala Women Group",
      price: 180,
      stock: 30,
      category: "Handicrafts",
    },
    {
      id: "4",
      name: "Pickles & Preserves",
      shg: "Pragati Mahila Mandal",
      price: 120,
      stock: 100,
      category: "Food",
    },
    {
      id: "5",
      name: "Embroidered Bags",
      shg: "Mahila Shakti SHG",
      price: 450,
      stock: 40,
      category: "Accessories",
    },
    {
      id: "6",
      name: "Herbal Soaps",
      shg: "Swayam Sahayata Group",
      price: 80,
      stock: 75,
      category: "Personal Care",
    },
  ];

  const shgProducts = {
    "1": [
      {
        id: "1",
        name: "Handwoven Sarees",
        price: 1200,
        stock: 25,
        category: "Textiles",
      },
      {
        id: "5",
        name: "Embroidered Bags",
        price: 450,
        stock: 40,
        category: "Accessories",
      },
    ],
    "2": [
      {
        id: "2",
        name: "Organic Honey",
        price: 350,
        stock: 50,
        category: "Food",
      },
      {
        id: "6",
        name: "Herbal Soaps",
        price: 80,
        stock: 75,
        category: "Personal Care",
      },
    ],
  };

  const blocks = [
    { id: "1", name: "Rampur Block" },
    { id: "2", name: "Krishnanagar Block" },
    { id: "3", name: "Govindpur Block" },
    { id: "4", name: "Sitapur Block" },
  ];

  const districts = [
    { id: "1", name: "North District" },
    { id: "2", name: "South District" },
  ];

  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkOrder = () => {
    if (selectedProducts.length > 0) {
      alert(`Bulk order initiated for ${selectedProducts.length} products`);
      setSelectedProducts([]);
    }
  };

  const filteredSHGs = shgs.filter((shg) => {
    return (
      (shgFilters.block === "all" || shg.block === shgFilters.block) &&
      (shgFilters.district === "all" || shg.district === shgFilters.district) &&
      (shgFilters.vo === "all" || shg.vo === shgFilters.vo) &&
      (shgFilters.clf === "all" || shg.clf === shgFilters.clf)
    );
  });

  const filteredVOs = vos.filter((vo) => {
    return (
      (voFilters.block === "all" || vo.block === voFilters.block) &&
      (voFilters.district === "all" || vo.district === voFilters.district) &&
      (voFilters.clf === "all" || vo.clf === voFilters.clf)
    );
  });

  const filteredCLFs = clfs.filter((clf) => {
    return (
      clfFilters.district === "all" || clf.district === clfFilters.district
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                DMMU Dashboard
              </h1>
              <p className="text-gray-600">District Mission Management Unit</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shgs">SHGs</TabsTrigger>
            <TabsTrigger value="vos">VOs</TabsTrigger>
            <TabsTrigger value="clfs">CLFs</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total SHGs
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">154</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active VOs
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">22</div>
                  <p className="text-xs text-muted-foreground">
                    All operational
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CLFs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">
                    District coverage
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">
                    Available for order
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        New SHG registered in Rampur
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Monthly meeting completed
                      </p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Bulk order processed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        3 days ago
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {meetings
                    .filter((m) => m.status === "Scheduled")
                    .map((meeting) => (
                      <div
                        key={meeting.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">{meeting.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {meeting.date} at {meeting.time}
                          </p>
                        </div>
                        <Badge variant="outline">{meeting.type}</Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shgs" className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Self Help Groups</h2>
                <p className="text-muted-foreground">
                  Manage and monitor all SHGs in the district
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search SHGs..."
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                value={shgFilters.block}
                onValueChange={(value) =>
                  setSHGFilters({ ...shgFilters, block: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Block" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blocks</SelectItem>
                  {blocks.map((block) => (
                    <SelectItem key={block.id} value={block.name}>
                      {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={shgFilters.district}
                onValueChange={(value) =>
                  setSHGFilters({ ...shgFilters, district: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={shgFilters.vo}
                onValueChange={(value) =>
                  setSHGFilters({ ...shgFilters, vo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by VO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All VOs</SelectItem>
                  {vos.map((vo) => (
                    <SelectItem key={vo.id} value={vo.name}>
                      {vo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={shgFilters.clf}
                onValueChange={(value) =>
                  setSHGFilters({ ...shgFilters, clf: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by CLF" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All CLFs</SelectItem>
                  {clfs.map((clf) => (
                    <SelectItem key={clf.id} value={clf.name}>
                      {clf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SHG Name</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Village
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Block
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        District
                      </TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Products
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSHGs.map((shg) => (
                      <TableRow key={shg.id}>
                        <TableCell className="font-medium">
                          {shg.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {shg.village}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {shg.block}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {shg.district}
                        </TableCell>
                        <TableCell>{shg.members}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {shg.products}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              shg.status === "Active" ? "default" : "secondary"
                            }
                          >
                            {shg.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedSHG(shg.id)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">
                                    View Products
                                  </span>
                                  <span className="sm:hidden">Products</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-lg sm:text-xl">
                                    {shg.name} - Products
                                  </DialogTitle>
                                  <DialogDescription>
                                    Products available from this SHG
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {shgProducts[
                                    shg.id as keyof typeof shgProducts
                                  ]?.map((product) => (
                                    <div
                                      key={product.id}
                                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                                    >
                                      <div className="flex-1">
                                        <h4 className="font-medium">
                                          {product.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          Category: {product.category}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          Stock: {product.stock} units
                                        </p>
                                      </div>
                                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
                                        <p className="font-semibold">
                                          ₹{product.price}
                                        </p>
                                        <Button size="sm">
                                          <ShoppingCart className="h-4 w-4 mr-1" />
                                          Order
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">
                                    Details
                                  </span>
                                  <span className="sm:hidden">Info</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-lg sm:text-xl">
                                    {shg.name} - Complete Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Comprehensive information about this SHG
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          SHG Name
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {shg.name}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Village
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {shg.village}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Block
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {shg.block}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          District
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {shg.district}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Total Members
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {shg.members} active members
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Status
                                        </Label>
                                        <Badge
                                          variant={
                                            shg.status === "Active"
                                              ? "default"
                                              : "secondary"
                                          }
                                          className="mt-1"
                                        >
                                          {shg.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Village Organization
                                        </Label>
                                        <p className="text-sm mt-1">{shg.vo}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Cluster Level Federation
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {shg.clf}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Products Available
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {shg.products} different products
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Formation Date
                                        </Label>
                                        <p className="text-sm mt-1">
                                          March 15, 2022
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Last Meeting
                                        </Label>
                                        <p className="text-sm mt-1">
                                          January 10, 2024
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Monthly Savings
                                        </Label>
                                        <p className="text-sm mt-1">
                                          ₹
                                          {(
                                            Math.random() * 5000 +
                                            2000
                                          ).toFixed(0)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Recent Activities
                                      </Label>
                                      <div className="mt-2 space-y-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                          <span className="text-sm">
                                            Monthly savings collection completed
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            2 days ago
                                          </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                          <span className="text-sm">
                                            New product added to catalog
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            1 week ago
                                          </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                          <span className="text-sm">
                                            Training session conducted
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            2 weeks ago
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <Label className="text-sm font-medium">
                                        Contact Information
                                      </Label>
                                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-muted-foreground">
                                            President
                                          </p>
                                          <p className="text-sm font-medium">
                                            Sunita Devi
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            +91 98765 43210
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">
                                            Secretary
                                          </p>
                                          <p className="text-sm font-medium">
                                            Meera Sharma
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            +91 98765 43211
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      className="w-full sm:w-auto bg-transparent"
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Export Details
                                    </Button>
                                    <Button className="w-full sm:w-auto">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Generate Report
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="vos" className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Village Organizations</h2>
                <p className="text-muted-foreground">
                  Monitor VO performance and activities
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                value={voFilters.block}
                onValueChange={(value) =>
                  setVOFilters({ ...voFilters, block: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Block" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Blocks</SelectItem>
                  {blocks.map((block) => (
                    <SelectItem key={block.id} value={block.name}>
                      {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={voFilters.district}
                onValueChange={(value) =>
                  setVOFilters({ ...voFilters, district: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={voFilters.clf}
                onValueChange={(value) =>
                  setVOFilters({ ...voFilters, clf: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by CLF" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All CLFs</SelectItem>
                  {clfs.map((clf) => (
                    <SelectItem key={clf.id} value={clf.name}>
                      {clf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VO Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Block
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        District
                      </TableHead>
                      <TableHead>SHGs</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Total Members
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVOs.map((vo) => (
                      <TableRow key={vo.id}>
                        <TableCell className="font-medium">{vo.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {vo.block}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {vo.district}
                        </TableCell>
                        <TableCell>{vo.shgs}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {vo.members}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{vo.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">View</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-lg sm:text-xl">
                                    {vo.name} - Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Complete information about this Village
                                    Organization
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          VO Name
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {vo.name}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Block
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {vo.block}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Total SHGs
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {vo.shgs} groups
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          District
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {vo.district}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          CLF
                                        </Label>
                                        <p className="text-sm mt-1">{vo.clf}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Total Members
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {vo.members} women
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Status
                                        </Label>
                                        <Badge
                                          variant="default"
                                          className="mt-1"
                                        >
                                          {vo.status}
                                        </Badge>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Formation Date
                                        </Label>
                                        <p className="text-sm mt-1">
                                          June 20, 2021
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Last Review
                                        </Label>
                                        <p className="text-sm mt-1">
                                          December 15, 2023
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">
                                      Associated SHGs
                                    </Label>
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {Array.from(
                                        { length: Math.min(vo.shgs, 6) },
                                        (_, i) => (
                                          <div
                                            key={i}
                                            className="p-3 bg-gray-50 rounded-lg"
                                          >
                                            <p className="text-sm font-medium">
                                              SHG {i + 1}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {Math.floor(Math.random() * 8) +
                                                8}{" "}
                                              members
                                            </p>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      className="w-full sm:w-auto bg-transparent"
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Export Data
                                    </Button>
                                    <Button className="w-full sm:w-auto">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Generate Report
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Report</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="clfs" className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Cluster Level Federations
                </h2>
                <p className="text-muted-foreground">
                  Oversee CLF operations and coordination
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                value={clfFilters.district}
                onValueChange={(value) =>
                  setCLFFilters({ ...clfFilters, district: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CLF Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        District
                      </TableHead>
                      <TableHead>VOs</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        SHGs
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Total Members
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCLFs.map((clf) => (
                      <TableRow key={clf.id}>
                        <TableCell className="font-medium">
                          {clf.name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {clf.district}
                        </TableCell>
                        <TableCell>{clf.vos}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {clf.shgs}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {clf.members}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{clf.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">View</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-lg sm:text-xl">
                                    {clf.name} - Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Comprehensive overview of this Cluster Level
                                    Federation
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          CLF Name
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {clf.name}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          District
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {clf.district}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Coverage Area
                                        </Label>
                                        <p className="text-sm mt-1">
                                          12 Villages
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Village Organizations
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {clf.vos} VOs
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Self Help Groups
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {clf.shgs} SHGs
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Total Members
                                        </Label>
                                        <p className="text-sm mt-1">
                                          {clf.members} women
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Status
                                        </Label>
                                        <Badge
                                          variant="default"
                                          className="mt-1"
                                        >
                                          {clf.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Established
                                        </Label>
                                        <p className="text-sm mt-1">
                                          April 10, 2020
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Last Audit
                                        </Label>
                                        <p className="text-sm mt-1">
                                          November 2023
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">
                                      Performance Metrics
                                    </Label>
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                      <Card>
                                        <CardContent className="p-4">
                                          <div className="text-2xl font-bold text-green-600">
                                            95%
                                          </div>
                                          <p className="text-sm text-muted-foreground">
                                            Active SHGs
                                          </p>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardContent className="p-4">
                                          <div className="text-2xl font-bold text-blue-600">
                                            ₹2.4L
                                          </div>
                                          <p className="text-sm text-muted-foreground">
                                            Monthly Savings
                                          </p>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardContent className="p-4">
                                          <div className="text-2xl font-bold text-purple-600">
                                            156
                                          </div>
                                          <p className="text-sm text-muted-foreground">
                                            Products Available
                                          </p>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      className="w-full sm:w-auto bg-transparent"
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Export Report
                                    </Button>
                                    <Button className="w-full sm:w-auto">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Detailed Analysis
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Report</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Meetings & Schedules</h2>
                <p className="text-muted-foreground">
                  Manage meeting schedules and minutes
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar View
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {meetings
                      .filter((m) => m.status === "Scheduled")
                      .map((meeting) => (
                        <div
                          key={meeting.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{meeting.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              <CalendarDays className="h-4 w-4 inline mr-1" />
                              {meeting.date} at {meeting.time}
                            </p>
                            <Badge variant="outline" className="mt-2">
                              {meeting.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Meeting Minutes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {meetings
                      .filter((m) => m.status === "Completed")
                      .map((meeting) => (
                        <div
                          key={meeting.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{meeting.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Completed on {meeting.date}
                            </p>
                            <Badge variant="secondary" className="mt-2">
                              {meeting.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Minutes
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">All Products</h2>
                <p className="text-muted-foreground">
                  Browse and bulk order products from all SHGs
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="textiles">Textiles</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="handicrafts">Handicrafts</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="personal-care">Personal Care</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleBulkOrder}
                  disabled={selectedProducts.length === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Bulk Order ({selectedProducts.length})
                </Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedProducts.length === allProducts.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProducts(allProducts.map((p) => p.id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SHG</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() =>
                            handleProductSelect(product.id)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.shg}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.stock} units</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{product.name}</DialogTitle>
                                <DialogDescription>
                                  Product details and ordering
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>SHG</Label>
                                    <p className="text-sm">{product.shg}</p>
                                  </div>
                                  <div>
                                    <Label>Category</Label>
                                    <p className="text-sm">
                                      {product.category}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Price</Label>
                                    <p className="text-sm font-semibold">
                                      ₹{product.price}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Available Stock</Label>
                                    <p className="text-sm">
                                      {product.stock} units
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="quantity">
                                    Quantity to Order
                                  </Label>
                                  <Input
                                    id="quantity"
                                    type="number"
                                    placeholder="Enter quantity"
                                    min="1"
                                    max={product.stock}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="notes">
                                    Special Instructions
                                  </Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="Any special requirements or notes..."
                                  />
                                </div>
                                <Button className="w-full">
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Place Order
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Quick Order
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
