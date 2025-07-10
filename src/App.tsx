import { Routes, Route, useLocation } from "react-router-dom";
import NicDashboard from "./pages/NicDashboard";
import SHGProductsPage from "./pages/ShgPage";
import HomePage from "./pages/HomePage";
import HeaderSection from "./components/HeaderSection";
import Footer from "./components/Footer";
import VOApprovalPage from "./pages/VoPage";
import CLFApprovalPage from "./pages/ClfPage";
import BMMUDashboard from "./pages/BmmuDashboard";

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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
{
  /* <Route
          path="/"
          element={
            userRole === "NIC" ? (
              <NicDashboard />
            ) : (
              <TripuraSHGPortal
                adminData={adminData}
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                onLogout={handleLogout}
                onShowLogin={handleShowLogin}
              />
            )
          }
        />
        {isLoggedIn && userRole !== "NIC" && (
          <Route
            path="/admin"
            element={
              <AdminDashboardView
                adminData={adminData}
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                onLogout={handleLogout}
                onShowLogin={handleShowLogin}
              />
            }
          />
        )}
        {isLoggedIn && userRole !== "NIC" && (
          <Route
            path="/inventory"
            element={
              <InventoryPage
                adminData={adminData}
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                onLogout={handleLogout}
                onShowLogin={handleShowLogin}
              />
            }
          />
        )}</Routes>
        {isLoggedIn &&
          userRole !== "NIC" &&
          ["VO", "CLF", "TRLM", "DMMU"].includes(userRole || "") && (
            <Route
              path="/comparisons"
              element={
                <ComparisonsPage
                  isLoggedIn={isLoggedIn}
                  userRole={userRole}
                  onLogout={handleLogout}
                  onShowLogin={handleShowLogin}
                />
              }
            />
          )} */
}

{
  /* {showLoginPage && (
        <Modal isOpen={showLoginPage} onClose={handleCloseLogin}>
          <LoginPage onLogin={handleLogin} onClose={handleCloseLogin} />
        </Modal>
      )} */
}
