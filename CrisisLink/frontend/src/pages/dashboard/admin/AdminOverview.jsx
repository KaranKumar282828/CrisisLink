import { useState, useEffect } from "react";
import { Users, AlertTriangle, CheckCircle, Clock, TrendingUp, MapPin } from "lucide-react";
import { useAdmin } from "../../../hooks/useAdmin";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getStats } = useAdmin();

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Overview</h1>
        <p className="text-gray-600">System statistics and monitoring</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.users?.total || 0}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex text-sm text-gray-500 mt-2">
            <span className="text-green-600">{stats?.users?.volunteers || 0} volunteers</span>
            <span className="mx-2">•</span>
            <span>{stats?.users?.admins || 0} admins</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">SOS Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.sos?.total || 0}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            <span className="text-yellow-600">{stats?.sos?.pending || 0} pending</span>
            <span className="mx-2">•</span>
            <span className="text-blue-600">{stats?.sos?.inProgress || 0} in progress</span>
            <span className="mx-2">•</span>
            <span className="text-green-600">{stats?.sos?.resolved || 0} resolved</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Activity</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.recent?.sos || 0}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {stats?.recent?.sos || 0} SOS in last 7 days
          </div>
          <div className="text-sm text-gray-500">
            {stats?.recent?.users || 0} new users
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.responseTime?.avgResponseTime ? 
                  `${Math.round(stats.responseTime.avgResponseTime / 60000)}m` : 'N/A'
                }
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Min: {stats?.responseTime?.minResponseTime ? 
              `${Math.round(stats.responseTime.minResponseTime / 60000)}m` : 'N/A'
            }
          </div>
          <div className="text-sm text-gray-500">
            Max: {stats?.responseTime?.maxResponseTime ? 
              `${Math.round(stats.responseTime.maxResponseTime / 60000)}m` : 'N/A'
            }
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
              View All Users
            </button>
            <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
              Manage SOS Requests
            </button>
            <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
              Generate Reports
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Status</span>
              <span className="text-green-600 font-semibold">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="text-green-600 font-semibold">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">WebSocket</span>
              <span className="text-green-600 font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span>New SOS request from John Doe</span>
            </div>
            <span className="text-sm text-gray-500">2 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>SOS #123 resolved by Jane Smith</span>
            </div>
            <span className="text-sm text-gray-500">5 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-blue-600" />
              <span>New volunteer registered: Mike Johnson</span>
            </div>
            <span className="text-sm text-gray-500">10 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}