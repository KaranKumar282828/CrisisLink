// src/layouts/DashboardLayout.jsx
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { role } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // redirect /dashboard -> /dashboard/{role}
  if (location.pathname === "/dashboard") {
    if (role) return <Navigate to={`/dashboard/${role}`} replace />;
    return <Navigate to="/login" replace />;
  }

  // close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold capitalize">Dashboard • {role}</h1>
          <button
            className="md:hidden px-3 py-2 border rounded-lg"
            onClick={() => setOpen(true)}
          >
            ☰ Menu
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block col-span-3">
            <Sidebar role={role} />
          </aside>

          {/* Drawer (mobile) */}
          {open && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setOpen(false)}
              />
              <div className="fixed left-0 top-0 bottom-0 w-72 bg-white p-4 z-50 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold">Menu</div>
                  <button className="px-2 py-1 border rounded" onClick={() => setOpen(false)}>
                    ✕
                  </button>
                </div>
                <Sidebar role={role} onNavigate={() => setOpen(false)} />
              </div>
            </>
          )}

          {/* Content */}
          <section className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <Outlet />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
