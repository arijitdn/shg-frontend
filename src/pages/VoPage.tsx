import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";

const mockProducts = [
  {
    id: "PRD001",
    name: "Handwoven Cotton Saree",
    description:
      "Traditional handwoven cotton saree with intricate border designs",
    category: "Textiles",
    price: 2500,
    shgName: "Mahila Shakti SHG",
    shgId: "SHG001",
    memberName: "Priya Sharma",
    memberId: "MEM001",
    submittedDate: "2024-01-15",
    status: "pending",
    type: "single",
    images: ["/product-placeholder.png"],
    specifications: {
      material: "100% Cotton",
      dimensions: "6.5m x 1.2m",
      weight: "500g",
      colors: ["Red", "Gold"],
    },
  },
  {
    id: "PRD002",
    name: "Organic Turmeric Powder",
    description: "Pure organic turmeric powder sourced from local farms",
    category: "Food Products",
    price: 150,
    shgName: "Krishi Mahila Mandal",
    shgId: "SHG002",
    memberName: "Sunita Devi",
    memberId: "MEM002",
    submittedDate: "2024-01-14",
    status: "pending",
    type: "single",
    images: ["/product-placeholder.png"],
    specifications: {
      weight: "500g",
      organic: "Yes",
      packaging: "Sealed pouch",
      shelfLife: "24 months",
    },
  },
  {
    id: "PRD003",
    name: "Bamboo Handicraft Set",
    description:
      "Eco-friendly bamboo handicraft items including baskets and decorative pieces",
    category: "Handicrafts",
    price: 800,
    shgName: "Eco Craft Women Group",
    shgId: "SHG003",
    memberName: "Meera Patel",
    memberId: "MEM003",
    submittedDate: "2024-01-13",
    status: "pending",
    type: "single",
    images: ["/product-placeholder.png"],
    specifications: {
      material: "Natural Bamboo",
      items: "3 pieces",
      finish: "Natural lacquer",
      dimensions: "Various sizes",
    },
  },
  {
    id: "PRD004",
    name: "Herbal Soap Collection",
    description: "Natural herbal soaps made with traditional ingredients",
    category: "Personal Care",
    price: 300,
    shgName: "Ayurveda Women Collective",
    shgId: "SHG004",
    memberName: "Kavita Singh",
    memberId: "MEM004",
    submittedDate: "2024-01-12",
    status: "pending",
    type: "single",
    images: ["/product-placeholder.png"],
    specifications: {
      quantity: "4 soaps",
      weight: "100g each",
      ingredients: "Neem, Turmeric, Aloe Vera",
      packaging: "Eco-friendly wrap",
    },
  },
];

export default function VOApprovalPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof mockProducts)[0] | null
  >(null);
  const [recommendation, setRecommendation] = useState("");
  const [isRecommending, setIsRecommending] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const isSingleType = product.type === "single";
    const isPending = product.status === "pending";

    return matchesSearch && matchesCategory && isSingleType && isPending;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  const handleRecommend = async (
    productId: string,
    action: "approve" | "reject"
  ) => {
    setIsRecommending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              status: action === "approve" ? "recommended" : "rejected",
            }
          : product
      )
    );

    setIsRecommending(false);
    setSelectedProduct(null);
    setRecommendation("");
  };

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
      case "recommended":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Recommended
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
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          VO Product Approval
        </h1>
        <p className="text-muted-foreground">
          Review and recommend individual products from SHG members for approval
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SHGs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(products.map((p) => p.shgId)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommended</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter((p) => p.status === "recommended").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, SHG, or member name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                {getStatusBadge(product.status)}
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {product.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">₹{product.price}</div>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">SHG:</span>
                  <span className="font-medium">{product.shgName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member:</span>
                  <span className="font-medium">{product.memberName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span>
                    {new Date(product.submittedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{product.name}</DialogTitle>
                      <DialogDescription>
                        Product details and recommendation
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Price</Label>
                            <p className="text-2xl font-bold">
                              ₹{product.price}
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Category
                            </Label>
                            <p>{product.category}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">
                              Status
                            </Label>
                            <div className="mt-1">
                              {getStatusBadge(product.status)}
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
                              <strong>Name:</strong> {product.shgName}
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
                              <strong>Name:</strong> {product.memberName}
                            </p>
                            <p className="text-sm">
                              <strong>ID:</strong> {product.memberId}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Product Specifications
                        </Label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {Object.entries(product.specifications).map(
                            ([key, value]) => (
                              <div key={key} className="text-sm">
                                <strong className="capitalize">{key}:</strong>{" "}
                                {Array.isArray(value)
                                  ? value.join(", ")
                                  : value}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="recommendation"
                          className="text-sm font-medium"
                        >
                          Recommendation Notes
                        </Label>
                        <Textarea
                          id="recommendation"
                          placeholder="Add your recommendation notes here..."
                          value={recommendation}
                          onChange={(e) => setRecommendation(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleRecommend(product.id, "reject")}
                        disabled={isRecommending}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleRecommend(product.id, "approve")}
                        disabled={isRecommending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isRecommending
                          ? "Processing..."
                          : "Recommend for Approval"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                No single-type products are currently pending approval that
                match your filters.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
