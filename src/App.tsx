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

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/nic" && <HeaderSection />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shg" element={<SHGProductsPage />} />
        <Route path="/nic" element={<NicDashboard />} />
        <Route path="/vo" element={<VOApprovalPage />} />
        <Route path="/clf" element={<CLFApprovalPage />} />
        <Route path="/bmmu" element={<BMMUDashboard />} />
        <Route path="/dmmu" element={<DMMUDashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
