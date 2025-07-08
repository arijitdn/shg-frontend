import NavigationTabs from "./NavigationTabs";
import HeaderSection from "./HeaderSection";
import Footer from "./Footer";
// Add jsPDF and html2canvas imports
// @ts-ignore
import jsPDF from "jspdf";
// @ts-ignore
import html2canvas from "html2canvas";
import { useState, useRef } from "react";

interface ComparisonsPageProps {
  isLoggedIn: boolean;
  userRole: string | null;
  onLogout?: () => void;
  onShowLogin?: () => void;
}

// Dummy SHG data for dropdowns
const allSHGs = [
  "Maa Durga SHG",
  "Lakshmi SHG",
  "Saraswati SHG",
  "Kali Mata SHG",
  "Ganesh SHG",
  "Shiv SHG",
];

const dummyComparison = [
  { metric: "Total Sales", shg1: 92250, shg2: 21750 },
  { metric: "Members", shg1: 12, shg2: 8 },
  { metric: "Avg Per Member", shg1: 7688, shg2: 2719 },
  { metric: "Products", shg1: 5, shg2: 3 },
  { metric: "Growth %", shg1: 12, shg2: 8, isPercent: true },
  { metric: "Inventory Value", shg1: 40000, shg2: 15000 },
  { metric: "Orders", shg1: 320, shg2: 145 },
  { metric: "Avg Order Value", shg1: 268, shg2: 150 },
  { metric: "Target Achievement", shg1: 97, shg2: 88, isPercent: true },
];

const dummySalesTrend = [
  { month: "Jan", shg1: 12000, shg2: 4000 },
  { month: "Feb", shg1: 14000, shg2: 5000 },
  { month: "Mar", shg1: 16000, shg2: 6000 },
  { month: "Apr", shg1: 18000, shg2: 7000 },
  { month: "May", shg1: 20000, shg2: 8000 },
  { month: "Jun", shg1: 22250, shg2: 9000 },
];

const dummyProducts = [
  { name: "Handloom Sarees", shg1: 120, shg2: 30 },
  { name: "Bamboo Baskets", shg1: 80, shg2: 60 },
  { name: "Organic Rice", shg1: 50, shg2: 90 },
  { name: "Herbal Soaps", shg1: 40, shg2: 20 },
  { name: "Traditional Jewelry", shg1: 30, shg2: 10 },
];

const dummyGrowth = [
  { year: "2020", shg1: 5, shg2: 3 },
  { year: "2021", shg1: 8, shg2: 5 },
  { year: "2022", shg1: 10, shg2: 7 },
  { year: "2023", shg1: 12, shg2: 8 },
];

