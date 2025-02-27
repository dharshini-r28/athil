
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn"; 
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import ViewCars from "./pages/ViewCars";
import ProtectedRoute from "./components/ProtectedRoute"; 
import LogoutButton from "./pages/LogoutButton";
import "./index.css";

const Navbar = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/signin";

  return (
    !hideNavbar && (
      <div className="navbar">
        <LogoutButton />
      </div>
    )
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<SignIn />} /> 

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/home" 
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Home />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/view-cars" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ViewCars />
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </Router>
  );
}

export default App;
