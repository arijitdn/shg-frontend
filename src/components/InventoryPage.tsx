import React, { useState } from "react";
import HeaderSection from "./HeaderSection";
import NavigationTabs from "./NavigationTabs";
import Footer from "./Footer";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  shg: string;
}

interface InventoryPageProps {
  adminData: {
    products: Product[];
  };
  isLoggedIn: boolean;
  userRole: string | null;
  onLogout?: () => void;
  onShowLogin?: () => void;
}

export default function InventoryPage({
  adminData,
  isLoggedIn,
  userRole,
  onLogout,
  onShowLogin,
}: InventoryPageProps) {
  const [productCategory, setProductCategory] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const filteredProducts = adminData.products.filter((product) => {
    const matchesCategory = productCategory
      ? product.category === productCategory
      : true;
    const matchesSearch = productSearch
      ? product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.shg.toLowerCase().includes(productSearch.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <HeaderSection />
      <NavigationTabs
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogout={onLogout}
        onShowLogin={onShowLogin}
      />
      <main className="p-5 mx-4 my-5 bg-white rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
        <h2 className="text-2xl font-bold mb-6 text-neutral-700">Inventory</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <select
            className="p-2 border border-zinc-300 rounded text-sm"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(adminData.products.map((p) => p.category))].map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
          <input
            className="p-2 border border-zinc-300 rounded text-sm flex-1"
            type="text"
            placeholder="Search by product or SHG name..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
        </div>
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-neutral-400">
              No products found.
            </div>
          )}
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-zinc-200 rounded-lg shadow hover:shadow-lg transition-shadow bg-white flex flex-col"
            >
              <div className="h-40 bg-stone-100 flex items-center justify-center rounded-t-lg">
                {/* Placeholder for product image */}
                <span className="text-5xl text-zinc-300">📦</span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-bold text-lg mb-1 text-neutral-700">
                  {product.name}
                </div>
                <div className="text-xs text-neutral-500 mb-2">
                  {product.category}
                </div>
                <div className="text-sm text-blue-500 font-bold mb-2">
                  ₹{product.price}
                </div>
                <div className="text-xs text-neutral-500 mb-1">
                  Stock: {product.stock}
                </div>
                <div className="text-xs text-neutral-500 mb-2">
                  SHG: {product.shg}
                </div>
                <button className="mt-auto px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-sm font-semibold">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
