import { useEffect, useState } from "react";
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
import apiClient from "../lib/api";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  type: string;
  isRecommended?: boolean;
  isApproved?: boolean;
  isRejected?: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  imageUrl: string;
  shgId: string;
  userId: string;
  remarks?: string;
}

export default function CLFApprovalPage() {
  const [voProducts, setVoProducts] = useState<Product[]>([]);
  const [nfcProducts, setNfcProducts] = useState<Product[]>([]);
  const [_selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [_approvalDialog, setApprovalDialog] = useState(false);
  const [_rejectionDialog, setRejectionDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProducts = async () => {
    const { data } = await apiClient.get<Product[]>("/products");
    setVoProducts(
      data.filter(
        (p: Product) => p.isRecommended && !p.isApproved && !p.isRejected
      )
    );

    setNfcProducts(
      data.filter(
        (p: Product) => p.type === "nfc" && !p.isApproved && !p.isRejected
      )
    );

    setPendingCount(
      data.length -
        data.filter((p: Product) => p.isApproved || p.isRejected).length
    );

    setTotalPrice(
      [
        ...data.filter(
          (p: Product) => p.isRecommended && !p.isApproved && !p.isRejected
        ),
        ...data.filter(
          (p: Product) => p.type === "nfc" && !p.isApproved && !p.isRejected
        ),
      ].reduce((sum, p) => sum + (p.price / 100) * p.stock, 0)
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   if (statusFilter === "all") {
  //     fetchProducts();
  //   } else {
  //     const filteredVoProducts = voProducts.filter(
  //       (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
  //     );
  //     const filteredNfcProducts = nfcProducts.filter(
  //       (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
  //     );
  //     setVoProducts(filteredVoProducts);
  //     setNfcProducts(filteredNfcProducts);
  //   }
  // }, [statusFilter, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RECOMMENDED":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            Recommended
          </Badge>
        );

      case "PENDING":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );

      case "APPROVED":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "REJECTED":
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

  const handleApproval = async (
    productId: string,
    approved: boolean,
    remarks: string
  ) => {
    if (!approved) {
      if (!remarks.trim()) {
        alert("Please provide a reason for rejection.");
        return;
      }

      await apiClient.patch(`/products/reject/${productId}`, {
        reject: true,
        rejectedBy: "CLF",
        remarks: remarks.trim() || undefined,
      });
      setApprovalDialog(false);
      setRejectionDialog(false);
      setSelectedProduct(null);
      window.location.reload();
      return;
    }

    await apiClient.patch(`/products/approve/${productId}`, {
      approve: true,
      remarks: remarks.trim() || undefined,
    });
    setApprovalDialog(false);
    setRejectionDialog(false);
    setSelectedProduct(null);
    window.location.reload();
  };

  const ProductDetailsDialog = ({
    product,
    type,
  }: {
    product: Product;
    type: "vo" | "nfc";
  }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Details - {product.name}
          </DialogTitle>
          <DialogDescription>
            {type === "vo" ? "VO Recommended Product" : "NFC Product from SHG"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <img
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Product Name
                </Label>
                <p className="font-semibold">{product.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Category
                </Label>
                <p className="font-semibold">
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Submitted Date
                </Label>
                <p className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(product.createdAt).toLocaleDateString()}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                {type === "vo" ? "Individual Name" : "SHG Name"}
              </Label>
              <p className="font-semibold">
                {type === "vo" ? "Mock User" : product.shgId}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                VO Name
              </Label>
              <p>Mock VO</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                District
              </Label>
              <p className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                West Tripura
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Block</Label>
              <p>Mock Block</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Quantity
              </Label>
              <p className="font-semibold">{product.stock}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Price per Unit
              </Label>
              <p className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {product.price / 100}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Total Value
              </Label>
              <p className="flex items-center gap-1 font-semibold text-green-600">
                <IndianRupee className="w-4 h-4" />
                {(product.price / 100) * product.stock}
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

          <div>
            <Label className="text-sm font-medium text-gray-600">
              Current Remarks
            </Label>
            <p className="text-sm bg-gray-50 p-3 rounded-md">
              {product.remarks || "No remarks provided"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ApprovalActions = ({
    product,
    type,
  }: {
    product: Product;
    type: "vo" | "nfc";
  }) => {
    const [localRemarks, setLocalRemarks] = useState("");
    const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);

    const handleApprove = () => {
      handleApproval(product.id, true, localRemarks);
      setIsApprovalDialogOpen(false);
      setLocalRemarks("");
    };

    const handleReject = () => {
      if (localRemarks.trim()) {
        handleApproval(product.id, false, localRemarks);
        setIsRejectionDialogOpen(false);
        setLocalRemarks("");
      }
    };

    return (
      <div className="flex gap-2">
        <ProductDetailsDialog product={product} type={type} />

        {/* Approve Dialog */}
        <Dialog
          open={isApprovalDialogOpen}
          onOpenChange={setIsApprovalDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setLocalRemarks("");
                setIsApprovalDialogOpen(true);
              }}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve "{product.name}"?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="approval-remarks">Approval Remarks</Label>
                <Textarea
                  id="approval-remarks"
                  placeholder="Enter remarks (optional)"
                  value={localRemarks}
                  onChange={(e) => setLocalRemarks(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsApprovalDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
              >
                Confirm Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog
          open={isRejectionDialogOpen}
          onOpenChange={setIsRejectionDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setLocalRemarks("");
                setIsRejectionDialogOpen(true);
              }}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Product</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting "{product.name}".
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="rejection-remarks">Rejection Reason *</Label>
              <Textarea
                id="rejection-remarks"
                placeholder="Enter reason for rejection"
                value={localRemarks}
                onChange={(e) => setLocalRemarks(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRejectionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!localRemarks.trim()}
                onClick={handleReject}
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

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
            {pendingCount} Pending
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
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingCount}
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
                  {totalPrice}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                    <TableHead>Individual</TableHead>
                    {/* <TableHead>VO & Location</TableHead> */}
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
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            {product.category.charAt(0).toUpperCase() +
                              product.category.slice(1)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {product.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          Mock User (SHG: {product.shgId})
                        </p>
                      </TableCell>
                      {/* <TableCell>
                        <div>
                          <p className="font-medium">{product.voName}</p>
                          <p className="text-sm text-gray-600">
                            {product.district}, {product.block}
                          </p>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div>
                          <p className="font-semibold">{product.stock}</p>
                          <p className="text-sm text-green-600 flex items-center">
                            <IndianRupee className="w-3 h-3" />
                            {product.price / 100}
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
                    {/* <TableHead>VO & Location</TableHead> */}
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
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            {product.category.charAt(0).toUpperCase() +
                              product.category.slice(1)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {product.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{product.shgId}</p>
                      </TableCell>
                      {/* <TableCell>
                        <div>
                          <p className="font-medium">{product.voName}</p>
                          <p className="text-sm text-gray-600">
                            {product.district}, {product.block}
                          </p>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div>
                          <p className="font-semibold">{product.stock}</p>
                          <p className="text-sm text-green-600 flex items-center">
                            <IndianRupee className="w-3 h-3" />
                            {product.price / 100}
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
    </div>
  );
}
