interface Product {
  id: number;
  name: string;
  sold: number;
  stock: number;
  revenue: number;
}

interface ProductMetricsCardsProps {
  products: Product[];
}

export default function ProductMetricsCards({
  products,
}: ProductMetricsCardsProps) {
  return (
    <div className="p-5 rounded-md border border-solid bg-stone-50 border-zinc-300">
      <h3 className="mb-5 text-base text-neutral-500">
        Product Performance Metrics
      </h3>
      <div className="flex flex-col gap-3">
        {products?.map((product) => (
          <div
            className="p-3 bg-white rounded border border-solid border-zinc-300"
            key={product.id}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-[bold] text-neutral-500">
                {product.name}
              </div>
              <div className="text-xs text-blue-400 font-[bold]">
                <span>₹</span>
                <span>{product.revenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between mb-1.5 text-xs text-neutral-500">
              <span>
                <span>Sold: </span>
                <span>{product.sold}</span>
              </span>
              <span>
                <span>Stock: </span>
                <span>{product.stock}</span>
              </span>
            </div>
            <div className="overflow-hidden h-1.5 rounded bg-zinc-300">
              <div
                className="h-full bg-green-600 rounded"
                style={{
                  width: `${
                    (product.sold / (product.sold + product.stock)) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
