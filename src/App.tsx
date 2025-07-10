import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TripuraSHGPortal from "./pages/TripuraSHGPortal";
import AdminDashboardView from "./pages/AdminDashboardView";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import Modal from "./components/Modal";
import { useState } from "react";
import ComparisonsPage from "./pages/ComparisonsPage";
import NicDashboard from "./pages/NicDashboard";

function App() {
  const [adminData] = useState({
    products: [
      {
        id: 1,
        name: "Handloom Sarees",
        category: "Textiles",
        price: 2500,
        stock: 45,
        shg: "Maa Durga SHG",
        sold: 25,
        revenue: 62500,
      },
      {
        id: 2,
        name: "Bamboo Baskets",
        category: "Handicrafts",
        price: 350,
        stock: 120,
        shg: "Maa Durga SHG",
        sold: 85,
        revenue: 29750,
      },
      {
        id: 3,
        name: "Organic Rice",
        category: "Food Products",
        price: 80,
        stock: 500,
        shg: "Kali Mata SHG",
        sold: 320,
        revenue: 25600,
      },
      {
        id: 4,
        name: "Traditional Jewelry",
        category: "Accessories",
        price: 1200,
        stock: 30,
        shg: "Saraswati SHG",
        sold: 18,
        revenue: 21600,
      },
      {
        id: 5,
        name: "Herbal Soaps",
        category: "Personal Care",
        price: 150,
        stock: 200,
        shg: "Lakshmi SHG",
        sold: 145,
        revenue: 21750,
      },
    ],
    salesData: [
      {
        month: "Sep",
        sales: 38000,
        orders: 142,
        avgOrder: 268,
      },
      {
        month: "Oct",
        sales: 42000,
        orders: 156,
        avgOrder: 269,
      },
      {
        month: "Nov",
        sales: 45000,
        orders: 168,
        avgOrder: 268,
      },
      {
        month: "Dec",
        sales: 52000,
        orders: 195,
        avgOrder: 267,
      },
      {
        month: "Jan",
        sales: 48000,
        orders: 178,
        avgOrder: 270,
      },
      {
        month: "Feb",
        sales: 61000,
        orders: 225,
        avgOrder: 271,
      },
      {
        month: "Mar",
        sales: 58000,
        orders: 214,
        avgOrder: 271,
      },
      {
        month: "Apr",
        sales: 65000,
        orders: 240,
        avgOrder: 271,
      },
    ],
    inventory: [
      {
        category: "Textiles",
        value: 125000,
        items: 45,
        growth: 12,
      },
      {
        category: "Handicrafts",
        value: 42000,
        items: 120,
        growth: 8,
      },
      {
        category: "Food Products",
        value: 40000,
        items: 500,
        growth: 15,
      },
      {
        category: "Accessories",
        value: 36000,
        items: 30,
        growth: 22,
      },
      {
        category: "Personal Care",
        value: 30000,
        items: 200,
        growth: 18,
      },
    ],
    shgPerformance: [
      {
        name: "Maa Durga SHG",
        sales: 92250,
        members: 2,
        avgPerMember: 46125,
      },
      {
        name: "Lakshmi SHG",
        sales: 21750,
        members: 2,
        avgPerMember: 10875,
      },
      {
        name: "Saraswati SHG",
        sales: 21600,
        members: 1,
        avgPerMember: 21600,
      },
      {
        name: "Kali Mata SHG",
        sales: 25600,
        members: 1,
        avgPerMember: 25600,
      },
    ],
    monthlyTargets: [
      {
        month: "Jan",
        target: 50000,
        achieved: 48000,
        percentage: 96,
      },
      {
        month: "Feb",
        target: 55000,
        achieved: 61000,
        percentage: 111,
      },
      {
        month: "Mar",
        target: 60000,
        achieved: 58000,
        percentage: 97,
      },
      {
        month: "Apr",
        target: 65000,
        achieved: 65000,
        percentage: 100,
      },
    ],
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showLoginPage, setShowLoginPage] = useState(false);

  // Update handleLogin to accept (roleType, role, credentials)
  const handleLogin = (
    _roleType: string,
    role: string,
    _credentials: { idOrEmail: string; password: string }
  ) => {
    setIsLoggedIn(true);
    setUserRole(role); // This will be 'BMMU' if BMMU is selected
    setShowLoginPage(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const handleShowLogin = () => {
    setShowLoginPage(true);
  };

  const handleCloseLogin = () => {
    setShowLoginPage(false);
  };

  return (
    <Router>
      <Routes>
        <Route
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
        )}
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
          )}
      </Routes>
      {showLoginPage && (
        <Modal isOpen={showLoginPage} onClose={handleCloseLogin}>
          <LoginPage onLogin={handleLogin} onClose={handleCloseLogin} />
        </Modal>
      )}
    </Router>
  );
}

export default App;
