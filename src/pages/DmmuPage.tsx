import { useState, useEffect } from "react";
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
import { organizationApi, productApi } from "../lib/services";
import { useToast } from "../hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DMMUDashboard() {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [_selectedSHG, setSelectedSHG] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shgs, setSHGs] = useState<any[]>([]);
  const [vos, setVOs] = useState<any[]>([]);
  const [clfs, setCLFs] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

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

  // API data loading
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load SHGs, VOs, CLFs, and products in parallel
      const [shgResponse, voResponse, clfResponse, productResponse] =
        await Promise.all([
          organizationApi.getAllSHGs(),
          organizationApi.getAllVOs(),
          organizationApi.getAllCLFs(),
          productApi.getAllProducts(),
        ]);

      setSHGs(shgResponse.data || []);
      setVOs(voResponse.data || []);
      setCLFs(clfResponse.data || []);
      setAllProducts(productResponse.data || []);

      setMeetings([
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
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const shgProducts = allProducts.reduce((acc: any, product: any) => {
    const shgId = product.shgId || product.userId;
    if (!acc[shgId]) {
      acc[shgId] = [];
    }
    acc[shgId].push(product);
    return acc;
  }, {});

  // Extract unique blocks and districts from actual data
  const blocks = Array.from(
    new Set([
      ...shgs.map((shg: any) => shg.block).filter(Boolean),
      ...vos.map((vo: any) => vo.block).filter(Boolean),
    ])
  ).map((block, index) => ({ id: index.toString(), name: block }));

  const districts = Array.from(
    new Set([
      ...shgs.map((shg: any) => shg.district).filter(Boolean),
      ...vos.map((vo: any) => vo.district).filter(Boolean),
      ...clfs.map((clf: any) => clf.district).filter(Boolean),
    ])
  ).map((district, index) => ({ id: index.toString(), name: district }));

  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBulkOrder = async () => {
    if (selectedProducts.length > 0) {
      try {
        // Here you would implement the bulk order API call
        toast({
          title: "Success",
          description: `Bulk order initiated for ${selectedProducts.length} products`,
        });
        setSelectedProducts([]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create bulk order",
          variant: "destructive",
        });
      }
    }
  };

  const filteredSHGs = shgs.filter((shg: any) => {
    const matchesSearch =
      !searchQuery ||
      shg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shg.village?.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesSearch &&
      (shgFilters.block === "all" || shg.block === shgFilters.block) &&
      (shgFilters.district === "all" || shg.district === shgFilters.district) &&
      (shgFilters.vo === "all" || shg.vo === shgFilters.vo) &&
      (shgFilters.clf === "all" || shg.clf === shgFilters.clf)
    );
  });

  const filteredVOs = vos.filter((vo: any) => {
    return (
      (voFilters.block === "all" || vo.block === voFilters.block) &&
      (voFilters.district === "all" || vo.district === voFilters.district) &&
      (voFilters.clf === "all" || vo.clf === voFilters.clf)
    );
  });

  const filteredCLFs = clfs.filter((clf: any) => {
    return (
      clfFilters.district === "all" || clf.district === clfFilters.district
    );
  });

  const filteredProducts = allProducts.filter((product: any) => {
    return (
      categoryFilter === "all" ||
      product.category?.toLowerCase() === categoryFilter
    );
  });

  // PDF Export Functions
  const exportToPDF = async (type: string) => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add header
      pdf.setFontSize(18);
      pdf.text("DMMU Dashboard Report", pageWidth / 2, 20, { align: "center" });

      pdf.setFontSize(12);
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        30,
        { align: "center" }
      );

      let yPosition = 50;

      if (type === "overview") {
        // Overview Report
        pdf.setFontSize(14);
        pdf.text("Overview Statistics", 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(10);
        pdf.text(`Total SHGs: ${shgs.length}`, 20, yPosition);
        yPosition += 10;
        pdf.text(
          `Active SHGs: ${
            shgs.filter((shg: any) => shg.status === "Active").length
          }`,
          20,
          yPosition
        );
        yPosition += 10;
        pdf.text(`Total VOs: ${vos.length}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Total CLFs: ${clfs.length}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Total Products: ${allProducts.length}`, 20, yPosition);
        yPosition += 20;

        // SHG List
        pdf.setFontSize(14);
        pdf.text("SHG Details", 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(8);
        shgs.forEach((shg: any, index: number) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(
            `${index + 1}. ${shg.name} - ${shg.village || "N/A"} (${
              shg.status
            })`,
            20,
            yPosition
          );
          yPosition += 8;
        });
      } else if (type === "products") {
        // Products Report
        pdf.setFontSize(14);
        pdf.text("Products Report", 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(8);
        allProducts.forEach((product: any, index: number) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }
          const shg = shgs.find(
            (s: any) => s.id === product.shgId || s.id === product.userId
          );
          pdf.text(
            `${index + 1}. ${product.name} - ₹${product.price} (${
              product.category
            })`,
            20,
            yPosition
          );
          yPosition += 6;
          pdf.text(
            `   SHG: ${shg?.name || "Unknown"} | Stock: ${product.stock}`,
            20,
            yPosition
          );
          yPosition += 10;
        });
      }

      pdf.save(
        `DMMU_${type}_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );
      toast({
        title: "Success",
        description: "PDF report exported successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  const exportDataToPDF = async () => {
    try {
      // Create a comprehensive data export
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="text-align: center; color: #333;">DMMU Dashboard - Data Export</h1>
          <p style="text-align: center; color: #666;">Generated on: ${new Date().toLocaleDateString()}</p>
          
          <h2 style="color: #333; border-bottom: 2px solid #333;">Summary Statistics</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f5f5f5;">
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Metric</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Count</strong></td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Total SHGs</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                shgs.length
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Active SHGs</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                shgs.filter((shg: any) => shg.status === "Active").length
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Total VOs</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                vos.length
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Total CLFs</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                clfs.length
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">Total Products</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                allProducts.length
              }</td>
            </tr>
          </table>
          
          <h2 style="color: #333; border-bottom: 2px solid #333;">SHG Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f5f5f5;">
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Name</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Village</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Status</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Members</strong></td>
            </tr>
            ${shgs
              .map(
                (shg: any) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  shg.name
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  shg.village || "N/A"
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  shg.status
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  shg.members || "N/A"
                }</td>
              </tr>
            `
              )
              .join("")}
          </table>
        </div>
      `;

      document.body.appendChild(element);

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      document.body.removeChild(element);
      pdf.save(
        `DMMU_Data_Export_${new Date().toISOString().split("T")[0]}.pdf`
      );
      toast({
        title: "Success",
        description: "Data exported to PDF successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const exportSHGDetailsToPDF = async (shg: any) => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Add header
      pdf.setFontSize(18);
      pdf.text("SHG Details Report", pageWidth / 2, 20, { align: "center" });

      pdf.setFontSize(12);
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        30,
        { align: "center" }
      );

      let yPosition = 50;

      // SHG Information
      pdf.setFontSize(14);
      pdf.text("SHG Information", 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.text(`Name: ${shg.name}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Village: ${shg.village || "N/A"}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Block: ${shg.block || "N/A"}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`District: ${shg.district || "N/A"}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Status: ${shg.status}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Members: ${shg.members || "N/A"}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Products: ${shg.products || "N/A"}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`VO: ${shg.vo || "N/A"}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`CLF: ${shg.clf || "N/A"}`, 20, yPosition);
      yPosition += 15;

      // Products List
      const products = shgProducts[shg.id] || [];
      if (products.length > 0) {
        pdf.setFontSize(14);
        pdf.text("Products", 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(8);
        products.forEach((product: any, index: number) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(
            `${index + 1}. ${product.name} - ₹${product.price} (${
              product.category
            })`,
            20,
            yPosition
          );
          yPosition += 6;
          pdf.text(`   Stock: ${product.stock} units`, 20, yPosition);
          yPosition += 10;
        });
      }

      pdf.save(
        `SHG_${shg.name.replace(/[^a-z0-9]/gi, "_")}_Details_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
      toast({
        title: "Success",
        description: "SHG details exported successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export SHG details",
        variant: "destructive",
      });
    }
  };

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
              <Button variant="outline" onClick={loadData} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh Data"}
              </Button>
              <Button variant="outline" onClick={exportDataToPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={() => exportToPDF("overview")}>
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
                  <div className="text-2xl font-bold">
                    {loading ? "..." : shgs.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {shgs.filter((shg: any) => shg.status === "Active").length}{" "}
                    active
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
                  <div className="text-2xl font-bold">
                    {loading ? "..." : vos.length}
                  </div>
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
                  <div className="text-2xl font-bold">
                    {loading ? "..." : clfs.length}
                  </div>
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
                  <div className="text-2xl font-bold">
                    {loading ? "..." : allProducts.length}
                  </div>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                value={shgFilters.block}
                onValueChange={(value: string) =>
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
                onValueChange={(value: string) =>
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
                onValueChange={(value: string) =>
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
                onValueChange={(value: string) =>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          Loading SHGs...
                        </TableCell>
                      </TableRow>
                    ) : filteredSHGs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No SHGs found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSHGs.map((shg: any) => (
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
                                shg.status === "Active"
                                  ? "default"
                                  : "secondary"
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
                                    ]?.map((product: any) => (
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
                                          <p className="text-sm mt-1">
                                            {shg.vo}
                                          </p>
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
                                              Monthly savings collection
                                              completed
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
                                        onClick={() =>
                                          exportSHGDetailsToPDF(shg)
                                        }
                                      >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Details
                                      </Button>
                                      <Button
                                        className="w-full sm:w-auto"
                                        onClick={() => exportToPDF("overview")}
                                      >
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
                      ))
                    )}
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
                onValueChange={(value: string) =>
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
                onValueChange={(value: string) =>
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
                onValueChange={(value: string) =>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading VOs...
                        </TableCell>
                      </TableRow>
                    ) : filteredVOs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No VOs found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVOs.map((vo: any) => (
                        <TableRow key={vo.id}>
                          <TableCell className="font-medium">
                            {vo.name}
                          </TableCell>
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
                                    <span className="hidden sm:inline">
                                      View
                                    </span>
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
                                          <p className="text-sm mt-1">
                                            {vo.clf}
                                          </p>
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
                                        onClick={exportDataToPDF}
                                      >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Data
                                      </Button>
                                      <Button
                                        className="w-full sm:w-auto"
                                        onClick={() => exportToPDF("overview")}
                                      >
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
                      ))
                    )}
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
                onValueChange={(value: string) =>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading CLFs...
                        </TableCell>
                      </TableRow>
                    ) : filteredCLFs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No CLFs found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCLFs.map((clf: any) => (
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
                                    <span className="hidden sm:inline">
                                      View
                                    </span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-lg sm:text-xl">
                                      {clf.name} - Details
                                    </DialogTitle>
                                    <DialogDescription>
                                      Comprehensive overview of this Cluster
                                      Level Federation
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
                      ))
                    )}
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
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
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
                  variant="outline"
                  onClick={() => exportToPDF("products")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Products Report
                </Button>
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
                        checked={
                          selectedProducts.length === filteredProducts.length
                        }
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setSelectedProducts(
                              filteredProducts.map((p: any) => p.id)
                            );
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No products found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product: any) => {
                      const shg = shgs.find(
                        (s: any) =>
                          s.groupId === product.shgId || s.id === product.userId
                      );
                      return (
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
                          <TableCell>{shg?.name || "Unknown SHG"}</TableCell>
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
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
