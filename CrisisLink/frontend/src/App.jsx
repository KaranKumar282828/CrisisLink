import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";

// Dashboards
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import VolunteerDashboard from "./pages/dashboard/VolunteerDashboard";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<About />} />

            {/* ✅ Protected Routes */}
            <Route
              path="/dashboard/user"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/volunteer"
              element={
                <ProtectedRoute role="volunteer">
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
