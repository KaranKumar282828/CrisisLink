// src/components/dashboard/Sidebar.jsx
import { NavLink } from "react-router-dom";

const Item = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block px-4 py-2 rounded-xl text-sm font-medium ${
        isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    {children}
  </NavLink>
);

const Sidebar = ({ role, onNavigate }) => {
  const byRole = {
    user: [
      { to: "/dashboard/user", label: "Home" },
      { to: "/dashboard/user/requests", label: "My Requests" },
      { to: "/dashboard/user/profile", label: "Profile" },
    ],
    volunteer: [
      { to: "/dashboard/volunteer", label: "Nearby SOS" },
      { to: "/dashboard/volunteer/accepted", label: "Accepted" },
      { to: "/dashboard/volunteer/history", label: "History" },
    ],
    admin: [
      { to: "/dashboard/admin", label: "Overview" },
      { to: "/dashboard/admin/users", label: "Manage Users" },
      { to: "/dashboard/admin/volunteers", label: "Manage Volunteers" },
      { to: "/dashboard/admin/requests", label: "All Requests" },
    ],
  };

  const items = byRole[role] || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
      <div className="px-4 py-3 rounded-xl bg-blue-50 text-blue-700 text-sm">
        Role: <span className="font-semibold capitalize">{role || "Unknown"}</span>
      </div>
      {items.map((i) => (
        <Item key={i.to} to={i.to} onClick={onNavigate}>
          {i.label}
        </Item>
      ))}
      <div className="pt-2 border-t">
        <Item to="/" onClick={onNavigate}>← Back to Home</Item>
      </div>
    </div>
  );
};

export default Sidebar;
