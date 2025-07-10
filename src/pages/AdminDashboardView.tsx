import StatsCards from "../components/StatsCards";
import SalesChart from "../components/SalesChart";
import TargetChart from "../components/TargetChart";
import SHGPerformanceCards from "../components/SHGPerformanceCards";
import ProductsTable from "../components/ProductsTable";
import InventoryCards from "../components/InventoryCards";
import ProductMetricsCards from "../components/ProductMetricsCards";
import KPICards from "../components/KPICards";
import HeaderSection from "../components/HeaderSection";
import NavigationTabs from "../components/NavigationTabs";
import Footer from "../components/Footer";
import { useRef } from "react";
// @ts-ignore
import jsPDF from "jspdf";
// @ts-ignore
import html2canvas from "html2canvas";

interface AdminDashboardViewProps {
  adminData: any;
  isLoggedIn: boolean;
  userRole: string | null;
  onLogout?: () => void;
  onShowLogin?: () => void;
}

export default function AdminDashboardView({
  adminData,
  isLoggedIn,
  userRole,
  onLogout,
  onShowLogin,
}: AdminDashboardViewProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);

  async function downloadDashboardAsPDF() {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("Admin_Dashboard_Report.pdf");
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
      <div
        ref={dashboardRef}
        className="mx-4 md:mx-8 my-5 rounded-md bg-white shadow"
      >
        <div className="flex justify-between items-center pb-4 mb-5 border-b-2 border-solid border-b-zinc-300">
          <h1 className="m-0 text-2xl font-[bold] text-neutral-500">
            Admin Dashboard
          </h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold text-sm shadow"
            onClick={downloadDashboardAsPDF}
          >
            Download Report
          </button>
        </div>
        <StatsCards adminData={adminData} />
        <div className="grid gap-5 mb-8 grid-cols-[repeat(auto-fit,minmax(400px,1fr))] max-sm:grid-cols-[1fr]">
          <SalesChart salesData={adminData.salesData} />
          <TargetChart monthlyTargets={adminData.monthlyTargets} />
        </div>
        <SHGPerformanceCards shgPerformance={adminData.shgPerformance} />
        <ProductsTable products={adminData.products} />
        <div className="grid gap-5 mb-8 grid-cols-[repeat(auto-fit,minmax(400px,1fr))] max-sm:grid-cols-[1fr]">
          <InventoryCards inventory={adminData.inventory} />
          <ProductMetricsCards products={adminData.products} />
        </div>
        <KPICards adminData={adminData} />
      </div>
      <Footer />
    </div>
  );
}
