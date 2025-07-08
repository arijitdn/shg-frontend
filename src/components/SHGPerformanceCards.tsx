import React from "react";

interface SHGPerformance {
  name: string;
  sales: number;
  members: number;
  avgPerMember: number;
}

interface SHGPerformanceCardsProps {
  shgPerformance: SHGPerformance[];
}

export default function SHGPerformanceCards({
  shgPerformance,
}: SHGPerformanceCardsProps) {
  return (
    <div className="p-5 mb-8 rounded-md border border-solid bg-stone-50 border-zinc-300">
      <h3 className="mb-5 text-base text-neutral-500">
        SHG Performance Analysis
      </h3>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] max-sm:grid-cols-[1fr]">
        {shgPerformance?.map((shg, index) => (
          <div
            className="relative p-4 bg-white rounded border border-solid border-zinc-300"
            key={index}
          >
            <div className="mb-2.5 text-sm font-[bold] text-neutral-500">
              {shg.name}
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-neutral-500">Total Sales:</span>
              <span className="text-xs text-blue-400 font-[bold]">
                <span>₹</span>
                <span>{shg.sales.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-neutral-500">Members:</span>
              <span className="text-xs font-[bold] text-neutral-500">
                {shg.members}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-neutral-500">Avg per Member:</span>
              <span className="text-xs text-green-600 font-[bold]">
                <span>₹</span>
                <span>{shg.avgPerMember.toLocaleString()}</span>
              </span>
            </div>
            <div
              className="absolute bottom-0 left-0 bg-blue-400 rounded-none h-[3px]"
              style={{
                width: `${(shg.sales / 100000) * 100}%`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
