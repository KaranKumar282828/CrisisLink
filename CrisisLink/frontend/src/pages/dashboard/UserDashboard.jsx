import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

export default function UserDashboard() {
  return (
    <DashboardLayout role="user">
      <Outlet />
    </DashboardLayout>
  );
}