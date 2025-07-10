import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
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
import { Textarea } from "../components/ui/textarea";
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
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Users,
  Package,
  Calendar,
  MapPin,
  IndianRupee,
} from "lucide-react";

// Mock data for VO recommended products
const voProducts = [
  {
    id: "VO001",
    productName: "Organic Rice",
    farmerName: "Rajesh Kumar",
    voName: "Sunrise Village Organization",
    district: "Patna",
    block: "Danapur",
    quantity: "500 kg",
    pricePerUnit: 45,
    totalValue: 22500,
    category: "Grains",
    submittedDate: "2024-01-15",
    status: "pending",
    description:
      "Premium quality organic basmati rice grown without pesticides",
  },
  {
    id: "VO002",
    productName: "Fresh Vegetables",
    farmerName: "Sunita Devi",
    voName: "Green Valley VO",
    district: "Gaya",
    block: "Bodh Gaya",
    quantity: "200 kg",
    pricePerUnit: 25,
    totalValue: 5000,
    category: "Vegetables",
    submittedDate: "2024-01-14",
    status: "pending",
    description:
      "Mixed seasonal vegetables including tomatoes, onions, and potatoes",
  },
];

// Mock data for NFC products from SHGs
const nfcProducts = [
  {
    id: "NFC001",
    productName: "Handwoven Sarees",
    shgName: "Mahila Shakti SHG",
    voName: "Craft Village Organization",
    district: "Madhubani",
    block: "Jainagar",
    quantity: "50 pieces",
    pricePerUnit: 1200,
    totalValue: 60000,
    category: "Handicrafts",
    submittedDate: "2024-01-16",
    status: "pending",
    description:
      "Traditional Madhubani art handwoven sarees made by women artisans",
  },
  {
    id: "NFC002",
    productName: "Bamboo Baskets",
    shgName: "Eco Craft SHG",
    voName: "Rural Artisan VO",
    district: "Darbhanga",
    block: "Keoti",
    quantity: "100 pieces",
    pricePerUnit: 150,
    totalValue: 15000,
    category: "Handicrafts",
    submittedDate: "2024-01-13",
    status: "pending",
    description: "Eco-friendly bamboo baskets for storage and decoration",
  },
];

export default function CLFApprovalPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [remarks, setRemarks] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleApproval = (productId: string, approved: boolean) => {
    console.log(
      `${
        approved ? "Approved" : "Rejected"
      } product ${productId} with remarks: ${remarks}`
    );
    setApprovalDialog(false);
    setRejectionDialog(false);
    setRemarks("");
    setSelectedProduct(null);
  };

  const ProductDetailsDialog = ({
    product,
    type,
  }: {
    product: any;
    type: "vo" | "nfc";
  }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Details - {product.productName}
          </DialogTitle>
          <DialogDescription>
            {type === "vo" ? "VO Recommended Product" : "NFC Product from SHG"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Product Name
              </Label>
              <p className="font-semibold">{product.productName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Category
              </Label>
              <p>{product.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                {type === "vo" ? "Farmer Name" : "SHG Name"}
              </Label>
              <p className="font-semibold">
                {type === "vo" ? product.farmerName : product.shgName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                VO Name
              </Label>
              <p>{product.voName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                District
              </Label>
              <p className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {product.district}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Block</Label>
              <p>{product.block}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Quantity
              </Label>
              <p className="font-semibold">{product.quantity}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Price per Unit
              </Label>
              <p className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {product.pricePerUnit}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Total Value
              </Label>
              <p className="flex items-center gap-1 font-semibold text-green-600">
                <IndianRupee className="w-4 h-4" />
                {product.totalValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">
              Description
            </Label>
            <p className="text-sm bg-gray-50 p-3 rounded-md">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Submitted Date
              </Label>
              <p className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(product.submittedDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Status
              </Label>
              <div>{getStatusBadge(product.status)}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ApprovalActions = ({
    product,
    type,
  }: {
    product: any;
    type: "vo" | "nfc";
  }) => (
    <div className="flex gap-2">
      <ProductDetailsDialog product={product} type={type} />

      <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setSelectedProduct(product)}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Approve
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve "{selectedProduct?.productName}"?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="approval-remarks">Approval Remarks</Label>
              <Textarea
                id="approval-remarks"
                placeholder="Enter approval remarks (optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleApproval(selectedProduct?.id, true)}
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectionDialog} onOpenChange={setRejectionDialog}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setSelectedProduct(product)}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "
              {selectedProduct?.productName}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="rejection-remarks">Rejection Reason *</Label>
              <Textarea
                id="rejection-remarks"
                placeholder="Enter reason for rejection"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleApproval(selectedProduct?.id, false)}
              disabled={!remarks.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            CLF Product Approval
          </h1>
          <p className="text-gray-600 mt-1">
            Review and approve products recommended by VOs and NFC products from
            SHGs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="w-4 h-4 mr-1" />
            {voProducts.filter((p) => p.status === "pending").length +
              nfcProducts.filter((p) => p.status === "pending").length}{" "}
            Pending
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by product name, farmer/SHG name, or VO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for VO and NFC Products */}
      <Tabs defaultValue="vo-products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vo-products" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            VO Recommended Products ({voProducts.length})
          </TabsTrigger>
          <TabsTrigger value="nfc-products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            NFC Products from SHGs ({nfcProducts.length})
          </TabsTrigger>
        </TabsList>

        {/* VO Products Tab */}
        <TabsContent value="vo-products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                VO Recommended Individual Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Details</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>VO & Location</TableHead>
                    <TableHead>Quantity & Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{product.productName}</p>
                          <p className="text-sm text-gray-600">
                            {product.category}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {product.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{product.farmerName}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.voName}</p>
                          <p className="text-sm text-gray-600">
                            {product.district}, {product.block}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{product.quantity}</p>
                          <p className="text-sm text-green-600 flex items-center">
                            <IndianRupee className="w-3 h-3" />
                            {product.totalValue.toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <ApprovalActions product={product} type="vo" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NFC Products Tab */}
        <TabsContent value="nfc-products">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                NFC Products from SHGs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Details</TableHead>
                    <TableHead>SHG</TableHead>
                    <TableHead>VO & Location</TableHead>
                    <TableHead>Quantity & Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nfcProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{product.productName}</p>
                          <p className="text-sm text-gray-600">
                            {product.category}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {product.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{product.shgName}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.voName}</p>
                          <p className="text-sm text-gray-600">
                            {product.district}, {product.block}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{product.quantity}</p>
                          <p className="text-sm text-green-600 flex items-center">
                            <IndianRupee className="w-3 h-3" />
                            {product.totalValue.toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <ApprovalActions product={product} type="nfc" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {voProducts.filter((p) => p.status === "pending").length +
                    nfcProducts.filter((p) => p.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">VO Products</p>
                <p className="text-2xl font-bold text-blue-600">
                  {voProducts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">NFC Products</p>
                <p className="text-2xl font-bold text-purple-600">
                  {nfcProducts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {(
                    voProducts.reduce((sum, p) => sum + p.totalValue, 0) +
                    nfcProducts.reduce((sum, p) => sum + p.totalValue, 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
