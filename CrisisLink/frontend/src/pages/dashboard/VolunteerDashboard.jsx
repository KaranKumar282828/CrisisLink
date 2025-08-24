import DashboardLayout from "../../components/DashboardLayout";
import { Outlet } from "react-router-dom";

export default function VolunteerDashboard() {
  return (
    <DashboardLayout role="volunteer">
      <Outlet />
    </DashboardLayout>
  );
}