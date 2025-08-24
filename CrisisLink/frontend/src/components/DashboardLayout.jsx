import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Home, User, Map, Bell, Settings, LogOut, 
  Menu, X, Shield, Users, AlertTriangle 
} from "lucide-react";

export default function DashboardLayout({ children, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navigation = {
    user: [
      { name: "Dashboard", href: "/dashboard/user", icon: Home },
      { name: "Profile", href: "/dashboard/user/profile", icon: User },
      { name: "My SOS", href: "/dashboard/user/sos", icon: AlertTriangle },
    ],
    volunteer: [
      { name: "Dashboard", href: "/dashboard/volunteer", icon: Home },
      { name: "Map View", href: "/dashboard/volunteer/map", icon: Map },
      { name: "SOS Requests", href: "/dashboard/volunteer/requests", icon: AlertTriangle },
      { name: "Profile", href: "/dashboard/volunteer/profile", icon: User },
    ],
    admin: [
      { name: "Overview", href: "/dashboard/admin", icon: Home },
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      { name: "SOS Management", href: "/dashboard/admin/sos", icon: Shield },
      { name: "Analytics", href: "/dashboard/admin/analytics", icon: Settings },
    ]
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        to={item.href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <item.icon className="w-5 h-5" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🚨</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ResQLink</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation[role]?.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation[role]?.find(item => location.pathname === item.href)?.name || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}