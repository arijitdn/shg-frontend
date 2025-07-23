interface InventoryItem {
  category: string;
  value: number;
  items: number;
  growth: number;
}

interface InventoryCardsProps {
  inventory: InventoryItem[];
}

export default function InventoryCards({ inventory }: InventoryCardsProps) {
  const maxValue = Math.max(...inventory.map((item) => item.value));

  return (
    <div className="p-5 rounded-md border border-solid bg-stone-50 border-zinc-300">
      <h3 className="mb-5 text-base text-neutral-500">
        Inventory Distribution by Category
      </h3>
      <div className="flex flex-col gap-4">
        {inventory?.map((item, index) => (
          <div
            className="relative p-4 bg-white rounded border border-solid border-zinc-300"
            key={index}
          >
            <div className="flex justify-between items-center mb-2.5">
              <div className="text-sm font-[bold] text-neutral-500">
                {item.category}
              </div>
              <div className="text-xs text-green-600 font-[bold]">
                <span>+</span>
                <span>{item.growth}</span>
                <span>%</span>
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-neutral-500">Value:</span>
              <span className="text-xs text-blue-400 font-[bold]">
                <span>₹</span>
                <span>{item.value.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex justify-between mb-2.5">
              <span className="text-xs text-neutral-500">Items:</span>
              <span className="text-xs font-[bold] text-neutral-500">
                {item.items}
              </span>
            </div>
            <div className="overflow-hidden h-2 rounded bg-zinc-300">
              <div
                className="h-full rounded transition-[width]"
                style={{
                  backgroundColor:
                    index === 0
                      ? "rgb(91, 192, 222)"
                      : index === 1
                      ? "rgb(40, 167, 69)"
                      : index === 2
                      ? "rgb(255, 193, 7)"
                      : index === 3
                      ? "rgb(220, 53, 69)"
                      : "rgb(108, 117, 125)",
                  width: `${(item.value / maxValue) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
