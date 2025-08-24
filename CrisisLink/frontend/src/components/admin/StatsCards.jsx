export default function StatsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatTime = (ms) => {
    if (!ms) return "N/A";
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hr ${minutes % 60} min`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
        <p className="text-3xl font-bold text-blue-600">{stats?.users?.total || 0}</p>
        <div className="flex text-sm text-gray-500 mt-2">
          <span className="text-green-600">↑ {stats?.users?.volunteers || 0} volunteers</span>
          <span className="ml-3">{stats?.users?.admins || 0} admins</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">SOS Requests</h3>
        <p className="text-3xl font-bold text-red-600">{stats?.sos?.total || 0}</p>
        <div className="text-sm text-gray-500 mt-2">
          <span className="text-yellow-600">{stats?.sos?.pending || 0} pending</span>
          <span className="mx-2">•</span>
          <span className="text-blue-600">{stats?.sos?.inProgress || 0} in progress</span>
          <span className="mx-2">•</span>
          <span className="text-green-600">{stats?.sos?.resolved || 0} resolved</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Recent Activity</h3>
        <p className="text-3xl font-bold text-purple-600">{stats?.recent?.sos || 0}</p>
        <div className="text-sm text-gray-500 mt-2">
          {stats?.recent?.sos || 0} SOS in last 7 days
        </div>
        <div className="text-sm text-gray-500">
          {stats?.recent?.users || 0} new users
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">Avg Response Time</h3>
        <p className="text-3xl font-bold text-green-600">
          {formatTime(stats?.responseTime?.avgResponseTime)}
        </p>
        <div className="text-sm text-gray-500 mt-2">
          Min: {formatTime(stats?.responseTime?.minResponseTime)}
        </div>
        <div className="text-sm text-gray-500">
          Max: {formatTime(stats?.responseTime?.maxResponseTime)}
        </div>
      </div>
    </div>
  );
}