export default function ComparisonsPage({
  isLoggedIn,
  userRole,
  onLogout,
  onShowLogin,
}: ComparisonsPageProps) {
  const [shg1, setShg1] = useState(allSHGs[0]);
  const [shg2, setShg2] = useState(allSHGs[1]);

  // Dummy target achievement for progress bar
  const target1 = 97;
  const target2 = 88;
  const reportRef = useRef<HTMLDivElement>(null);

  async function downloadReportAsPDF() {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`SHG_Comparison_${shg1}_vs_${shg2}.pdf`);
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderSection />
      <NavigationTabs
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogout={onLogout}
        onShowLogin={onShowLogin}
      />
      <main className="mx-4 md:mx-8 my-5 rounded-md bg-white shadow p-6">
        <div className="flex justify-between items-center pb-4 mb-5 border-b-2 border-solid border-b-zinc-300">
          <h1 className="m-0 text-2xl font-bold text-neutral-500">
            SHG Comparisons
          </h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold text-sm shadow"
            onClick={downloadReportAsPDF}
          >
            Download Report
          </button>
        </div>
        <div ref={reportRef}>
          <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
            <div className="flex flex-col">
              <label className="mb-1 text-sm text-neutral-500 font-semibold">
                SHGs Under your Cluster
              </label>
              <select
                className="p-2 border border-zinc-300 rounded text-sm min-w-[180px]"
                value={shg1}
                onChange={(e) => setShg1(e.target.value)}
              >
                {allSHGs.map((shg) => (
                  <option key={shg} value={shg}>
                    {shg}
                  </option>
                ))}
              </select>
            </div>
            <span className="font-bold text-neutral-400 text-lg">VS</span>
            <div className="flex flex-col">
              <label className="mb-1 text-sm text-neutral-500 font-semibold">
                SHGs Under your Cluster
              </label>
              <select
                className="p-2 border border-zinc-300 rounded text-sm min-w-[180px]"
                value={shg2}
                onChange={(e) => setShg2(e.target.value)}
              >
                {allSHGs.map((shg) => (
                  <option key={shg} value={shg}>
                    {shg}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto mb-8">
            <table className="w-full border border-zinc-200 rounded-lg bg-stone-50">
              <thead>
                <tr className="bg-white">
                  <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                    Metric
                  </th>
                  <th className="p-3 text-center text-blue-600 text-base font-bold">
                    {shg1}
                  </th>
                  <th className="p-3 text-center text-green-600 text-base font-bold">
                    {shg2}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dummyComparison.map((row) => (
                  <tr key={row.metric} className="border-t border-zinc-200">
                    <td className="p-3 text-neutral-600 font-medium">
                      {row.metric}
                    </td>
                    <td className="p-3 text-center text-blue-700 font-semibold">
                      {row.isPercent
                        ? `${row.shg1}%`
                        : typeof row.shg1 === "number"
                        ? `₹${row.shg1.toLocaleString()}`
                        : row.shg1}
                    </td>
                    <td className="p-3 text-center text-green-700 font-semibold">
                      {row.isPercent
                        ? `${row.shg2}%`
                        : typeof row.shg2 === "number"
                        ? `₹${row.shg2.toLocaleString()}`
                        : row.shg2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-8 p-5 rounded-md border border-solid bg-stone-50 border-zinc-300">
            <h3 className="mb-5 text-base text-neutral-500">
              Monthly Sales Trend (Last 6 Months)
            </h3>
            <div className="flex relative gap-2 items-end px-0 py-5 h-[220px]">
              <div className="absolute top-0 left-0 bottom-10 w-px bg-zinc-300" />
              <div className="absolute inset-x-0 bottom-10 h-px bg-zinc-300" />
              {dummySalesTrend.map((data, index) => (
                <div
                  className="flex relative flex-col flex-1 items-center"
                  key={index}
                >
                  <div className="mb-1.5 text-xs font-[bold] text-neutral-500">
                    <span>₹</span>
                    <span>
                      {(Math.max(data.shg1, data.shg2) / 1000).toFixed(0)}
                    </span>
                    <span>K</span>
                  </div>
                  <div className="flex gap-1 items-end">
                    <div
                      className="relative mb-2 w-6 rounded-lg transition-all duration-[0.3s] ease-[ease] min-h-5 cursor-pointer hover:scale-110 bg-blue-400"
                      title={`${shg1}: ₹${data.shg1.toLocaleString()}`}
                      style={{
                        height: `${(data.shg1 / 25000) * 150}px`,
                      }}
                    />
                    <div
                      className="relative mb-2 w-6 rounded-lg transition-all duration-[0.3s] ease-[ease] min-h-5 cursor-pointer hover:scale-110 bg-green-600"
                      title={`${shg2}: ₹${data.shg2.toLocaleString()}`}
                      style={{
                        height: `${(data.shg2 / 25000) * 150}px`,
                      }}
                    />
                  </div>
                  <div className="mb-0.5 text-xs font-[bold] text-neutral-500">
                    {data.month}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <span className="flex items-center gap-2 text-xs">
                <span className="inline-block w-3 h-3 rounded bg-blue-400" />
                {shg1}
              </span>
              <span className="flex items-center gap-2 text-xs">
                <span className="inline-block w-3 h-3 rounded bg-green-600" />
                {shg2}
              </span>
            </div>
          </div>
          <div className="mb-8 p-5 rounded-md border border-solid bg-stone-50 border-zinc-300">
            <h3 className="mb-5 text-base text-neutral-500">
              Target Achievement
            </h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="mb-2 text-sm font-semibold text-blue-600">
                  {shg1}
                </div>
                <div className="overflow-hidden h-4 rounded bg-zinc-300">
                  <div
                    className="h-full bg-blue-400 rounded"
                    style={{ width: `${target1}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {target1}% achieved
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-2 text-sm font-semibold text-green-600">
                  {shg2}
                </div>
                <div className="overflow-hidden h-4 rounded bg-zinc-300">
                  <div
                    className="h-full bg-green-600 rounded"
                    style={{ width: `${target2}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {target2}% achieved
                </div>
              </div>
            </div>
          </div>
          <div className="mb-8 p-5 rounded-md border border-solid bg-stone-50 border-zinc-300">
            <h3 className="mb-5 text-base text-neutral-500">
              Product Sales Comparison
            </h3>
            <div className="overflow-x-auto">
              <div
                className="relative flex gap-6 items-end h-56"
                style={{ background: "none" }}
              >
                <div className="absolute left-0 right-0 bottom-8 h-px bg-zinc-300" />
                {dummyProducts.map((product) => {
                  const maxBarHeight = 150;
                  const maxValue = 120;
                  const bar1Height =
                    (product.shg1 / maxValue) * (maxBarHeight - 24);
                  const bar2Height =
                    (product.shg2 / maxValue) * (maxBarHeight - 24);
                  return (
                    <div
                      key={product.name}
                      className="flex flex-col items-center flex-1 min-w-[80px]"
                    >
                      <div className="flex flex-col items-center w-full mb-4">
                        <div className="flex gap-2 items-end w-full justify-center">
                          <div className="flex flex-col items-center">
                            <span
                              className="mb-1 text-xs font-bold text-neutral-500"
                              style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                              ₹{(product.shg1 / 1000).toFixed(0)}K
                            </span>
                            <div
                              className="w-7 rounded-lg bg-blue-400 hover:scale-110 transition-transform cursor-pointer"
                              style={{
                                height: `${bar1Height}px`,
                                minHeight: "16px",
                              }}
                              title={`${shg1}: ${product.shg1} sold`}
                            />
                          </div>
                          <div className="flex flex-col items-center">
                            <span
                              className="mb-1 text-xs font-bold text-neutral-500"
                              style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                              ₹{(product.shg2 / 1000).toFixed(0)}K
                            </span>
                            <div
                              className="w-7 rounded-lg bg-green-600 hover:scale-110 transition-transform cursor-pointer"
                              style={{
                                height: `${bar2Height}px`,
                                minHeight: "16px",
                              }}
                              title={`${shg2}: ${product.shg2} sold`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-center text-neutral-500 font-semibold w-full break-words">
                        {product.name}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <span className="flex items-center gap-2 text-xs">
                  <span className="inline-block w-3 h-3 rounded bg-blue-400" />
                  {shg1}
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <span className="inline-block w-3 h-3 rounded bg-green-600" />
                  {shg2}
                </span>
              </div>
            </div>
          </div>
          <div className="mb-8 p-5 rounded-md border border-solid bg-stone-50 border-zinc-300">
            <h3 className="mb-5 text-base text-neutral-500">
              Growth Chart (Yearly % Growth)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-zinc-200 rounded-lg bg-white">
                <thead>
                  <tr className="bg-stone-50">
                    <th className="p-3 text-left text-neutral-500 text-base font-semibold">
                      Year
                    </th>
                    <th className="p-3 text-center text-blue-600 text-base font-bold">
                      {shg1}
                    </th>
                    <th className="p-3 text-center text-green-600 text-base font-bold">
                      {shg2}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dummyGrowth.map((row) => (
                    <tr key={row.year} className="border-t border-zinc-200">
                      <td className="p-3 text-neutral-600 font-medium">
                        {row.year}
                      </td>
                      <td className="p-3 text-center text-blue-700 font-semibold">
                        {row.shg1}%
                      </td>
                      <td className="p-3 text-center text-green-700 font-semibold">
                        {row.shg2}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
