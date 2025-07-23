interface SalesData {
  month: string;
  sales: number;
  orders: number;
  avgOrder: number;
}

interface SalesChartProps {
  salesData: SalesData[];
}

export default function SalesChart({ salesData }: SalesChartProps) {
  return (
    <div className="p-5 rounded-md border border-solid bg-stone-50 border-zinc-300">
      <h3 className="mb-5 text-base text-neutral-500">
        Monthly Sales Trend (Last 8 Months)
      </h3>
      <div className="flex relative gap-2 items-end px-0 py-5 h-[220px]">
        <div className="absolute top-0 left-0 bottom-10 w-px bg-zinc-300" />
        <div className="absolute inset-x-0 bottom-10 h-px bg-zinc-300" />
        {salesData?.map((data, index) => (
          <div
            className="flex relative flex-col flex-1 items-center"
            key={index}
          >
            <div className="mb-1.5 text-xs font-[bold] text-neutral-500">
              <span>₹</span>
              <span>{(data.sales / 1000).toFixed(0)}</span>
              <span>K</span>
            </div>
            <div
              className="relative mb-2 w-6 rounded-lg transition-all   min-h-5"
              style={{
                backgroundColor:
                  index === salesData.length - 1
                    ? "rgb(40, 167, 69)"
                    : "rgb(91, 192, 222)",
                height: `${(data.sales / 65000) * 150}px`,
              }}
            />
            <div className="mb-0.5 text-xs font-[bold] text-neutral-500">
              {data.month}
            </div>
            <div className="text-xs text-neutral-500">
              <span>{data.orders}</span>
              <span> orders</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
