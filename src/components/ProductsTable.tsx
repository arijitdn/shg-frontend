import React from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  shg: string;
}

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-neutral-500">Products Inventory</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-solid border-collapse border-zinc-300">
          <thead>
            <tr className="bg-stone-50">
              <th className="p-2 text-sm text-left border border-solid border-zinc-300 text-neutral-500">
                Product Name
              </th>
              <th className="p-2 text-sm text-left border border-solid border-zinc-300 text-neutral-500">
                Category
              </th>
              <th className="p-2 text-sm text-left border border-solid border-zinc-300 text-neutral-500">
                Price (₹)
              </th>
              <th className="p-2 text-sm text-left border border-solid border-zinc-300 text-neutral-500">
                Stock
              </th>
              <th className="p-2 text-sm text-left border border-solid border-zinc-300 text-neutral-500">
                SHG
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <tr
                key={product.id}
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? "rgb(255, 255, 255)"
                      : "rgb(249, 249, 249)",
                }}
              >
                <td className="p-2 text-sm border border-solid border-zinc-300">
                  {product.name}
                </td>
                <td className="p-2 text-sm border border-solid border-zinc-300">
                  {product.category}
                </td>
                <td className="p-2 text-sm border border-solid border-zinc-300">
                  {product.price}
                </td>
                <td className="p-2 text-sm border border-solid border-zinc-300">
                  {product.stock}
                </td>
                <td className="p-2 text-sm border border-solid border-zinc-300">
                  {product.shg}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
