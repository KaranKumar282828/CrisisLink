import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="p-6">
        <Outlet />
      </div>
    </DashboardLayout>
  );
}