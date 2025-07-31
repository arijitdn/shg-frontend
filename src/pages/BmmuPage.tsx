import { useEffect, useState } from "react";
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
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "../hooks/use-toast";
import { useUser } from "../hooks/use-user";
import { organizationApi, productApi } from "../lib/services";
import { productCategories } from "../lib/categories";
import useAuthStore from "../store/auth.store";
import apiClient from "@/lib/api";

// Types
interface Member {
  name: string;
  phone: string;
  role: "SHG" | "VO" | "CLF";
  organizationId: string;
}

interface Organization {
  id: string;
  name: string;
  type: "SHG" | "VO" | "CLF";
  members: Member[];
  status: "active" | "inactive";
  block?: string;
  district?: string;
  voId?: string;
  clfId?: string;
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
  imageUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  type?: string;
  stock?: number;
  userId?: string;
  userName?: string;
  createdAt?: string;
  remarks?: string;
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
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [totalShgs, setTotalShgs] = useState(0);
  const [totalVos, setTotalVos] = useState(0);
  const [totalClfs, setTotalClfs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { name: userName } = useUser();
  const { user } = useAuthStore();

  async function fetchData() {
    setIsLoading(true);
    try {
      // Fetch SHGs
      const { data: shgData } = await organizationApi.getAllSHGs();
      const shgOrgs: Organization[] = shgData.map((shg: any) => ({
        id: shg.groupId,
        name: shg.name,
        type: "SHG" as const,
        members: [],
        status: "active" as const,
        block: shg.block,
        district: shg.district,
        voId: shg.voId,
        clfId: shg.clfId,
      }));

      // Fetch VOs
      const { data: voData } = await organizationApi.getAllVOs();
      const voOrgs: Organization[] = voData.map((vo: any) => ({
        id: vo.groupId,
        name: vo.name,
        type: "VO" as const,
        members: [],
        status: "active" as const,
        district: vo.district,
        clfId: vo.clfId,
      }));

      // Fetch CLFs
      const { data: clfData } = await organizationApi.getAllCLFs();
      const clfOrgs: Organization[] = clfData.map((clf: any) => ({
        id: clf.groupId,
        name: clf.name,
        type: "CLF" as const,
        members: [],
        status: "active" as const,
        district: clf.district,
      }));

      // Combine all organizations
      const allOrgs = [...shgOrgs, ...voOrgs, ...clfOrgs];
      setOrganizations(allOrgs);
      setTotalShgs(shgOrgs.length);
      setTotalVos(voOrgs.length);
      setTotalClfs(clfOrgs.length);

      // Fetch approved products
      try {
        const { data: productData } = await productApi.getApprovedProducts();
        const formattedProducts: Product[] = productData.map(
          (product: any) => ({
            id: product.id,
            name: product.name,
            shgId: product.shgId,
            shgName: product.shgName || "Unknown SHG",
            type: product.type || "N/A",
            category: product.category,
            price: product.price,
            userId: product.userId || "N/A",
            userName: product.userName || "N/A",
            quantity: product.stock || product.quantity || 0,
            description: product.description,
            uploadDate: product.createdAt
              ? new Date(product.createdAt).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            imageUrl: product.imageUrl || "",
            status: product.status || "APPROVED",
          })
        );
        setProducts(formattedProducts);
      } catch (productError) {
        setProducts([]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch available VOs and CLFs for dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingVOs(true);
        setLoadingCLFs(true);

        const [vosResponse, clfsResponse] = await Promise.all([
          organizationApi.getAllVOs(),
          organizationApi.getAllCLFs(),
        ]);

        setAvailableVOs(vosResponse.data || []);
        setAvailableCLFs(clfsResponse.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setLoadingVOs(false);
        setLoadingCLFs(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Handle VO ID search
  const searchVOById = async () => {
    if (!newOrg.voId.trim()) {
      setVoIdError("Please enter a VO ID");
      return;
    }

    setVoIdError("");
    try {
      const response = await organizationApi.getVOById(newOrg.voId);
      if (response.data) {
        // VO found - auto-populate CLF if available and not already set
        if (response.data.clfId && !newOrg.clfId) {
          setNewOrg((prev) => ({
            ...prev,
            clfId: response.data.clfId,
          }));
        }
        toast({
          title: "Success",
          description: `VO found: ${response.data.name}`,
        });
      }
    } catch (error) {
      setVoIdError("VO ID not found");
    }
  };

  // Handle CLF ID search
  const searchCLFById = async () => {
    if (!newOrg.clfId.trim()) {
      setClfIdError("Please enter a CLF ID");
      return;
    }

    setClfIdError("");
    try {
      const response = await organizationApi.getCLFById(newOrg.clfId);
      if (response.data) {
        toast({
          title: "Success",
          description: `CLF found: ${response.data.name}`,
        });
      }
    } catch (error) {
      setClfIdError("CLF ID not found");
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Filter products based on search term
  useEffect(() => {
    if (!productSearchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(productSearchTerm.toLowerCase()) ||
          product.shgName
            .toLowerCase()
            .includes(productSearchTerm.toLowerCase()) ||
          product.category
            .toLowerCase()
            .includes(productSearchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, productSearchTerm]);

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
  const [isViewOrgOpen, setIsViewOrgOpen] = useState(false);
  const [viewingOrg, setViewingOrg] = useState<Organization | null>(null);
  const [orgMembers, setOrgMembers] = useState<any[]>([]);
  const [loadingOrgDetails, setLoadingOrgDetails] = useState(false);
  const [isViewProductOpen, setIsViewProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

  // Form states
  const [newOrg, setNewOrg] = useState({
    name: "",
    type: "SHG" as "SHG" | "VO" | "CLF",
    block: "",
    district: "",
    voId: "",
    clfId: "",
  });

  // State for dropdowns
  const [availableVOs, setAvailableVOs] = useState<
    Array<{ groupId: string; name: string; clfId?: string }>
  >([]);
  const [availableCLFs, setAvailableCLFs] = useState<
    Array<{ groupId: string; name: string }>
  >([]);
  const [loadingVOs, setLoadingVOs] = useState(false);
  const [loadingCLFs, setLoadingCLFs] = useState(false);
  const [voIdError, setVoIdError] = useState("");
  const [clfIdError, setClfIdError] = useState("");

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
    imageUrl: "",
  });

  const [shgSearchId, setShgSearchId] = useState("");
  const [isSearchingSHG, setIsSearchingSHG] = useState(false);
  const [foundSHG, setFoundSHG] = useState<Organization | null>(null);

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    organizationId: "",
    date: new Date(),
    time: "",
    agenda: "",
  });

  // Helper functions
  const createOrganization = async () => {
    if (!newOrg.name || !newOrg.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (newOrg.type === "CLF") {
        const clf = {
          name: newOrg.name,
          district: newOrg.district,
        };

        const { data, status } = await organizationApi.createCLF(clf);
        if (status !== 201) {
          toast({
            title: "Error",
            description: "Failed to create CLF",
            variant: "destructive",
          });
          return;
        }

        const org: Organization = {
          id: data.groupId,
          name: data.name,
          type: "CLF",
          members: [],
          status: "active",
          district: data.district,
        };

        setOrganizations([...organizations, org]);
        setTotalClfs((prev) => prev + 1);
      } else if (newOrg.type === "VO") {
        const vo = {
          name: newOrg.name,
          district: newOrg.district,
          clfId: newOrg.clfId,
        };

        const { data, status } = await organizationApi.createVO(vo);
        if (status !== 201) {
          toast({
            title: "Error",
            description: "Failed to create VO",
            variant: "destructive",
          });
          return;
        }

        const org: Organization = {
          id: data.groupId,
          name: data.name,
          type: "VO",
          members: [],
          status: "active",
          district: data.district,
          clfId: data.clfId,
        };

        setOrganizations([...organizations, org]);
        setTotalVos((prev) => prev + 1);
      } else if (newOrg.type === "SHG") {
        const { data, status } = await organizationApi.createSHG(newOrg);
        if (status !== 201) {
          toast({
            title: "Error",
            description: "Failed to create SHG",
            variant: "destructive",
          });
          return;
        }

        const org: Organization = {
          id: data.groupId,
          name: data.name,
          type: "SHG",
          members: [],
          status: "active",
          block: data.block,
          district: data.district,
          voId: data.voId,
          clfId: data.clfId,
        };

        setOrganizations([...organizations, org]);
        setTotalShgs((prev) => prev + 1);
      }

      toast({
        title: "Success",
        description: `${newOrg.type} created successfully`,
      });

      // Reset form and close dialog
      setNewOrg({
        name: "",
        type: "SHG",
        block: "",
        district: "",
        voId: "",
        clfId: "",
      });
      setVoIdError("");
      setClfIdError("");
      setIsCreateOrgOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || `Failed to create ${newOrg.type}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle viewing organization details
  const viewOrganizationDetails = async (org: Organization) => {
    setViewingOrg(org);
    setIsViewOrgOpen(true);
    setLoadingOrgDetails(true);

    try {
      // Fetch organization members based on type
      let membersResponse;
      if (org.type === "SHG") {
        membersResponse = await apiClient.get(`/shg/members/${org.id}`);
      } else if (org.type === "VO") {
        membersResponse = await apiClient.get(`/vo/members/${org.id}`);
      } else if (org.type === "CLF") {
        membersResponse = await apiClient.get(`/clf/members/${org.id}`);
      }

      if (membersResponse?.data) {
        setOrgMembers(membersResponse.data);
      } else {
        setOrgMembers([]);
      }
    } catch (error) {
      console.error("Error fetching organization members:", error);
      setOrgMembers([]);
      toast({
        title: "Warning",
        description: "Could not load organization members",
        variant: "destructive",
      });
    } finally {
      setLoadingOrgDetails(false);
    }
  };

  // Handle viewing product details
  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsViewProductOpen(true);
  };

  // Handle editing product
  const editProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  // Handle updating product
  const updateProduct = async () => {
    if (!selectedProduct) return;

    setIsUpdatingProduct(true);

    try {
      const formData = new FormData();

      // Check if image file was uploaded
      const fileInput = document.getElementById(
        "edit-product-image"
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (file) {
        formData.append("image", file);
      }

      formData.append("name", selectedProduct.name);
      formData.append("description", selectedProduct.description);
      formData.append("type", selectedProduct.type || "");

      await apiClient.patch(
        `/products/update/${selectedProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      // Refresh products list and close dialog
      fetchData();
      setIsEditProductOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const addMember = async () => {
    if (!selectedOrg) return;

    const member: Member = {
      name: newMember.name,
      phone: newMember.phone,
      role: selectedOrg.type,
      organizationId: selectedOrg.id,
    };
    try {
      await apiClient.post("/org-auth/create-member", member);
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      });
    }

    setNewMember({ name: "", phone: "" });
    setIsAddMemberOpen(false);
  };

  const addProduct = async () => {
    let selectedSHG = organizations.find((org) => org.id === newProduct.shgId);

    // If no SHG selected from dropdown, use the found SHG from search
    if (!selectedSHG && foundSHG) {
      selectedSHG = foundSHG;
    }

    if (!selectedSHG) {
      toast({
        title: "Error",
        description: "Please select an SHG",
        variant: "destructive",
      });
      return;
    }

    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.quantity
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Handle image upload
      const fileInput = document.getElementById(
        "product-image"
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (file) {
        formData.append("image", file);
      }

      formData.append("name", newProduct.name);
      formData.append("category", newProduct.category);
      formData.append("description", newProduct.description);
      formData.append(
        "price",
        Math.round(parseFloat(newProduct.price) * 100).toString()
      );
      formData.append("stock", newProduct.quantity);
      formData.append("type", "nfc"); // Set type to NFC for BMMU products
      formData.append("shgId", selectedSHG.id);

      // Use the user ID from auth if available, otherwise use a default
      if (user?.id) {
        formData.append("userId", user.id);
      }

      await productApi.createProduct(formData);

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      // Reset form and close dialog
      setNewProduct({
        name: "",
        shgId: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
        imageUrl: "",
      });
      setShgSearchId("");
      setFoundSHG(null);
      setIsAddProductOpen(false);

      // Refresh the products list
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  const searchSHGById = async () => {
    if (!shgSearchId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an SHG ID",
        variant: "destructive",
      });
      return;
    }

    setIsSearchingSHG(true);
    try {
      const { data } = await organizationApi.getSHGById(shgSearchId);

      // Validate that we have the required data
      if (!data || !data.groupId || !data.name) {
        throw new Error("Invalid SHG data received from server");
      }

      const foundShgOrg: Organization = {
        id: data.groupId,
        name: data.name,
        type: "SHG",
        members: [],
        status: "active",
        block: data.block || "",
        district: data.district || "",
        voId: data.voId || "",
        clfId: data.clfId || "",
      };

      setFoundSHG(foundShgOrg);
      setNewProduct({ ...newProduct, shgId: foundShgOrg.id });

      toast({
        title: "Success",
        description: `Found SHG: ${foundShgOrg.name}`,
      });
    } catch (error: any) {
      setFoundSHG(null);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || error.message || "SHG not found",
        variant: "destructive",
      });
    } finally {
      setIsSearchingSHG(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProduct({
          ...newProduct,
          imageUrl: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
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
                Block Mission Management Unit{" "}
                {userName && `- Welcome, ${userName}`}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsCreateOrgOpen(true)}
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Organization
              </Button>
              <Button
                variant="outline"
                onClick={fetchData}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh"}
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
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg">Loading dashboard...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total SHGs
                      </CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalShgs}</div>
                      <p className="text-xs text-muted-foreground">
                        Self Help Groups
                      </p>
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
                      <div className="text-2xl font-bold">{totalVos}</div>
                      <p className="text-xs text-muted-foreground">
                        Village Organizations
                      </p>
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
                      <div className="text-2xl font-bold">{totalClfs}</div>
                      <p className="text-xs text-muted-foreground">
                        Cluster Level Federations
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Organizations
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {totalShgs + totalVos + totalClfs}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        All Organizations
                      </p>
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
                        {organizations.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">
                            No organizations found
                          </p>
                        ) : (
                          organizations.slice(0, 5).map((org) => (
                            <div
                              key={org.id}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium">{org.name}</p>
                                <p className="text-sm text-gray-500">
                                  Type: {org.type}
                                </p>
                                {org.district && (
                                  <p className="text-sm text-gray-500">
                                    District: {org.district}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    org.status === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {org.status}
                                </Badge>
                              </div>
                            </div>
                          ))
                        )}
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
                        {meetings.filter(
                          (meeting) => meeting.status === "scheduled"
                        ).length === 0 && (
                          <p className="text-center text-gray-500 py-4">
                            No upcoming meetings
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organizations Management</CardTitle>
                <CardDescription>Manage SHGs, VOs, and CLFs</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading organizations...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead>Block</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {organizations.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            No organizations found. Create your first
                            organization to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        organizations.map((org) => (
                          <TableRow key={org.id}>
                            <TableCell className="font-medium">
                              {org.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{org.type}</Badge>
                            </TableCell>
                            <TableCell>{org.district || "N/A"}</TableCell>
                            <TableCell>{org.block || "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={org.status === "active"}
                                  onCheckedChange={() =>
                                    toggleOrgStatus(org.id)
                                  }
                                />
                                <span className="text-sm">
                                  {org.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </div>
                            </TableCell>
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => viewOrganizationDetails(org)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
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
                {/* Search Bar */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products by name, SHG, or category..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
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
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-gray-500"
                        >
                          {productSearchTerm.trim()
                            ? "No products found matching your search."
                            : "No products available. Add your first product to get started."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-md border"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-md border flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.shgName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.uploadDate}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewProductDetails(product)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => editProduct(product)}
                              >
                                <Edit className="w-4 h-4" />
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
          <div className="space-y-4 overflow-y-auto max-h-[70vh] w-full">
            <div className="px-4">
              <Label htmlFor="org-name">Organization Name *</Label>
              <Input
                id="org-name"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                placeholder="Enter organization name"
                required
              />
            </div>
            <div className="px-4">
              <Label htmlFor="org-type">Type *</Label>
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
            <div className="px-4">
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                value={newOrg.district}
                onChange={(e) =>
                  setNewOrg({ ...newOrg, district: e.target.value })
                }
                placeholder="Enter district name"
              />
            </div>
            {newOrg.type === "SHG" && (
              <div className="px-4">
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
            )}
            {newOrg.type === "SHG" && (
              <>
                <div className="px-4">
                  <Label htmlFor="voId">VO Selection</Label>
                  <div className="space-y-2">
                    <Select
                      value={newOrg.voId}
                      onValueChange={(value) =>
                        setNewOrg({ ...newOrg, voId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingVOs
                              ? "Loading VOs..."
                              : "Select a VO (optional)"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVOs.map((vo) => (
                          <SelectItem key={vo.groupId} value={vo.groupId}>
                            {vo.name} (ID: {vo.groupId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div>
                      <Label
                        htmlFor="voIdInput"
                        className="text-sm text-muted-foreground"
                      >
                        Or enter VO ID directly:
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="voIdInput"
                          value={newOrg.voId}
                          onChange={(e) =>
                            setNewOrg({ ...newOrg, voId: e.target.value })
                          }
                          placeholder="Enter VO ID"
                          className={
                            voIdError ? "border-red-500 flex-1" : "flex-1"
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={searchVOById}
                          disabled={!newOrg.voId.trim()}
                        >
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                      {voIdError && (
                        <p className="text-sm text-red-500 mt-1">{voIdError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {(newOrg.type === "VO" || newOrg.type === "SHG") && (
              <>
                <div className="px-4">
                  <Label htmlFor="clfId">CLF Selection</Label>
                  <div className="space-y-2">
                    <Select
                      value={newOrg.clfId}
                      onValueChange={(value) =>
                        setNewOrg({ ...newOrg, clfId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingCLFs
                              ? "Loading CLFs..."
                              : `Select a CLF ${
                                  newOrg.type === "VO"
                                    ? "(required)"
                                    : "(optional)"
                                }`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCLFs.map((clf) => (
                          <SelectItem key={clf.groupId} value={clf.groupId}>
                            {clf.name} (ID: {clf.groupId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div>
                      <Label
                        htmlFor="clfIdInput"
                        className="text-sm text-muted-foreground"
                      >
                        Or enter CLF ID directly:
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="clfIdInput"
                          value={newOrg.clfId}
                          onChange={(e) =>
                            setNewOrg({ ...newOrg, clfId: e.target.value })
                          }
                          placeholder={`Enter CLF ID ${
                            newOrg.type === "VO" ? "(required)" : "(optional)"
                          }`}
                          className={
                            clfIdError ? "border-red-500 flex-1" : "flex-1"
                          }
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={searchCLFById}
                          disabled={!newOrg.clfId.trim()}
                        >
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                      {clfIdError && (
                        <p className="text-sm text-red-500 mt-1">
                          {clfIdError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-end space-x-2 ">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOrgOpen(false);
                  setNewOrg({
                    name: "",
                    type: "SHG",
                    block: "",
                    district: "",
                    voId: "",
                    clfId: "",
                  });
                  setVoIdError("");
                  setClfIdError("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={createOrganization}
                disabled={isLoading || !newOrg.name || !newOrg.type}
              >
                {isLoading ? "Creating..." : "Create Organization"}
              </Button>
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
      <Dialog
        open={isAddProductOpen}
        onOpenChange={(open) => {
          setIsAddProductOpen(open);
          if (!open) {
            // Reset form when dialog closes
            setNewProduct({
              name: "",
              shgId: "",
              category: "",
              price: "",
              quantity: "",
              description: "",
              imageUrl: "",
            });
            setShgSearchId("");
            setFoundSHG(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Upload a new product for an SHG
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Product Image Upload */}
            <div>
              <Label htmlFor="product-image">Product Image</Label>
              <Input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
              {newProduct.imageUrl && (
                <div className="mt-2">
                  <img
                    src={newProduct.imageUrl}
                    alt="Product preview"
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

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

            {/* SHG Search by ID */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium">Or Search SHG by ID</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  placeholder="Enter SHG ID"
                  value={shgSearchId}
                  onChange={(e) => setShgSearchId(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={searchSHGById}
                  disabled={isSearchingSHG || !shgSearchId.trim()}
                >
                  {isSearchingSHG ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {foundSHG && foundSHG.name && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    Found: <span className="font-medium">{foundSHG.name}</span>
                    {foundSHG.district && ` - ${foundSHG.district}`}
                  </p>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="product-category">Category</Label>
              <Select
                value={newProduct.category}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                onClick={() => {
                  setIsAddProductOpen(false);
                  setNewProduct({
                    name: "",
                    shgId: "",
                    category: "",
                    price: "",
                    quantity: "",
                    description: "",
                    imageUrl: "",
                  });
                  setShgSearchId("");
                  setFoundSHG(null);
                }}
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
                      autoFocus
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

      {/* View Organization Details Dialog */}
      <Dialog open={isViewOrgOpen} onOpenChange={setIsViewOrgOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Organization Details</DialogTitle>
            <DialogDescription>
              Detailed information about {viewingOrg?.name}
            </DialogDescription>
          </DialogHeader>
          {viewingOrg && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Organization Name
                  </Label>
                  <p className="text-lg font-semibold">{viewingOrg.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Organization ID
                  </Label>
                  <p className="text-lg">{viewingOrg.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Type
                  </Label>
                  <Badge variant="outline" className="text-sm">
                    {viewingOrg.type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Total Members
                  </Label>
                  <p className="text-lg font-semibold">{orgMembers.length}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    District
                  </Label>
                  <p className="text-lg">{viewingOrg.district || "N/A"}</p>
                </div>
                {viewingOrg.block && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Block
                    </Label>
                    <p className="text-lg">{viewingOrg.block}</p>
                  </div>
                )}
              </div>

              {/* Parent Organization Information */}
              {(viewingOrg.type === "SHG" || viewingOrg.type === "VO") &&
                viewingOrg.clfId && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">
                      Parent Organizations
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          CLF Name
                        </Label>
                        <p className="text-lg">
                          {organizations.find(
                            (org) => org.id === viewingOrg.clfId
                          )?.name || "Loading..."}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">
                          CLF ID
                        </Label>
                        <p className="text-lg">{viewingOrg.clfId}</p>
                      </div>
                    </div>
                  </div>
                )}

              {viewingOrg.type === "SHG" && viewingOrg.voId && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      VO Name
                    </Label>
                    <p className="text-lg">
                      {organizations.find((org) => org.id === viewingOrg.voId)
                        ?.name || "Loading..."}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      VO ID
                    </Label>
                    <p className="text-lg">{viewingOrg.voId}</p>
                  </div>
                </div>
              )}

              {/* Members Table */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Members</h3>
                {loadingOrgDetails ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading members...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orgMembers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-8 text-gray-500"
                          >
                            No members found for this organization
                          </TableCell>
                        </TableRow>
                      ) : (
                        orgMembers.map((member, index) => (
                          <TableRow key={member.userId || index}>
                            <TableCell className="font-medium">
                              {member.userId || `Member-${index + 1}`}
                            </TableCell>
                            <TableCell>{member.name || "N/A"}</TableCell>
                            <TableCell>{member.phone || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant="outline">Active</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewOrgOpen(false);
                    setViewingOrg(null);
                    setOrgMembers([]);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Product Details Dialog */}
      <Dialog open={isViewProductOpen} onOpenChange={setIsViewProductOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Image and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Product Image
                  </Label>
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg border mt-2"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg border flex items-center justify-center mt-2">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Product Name
                    </Label>
                    <p className="text-xl font-semibold">
                      {selectedProduct.name}
                    </p>
                  </div>
                  <div className="space-x-3">
                    <Badge variant="outline" className="text-sm">
                      {selectedProduct.category?.toUpperCase() || "N/A"}
                    </Badge>
                    <Badge
                      variant={
                        selectedProduct.status === "APPROVED"
                          ? "default"
                          : selectedProduct.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-sm"
                    >
                      {selectedProduct.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Product Type
                    </Label>
                    <p className="text-lg">
                      {selectedProduct.type?.toUpperCase() || "N/A"}
                    </p>
                  </div>
                  <div className="space-x-3">
                    <Label className="text-sm font-medium text-gray-600">
                      Description
                    </Label>
                    <p className="text-sm text-gray-700">
                      {selectedProduct.description || "No description provided"}
                    </p>
                  </div>
                  <div className="space-x-3">
                    <Label className="text-sm font-medium text-gray-600">
                      Remarks (If any)
                    </Label>
                    <p className="text-sm text-gray-700">
                      {selectedProduct.remarks || "No remarks provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Price
                  </Label>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{(selectedProduct.price / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Stock Quantity
                  </Label>
                  <p className="text-xl font-semibold">
                    {selectedProduct.quantity}
                  </p>
                </div>
              </div>

              {/* SHG Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">SHG Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      SHG Name
                    </Label>
                    <p className="text-lg">{selectedProduct.shgName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      SHG Group ID
                    </Label>
                    <p className="text-lg">{selectedProduct.shgId}</p>
                  </div>
                </div>
              </div>

              {/* Member Information (if individual product) */}
              {selectedProduct.userName !== "N/A" && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Member Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Member Name
                      </Label>
                      <p className="text-lg">{selectedProduct.userName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Member ID
                      </Label>
                      <p className="text-lg">{selectedProduct.userId}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewProductOpen(false);
                    setSelectedProduct(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information (Name, Description, Type only)
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              {/* Product Image Upload */}
              <div>
                <Label htmlFor="edit-product-image">
                  Product Image (Optional)
                </Label>
                <Input
                  id="edit-product-image"
                  type="file"
                  accept="image/*"
                  className="mt-1"
                />
                {selectedProduct.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={selectedProduct.imageUrl}
                      alt="Current product image"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                    <p className="text-sm text-gray-500 mt-1">Current image</p>
                  </div>
                )}
              </div>

              {/* Editable Fields */}
              <div>
                <Label htmlFor="edit-product-name">Product Name *</Label>
                <Input
                  id="edit-product-name"
                  value={selectedProduct.name}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="edit-product-description">Description *</Label>
                <Textarea
                  id="edit-product-description"
                  value={selectedProduct.description}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="edit-product-type">Product Type *</Label>
                <Select
                  value={selectedProduct.type || ""}
                  onValueChange={(value) =>
                    setSelectedProduct({ ...selectedProduct, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="nfc">NFC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Read-only fields for context */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Read-only Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-gray-500">Price</Label>
                    <p>₹{(selectedProduct.price / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Stock</Label>
                    <p>{selectedProduct.quantity}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">SHG</Label>
                    <p>{selectedProduct.shgName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Category</Label>
                    <p>
                      {selectedProduct.category.charAt(0).toUpperCase() +
                        selectedProduct.category.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditProductOpen(false);
                    setSelectedProduct(null);
                  }}
                  disabled={isUpdatingProduct}
                >
                  Cancel
                </Button>
                <Button
                  onClick={updateProduct}
                  disabled={
                    isUpdatingProduct ||
                    !selectedProduct.name.trim() ||
                    !selectedProduct.description.trim()
                  }
                >
                  {isUpdatingProduct ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
