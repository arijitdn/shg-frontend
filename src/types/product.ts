export default interface Product {
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
  userName?: string;
  shgName?: string;
  voName?: string;
  clfName?: string;
}
