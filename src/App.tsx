import { Routes, Route, useLocation } from "react-router-dom";
import NicDashboard from "./pages/NicDashboard";
import SHGProductsPage from "./pages/ShgPage";
import HomePage from "./pages/HomePage";
import HeaderSection from "./components/HeaderSection";
import Footer from "./components/Footer";
import VOApprovalPage from "./pages/VoPage";
import CLFApprovalPage from "./pages/ClfPage";
import BMMUDashboard from "./pages/BmmuDashboard";
import DMMUDashboard from "./pages/DmmuPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/nic" && <HeaderSection />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/shg"
          element={
            <ProtectedRoute allowedRoles={["SHG"]}>
              <SHGProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nic"
          element={
            <ProtectedRoute allowedRoles={["NIC"]}>
              <NicDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vo"
          element={
            <ProtectedRoute allowedRoles={["VO"]}>
              <VOApprovalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clf"
          element={
            <ProtectedRoute allowedRoles={["CLF"]}>
              <CLFApprovalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bmmu"
          element={
            <ProtectedRoute allowedRoles={["BMMU"]}>
              <BMMUDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dmmu"
          element={
            <ProtectedRoute allowedRoles={["DMMU"]}>
              <DMMUDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
