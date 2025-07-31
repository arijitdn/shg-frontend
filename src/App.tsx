import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SHGDashboard from "./pages/ShgPage";
import VODashboard from "./pages/VoPage";
import CLFDashboard from "./pages/ClfPage";
import BMMUDashboard from "./pages/BmmuPage";
import DMMUDashboard from "./pages/DmmuPage";
import NicDashboard from "./pages/NicPage";
import HeaderSection from "./components/HeaderSection";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <HeaderSection />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/shg"
          element={
            <ProtectedRoute allowedRoles={["SHG"]}>
              <SHGDashboard />
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
              <VODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clf"
          element={
            <ProtectedRoute allowedRoles={["CLF"]}>
              <CLFDashboard />
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
