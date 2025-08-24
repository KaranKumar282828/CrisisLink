import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import SocketProvider from "./context/SocketContext";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import VolunteerDashboard from "./pages/dashboard/VolunteerDashboard";

// Import dashboard components
import UserHome from "./pages/dashboard/user/UserHome";
import VolunteerNearbySOS from "./pages/dashboard/volunteer/NearbySOS";
import VolunteerMapView from "./pages/dashboard/volunteer/MapView";

// Import Admin components
import AdminOverview from "./pages/dashboard/admin/AdminOverview";
import UserManagement from "./pages/dashboard/admin/UserManagement";
import SOSManagement from "./pages/dashboard/admin/SOSManagement";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes with Layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/signup" element={<Layout><Signup /></Layout>} />

            {/* Protected User Routes (without Layout - they have their own dashboard layout) */}
            <Route element={<ProtectedRoute allow={["user"]} />}>
              <Route path="/dashboard/user" element={<UserDashboard />}>
                <Route index element={<UserHome />} />
                <Route path="home" element={<UserHome />} />
                <Route path="profile" element={<div className="p-6">User Profile - Coming Soon</div>} />
                <Route path="sos" element={<div className="p-6">My SOS Requests - Coming Soon</div>} />
              </Route>
            </Route>

            {/* Protected Volunteer Routes */}
            <Route element={<ProtectedRoute allow={["volunteer"]} />}>
              <Route path="/dashboard/volunteer" element={<VolunteerDashboard />}>
                <Route index element={<VolunteerMapView />} />
                <Route path="map" element={<VolunteerMapView />} />
                <Route path="requests" element={<VolunteerNearbySOS />} />
                <Route path="profile" element={<div className="p-6">Volunteer Profile - Coming Soon</div>} />
              </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allow={["admin"]} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />}>
                <Route index element={<AdminOverview />} />
                <Route path="overview" element={<AdminOverview />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="sos" element={<SOSManagement />} />
                <Route path="analytics" element={<div className="p-6">Analytics Dashboard - Coming Soon</div>} />
              </Route>
            </Route>

            {/* 404 Page with Layout */}
            <Route path="*" element={
              <Layout>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-8">Page not found</p>
                    <a href="/" className="text-blue-600 hover:text-blue-700">
                      Go back home
                    </a>
                  </div>
                </div>
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}