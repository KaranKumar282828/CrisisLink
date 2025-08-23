// src/pages/dashboard/admin/Overview.jsx
const Card = ({ title, value, sub }) => (
  <div className="bg-white border rounded-2xl p-5 shadow-sm">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{sub}</div>
  </div>
);

const AdminOverview = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Overview</h2>
    <div className="grid md:grid-cols-4 gap-4">
      <Card title="Active SOS" value="7" sub="Last 24h" />
      <Card title="Total Users" value="1,248" sub="+32 this week" />
      <Card title="Volunteers" value="217" sub="+5 this week" />
      <Card title="Avg Response" value="06:12" sub="mm:ss" />
    </div>
    <div className="h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
      <span className="text-gray-500">[ Map / Chart Placeholder ]</span>
    </div>
  </div>
);
export default AdminOverview;
