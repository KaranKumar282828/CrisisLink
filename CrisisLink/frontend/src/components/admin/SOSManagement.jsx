import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function SOSManagement() {
  const [sosRequests, setSOSRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    type: ''
  });

  const fetchSOS = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const { data } = await api.get(`/admin/sos?${params}`);
      setSOSRequests(data.sosRequests);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to fetch SOS requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSOS();
  }, [filters]);

  const updateSOSStatus = async (sosId, status) => {
    try {
      await api.patch(`/admin/sos/${sosId}/status`, { status });
      toast.success('SOS status updated');
      fetchSOS();
    } catch (err) {
      toast.error('Failed to update SOS status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">SOS Management</h2>
        <div className="flex flex-wrap gap-4 mt-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="border rounded px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            className="border rounded px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="Medical">Medical</option>
            <option value="Accident">Accident</option>
            <option value="Fire">Fire</option>
            <option value="Harassment">Harassment</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-6">Loading SOS requests...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left">SOS Details</th>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Volunteer</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Created</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sosRequests.map((sos) => (
                  <tr key={sos._id} className="border-b">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{sos.type}</div>
                        <div className="text-sm text-gray-500">{sos.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sos.user ? (
                        <div>
                          <div>{sos.user.name}</div>
                          <div className="text-sm text-gray-500">{sos.user.email}</div>
                          <div className="text-sm text-gray-500">{sos.user.phone}</div>
                        </div>
                      ) : (
                        'Unknown'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {sos.volunteer ? (
                        <div>
                          <div>{sos.volunteer.name}</div>
                          <div className="text-sm text-gray-500">{sos.volunteer.email}</div>
                        </div>
                      ) : (
                        'Unassigned'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(sos.status)}`}>
                        {sos.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(sos.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <select
                        value={sos.status}
                        onChange={(e) => updateSOSStatus(sos._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="p-6 border-t">
              <div className="flex justify-between items-center">
                <span>Showing {sosRequests.length} of {pagination.total} requests</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={filters.page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>Page {filters.page} of {pagination.pages}</span>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={filters.page === pagination.pages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}