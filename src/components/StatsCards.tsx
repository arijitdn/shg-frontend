import React from "react";

interface StatsCardsProps {
  adminData: any;
}

export default function StatsCards({ adminData }: StatsCardsProps) {
  return (
    <div className="grid gap-5 mb-8 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] max-sm:grid-cols-[1fr]">
      <div className="p-5 text-center rounded-md border border-solid bg-stone-50 border-zinc-300">
        <h3 className="mx-0 mt-0 mb-2.5 text-blue-400">Total Products</h3>
        <div className="text-3xl font-[bold] text-neutral-500">
          {adminData.products.length}
        </div>
      </div>
      <div className="p-5 text-center rounded-md border border-solid bg-stone-50 border-zinc-300">
        <h3 className="mx-0 mt-0 mb-2.5 text-blue-400">Monthly Sales</h3>
        <div className="text-3xl font-[bold] text-neutral-500">
          <span>₹</span>
          <span>
            {adminData.salesData[
              adminData.salesData.length - 1
            ]?.sales.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="p-5 text-center rounded-md border border-solid bg-stone-50 border-zinc-300">
        <h3 className="mx-0 mt-0 mb-2.5 text-blue-400">Inventory Value</h3>
        <div className="text-3xl font-[bold] text-neutral-500">
          <span>₹</span>
          <span>
            {adminData.inventory
              .reduce((sum: number, item: any) => sum + item.value, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
