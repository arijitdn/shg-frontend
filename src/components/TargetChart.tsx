import React from "react";

interface MonthlyTarget {
  month: string;
  target: number;
  achieved: number;
  percentage: number;
}

interface TargetChartProps {
  monthlyTargets: MonthlyTarget[];
}

export default function TargetChart({ monthlyTargets }: TargetChartProps) {
  return (
    <div className="p-5 rounded-md border border-solid bg-stone-50 border-zinc-300">
      <h3 className="mb-5 text-base text-neutral-500">Target vs Achievement</h3>
      <div className="flex flex-col gap-4 justify-around h-[220px]">
        {monthlyTargets?.map((target, index) => (
          <div className="flex gap-4 items-center" key={index}>
            <div className="text-xs font-[bold] min-w-[35px] text-neutral-500">
              {target.month}
            </div>
            <div className="overflow-hidden relative flex-1 h-5 rounded-xl bg-zinc-300">
              <div
                className="h-full rounded-xl duration-[0.3s] ease-[ease] transition-[width]"
                style={{
                  backgroundColor:
                    target.percentage >= 100
                      ? "rgb(40, 167, 69)"
                      : target.percentage >= 90
                        ? "rgb(255, 193, 7)"
                        : "rgb(220, 53, 69)",
                  width: `${Math.min(target.percentage, 100)}%`,
                }}
              />
              {target.percentage > 100 && (
                <div
                  className="absolute top-0 left-full h-full bg-cyan-600 rounded-none"
                  style={{
                    width: `${target.percentage - 100}%`,
                  }}
                />
              )}
            </div>
            <div
              className="text-xs text-right font-[bold] min-w-10"
              style={{
                color:
                  target.percentage >= 100
                    ? "rgb(40, 167, 69)"
                    : "rgb(119, 119, 119)",
              }}
            >
              <span>{target.percentage}</span>
              <span>%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
