import { useEffect, useState } from "react";
import { Plus, Search, Edit, Eye, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";
import apiClient from "../lib/api";
import { productCategories } from "../lib/categories";
import { useLocation, useNavigate } from "react-router-dom";

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
}

export default function SHGProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    type: "",
    imageUrl: "",
  });

  async function fetchProducts() {
    const products = await apiClient.get("/products");
    setProducts(products.data);
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateProduct = async () => {
    const formData = new FormData();

    const fileInput = document.getElementById("img") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      toast({
        title: "Image is missing",
        description: "Please select an image before submitting.",
        variant: "destructive",
      });
      return;
    }

    formData.append("image", file);

    formData.append("name", newProduct.name);
    formData.append("category", newProduct.category);
    formData.append("description", newProduct.description);
    formData.append(
      "price",
      Math.round(parseFloat(newProduct.price) * 100).toString()
    );
    formData.append("stock", newProduct.stock);
    formData.append("type", newProduct.type.toLowerCase());
    formData.append("userId", "user01");
    formData.append("shgId", "shg01");

    try {
      await apiClient.post("/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(location.pathname, { replace: true });

      toast({
        title: "Product Created",
        description: "Your product has been created successfully.",
      });

      setNewProduct({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        type: "",
        imageUrl: "",
      });
      setIsCreateDialogOpen(false);
      fetchProducts();
    } catch (error) {
      navigate(location.pathname, { replace: true });
      toast({
        title: "Error",
        description: "Failed to upload product to server.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 10;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      toast({
        title: "Image too large",
        description: `Please upload an image smaller than ${MAX_SIZE_MB} MB.`,
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setNewProduct((prev) => ({
        ...prev,
        imageUrl: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) return;

    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id ? selectedProduct : product
    );
    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    toast({
      title: "Product Updated",
      description: "Product details have been updated successfully.",
    });
  };

  const stats = {
    total: products.length,
    approved: products.filter((p) => p.isApproved).length,
    recommended: products.filter((p) => p.isRecommended).length,
    rejected: products.filter((p) => p.isRejected).length,
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SHG Product Management</h1>
          <p className="text-muted-foreground">
            Manage your Self Help Group products and marketplace listings
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your SHG inventory
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="img">Product Image</Label>
                <Input
                  id="img"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {newProduct.imageUrl && (
                  <img
                    src={newProduct.imageUrl}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-md mt-2 border"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your product"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shgType">Product Type</Label>
                  <Select
                    value={newProduct.type}
                    onValueChange={(value) =>
                      setNewProduct({ ...newProduct, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="nfc">NFC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateProduct}>Create Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.recommended}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your SHG products and their marketplace status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or SHG names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="RECOMMENDED">Recommended</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {productCategories.map((categories) => (
                  <SelectItem key={categories.value} value={categories.value}>
                    {categories.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>SHG Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.imageUrl ||
                            "/placeholder.svg?height=200&width=200"
                          }
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category.charAt(0).toUpperCase() +
                        product.category.slice(1)}
                    </TableCell>
                    <TableCell>{product.type.toUpperCase()}</TableCell>
                    <TableCell>₹{product.price / 100}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status.charAt(0).toUpperCase() +
                          product.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(
                        product.createdAt.toString()
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{product.name}</DialogTitle>
                              <DialogDescription>
                                Product details
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <img
                                    src={product.imageUrl || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Price
                                    </Label>
                                    <p className="text-2xl font-bold">
                                      ₹{product.price / 100}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Category
                                    </Label>
                                    <p>
                                      {product.category
                                        .charAt(0)
                                        .toUpperCase() +
                                        product.category.slice(1)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Status
                                    </Label>
                                    <div className="mt-1">
                                      {product.status.charAt(0).toUpperCase() +
                                        product.status.slice(1).toLowerCase()}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">
                                  Description
                                </Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {product.description}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">
                                    SHG Information
                                  </Label>
                                  <div className="mt-2 space-y-1">
                                    <p className="text-sm">
                                      <strong>Name:</strong> Mock SHG
                                    </p>
                                    <p className="text-sm">
                                      <strong>ID:</strong> {product.shgId}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Member Information
                                  </Label>
                                  <div className="mt-2 space-y-1">
                                    <p className="text-sm">
                                      <strong>Name:</strong> Mock User
                                    </p>
                                    <p className="text-sm">
                                      <strong>ID:</strong> {product.userId}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">
                                  Product Specifications
                                </Label>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  Mock Data
                                </div>
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
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product details and information
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="img">Product Image</Label>
                <Input
                  id="edit-img"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const MAX_SIZE_MB = 10;
                    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

                    if (file.size > MAX_SIZE_BYTES) {
                      toast({
                        title: "Image too large",
                        description: `Please upload an image smaller than ${MAX_SIZE_MB} MB.`,
                        variant: "destructive",
                      });
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      setSelectedProduct((prev) =>
                        prev
                          ? { ...prev, imageUrl: ev.target?.result as string }
                          : prev
                      );
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {selectedProduct.imageUrl && (
                  <img
                    src={selectedProduct.imageUrl}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-md mt-2 border"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedProduct.name}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={selectedProduct.category}
                    onValueChange={(value) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedProduct.description}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={selectedProduct.price / 100}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        price: Math.round(
                          Number.parseFloat(e.target.value) * 100
                        ),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock Quantity</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        stock: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-productType">Product Type</Label>
                  <Input
                    id="edit-productType"
                    disabled
                    value={selectedProduct.type.toUpperCase()}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>Update Product</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
