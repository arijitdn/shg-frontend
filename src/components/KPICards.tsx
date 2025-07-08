interface KPICardsProps {
  adminData: any;
}

export default function KPICards({ adminData }: KPICardsProps) {
  const totalOrders = adminData.salesData.reduce(
    (sum: number, month: any) => sum + month.orders,
    0
  );

  const avgOrderValue = Math.round(
    adminData.salesData.reduce(
      (sum: number, month: any) => sum + month.avgOrder,
      0
    ) / adminData.salesData.length
  );

  const avgTargetAchievement = Math.round(
    adminData.monthlyTargets.reduce(
      (sum: number, target: any) => sum + target.percentage,
      0
    ) / adminData.monthlyTargets.length
  );

  return (
    <div className="p-5 rounded-md border border-solid bg-stone-50 border-zinc-300">
      <h3 className="mb-5 text-base text-neutral-500">
        Key Performance Indicators
      </h3>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] max-sm:grid-cols-[1fr]">
        <div className="p-4 text-center bg-white rounded border border-solid border-zinc-300">
          <div className="mb-1.5 text-2xl text-blue-400 font-[bold]">
            {totalOrders}
          </div>
          <div className="text-xs text-neutral-500">Total Orders</div>
        </div>
        <div className="p-4 text-center bg-white rounded border border-solid border-zinc-300">
          <div className="mb-1.5 text-2xl text-green-600 font-[bold]">
            <span>₹</span>
            <span>{avgOrderValue}</span>
          </div>
          <div className="text-xs text-neutral-500">Avg Order Value</div>
        </div>
        <div className="p-4 text-center bg-white rounded border border-solid border-zinc-300">
          <div className="mb-1.5 text-2xl text-yellow-400 font-[bold]">
            {adminData.shgPerformance.length}
          </div>
          <div className="text-xs text-neutral-500">Active SHGs</div>
        </div>
        <div className="p-4 text-center bg-white rounded border border-solid border-zinc-300">
          <div className="mb-1.5 text-2xl text-red-500 font-[bold]">
            <span>{avgTargetAchievement}</span>
            <span>%</span>
          </div>
          <div className="text-xs text-neutral-500">Avg Target Achievement</div>
        </div>
      </div>
    </div>
  );
}
