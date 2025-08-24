import { useState, useEffect } from "react";
import { AlertTriangle, User, Clock, MapPin, CheckCircle, XCircle } from "lucide-react";
import { useAdmin } from "../../../hooks/useAdmin";

export default function SOSManagement() {
  const [sosRequests, setSosRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    type: ''
  });
  const { getSOSRequests } = useAdmin();

  const fetchSOSRequests = async () => {
    try {
      const data = await getSOSRequests(filters);
      setSosRequests(data.sosRequests || []);
    } catch (error) {
      console.error("Failed to fetch SOS requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSOSRequests();
  }, [filters]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-800",
      'In Progress': "bg-blue-100 text-blue-800",
      Resolved: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.Pending}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">SOS Management</h1>
        <p className="text-gray-600">Monitor and manage all emergency requests</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Types</option>
              <option value="Medical">Medical</option>
              <option value="Accident">Accident</option>
              <option value="Fire">Fire</option>
              <option value="Harassment">Harassment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchSOSRequests}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* SOS Requests */}
      <div className="space-y-4">
        {sosRequests.map((sos) => (
          <div key={sos._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{sos.type}</h3>
                    <p className="text-sm text-gray-600">{sos.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Requester</span>
                    </div>
                    <p>{sos.user?.name || 'Unknown'}</p>
                    {sos.user?.phone && <p className="text-xs">{sos.user.phone}</p>}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Time</span>
                    </div>
                    <p>{new Date(sos.createdAt).toLocaleString()}</p>
                    <p className="text-xs">{getStatusBadge(sos.status)}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Location</span>
                    </div>
                    <p className="text-xs">
                      {sos.location?.coordinates 
                        ? `${sos.location.coordinates[1].toFixed(4)}, ${sos.location.coordinates[0].toFixed(4)}`
                        : 'Location not available'
                      }
                    </p>
                  </div>
                </div>

                {sos.volunteer && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <User className="w-4 h-4" />
                      <span>Assigned to: {sos.volunteer.name}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Resolve
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm">
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sosRequests.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No SOS requests found</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}