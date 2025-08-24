import { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw, CheckCircle, Clock, MapPin, Plus } from "lucide-react";
import { useSOS } from "../../../hooks/useSOS";

export default function UserHome() {
  const [sosHistory, setSosHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const { loading: sendingSOS, createSOS, getMySOS } = useSOS();

  const sendEmergencySOS = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });

      const sosData = {
        type: "Emergency",
        description: "I need immediate help!",
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      };
      
      await createSOS(sosData);
      fetchSOSHistory();
    } catch (error) {
      console.error("Failed to send SOS:", error);
      alert("Please enable location services to send SOS");
    }
  };

  const fetchSOSHistory = async () => {
    setLoadingHistory(true);
    setError(null);
    try {
      const data = await getMySOS();
      // Ensure we always have an array, even if API returns different structure
      const history = Array.isArray(data) ? data : (data.items || []);
      setSosHistory(history);
    } catch (error) {
      console.error("Failed to fetch SOS history:", error);
      setError("Failed to load SOS history");
      setSosHistory([]); // Set empty array on error
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchSOSHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "text-green-600 bg-green-100";
      case "In Progress": return "text-blue-600 bg-blue-100";
      case "Pending": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString();
  };

  return (
    <div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* SOS Button */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Emergency SOS</h3>
          <p className="text-sm text-gray-600 mb-4">Get immediate help</p>
          <button
            onClick={sendEmergencySOS}
            disabled={sendingSOS}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
          >
            {sendingSOS ? "Sending SOS..." : "Send Emergency SOS"}
          </button>
        </div>

        {/* Location Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Location Services</h3>
          <p className="text-sm text-gray-600 mb-2">Status: Active</p>
          <p className="text-xs text-gray-500">Your location will be shared during emergencies</p>
        </div>

        {/* Quick Help */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Quick Help</h3>
          <p className="text-sm text-gray-600">Medical, Police, Fire emergency contacts</p>
        </div>
      </div>

      {/* Recent SOS Requests */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent SOS Requests</h2>
          <button
            onClick={fetchSOSHistory}
            disabled={loadingHistory}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingHistory ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchSOSHistory}
              className="text-red-600 underline text-sm mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {loadingHistory ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(sosHistory) && sosHistory.map((request) => (
              <div key={request._id || request.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{request.type || "Emergency"}</h4>
                    <p className="text-sm text-gray-600">{request.createdAt ? formatTime(request.createdAt) : "Recent"}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status || "Pending")}`}>
                  {request.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}

        {(!loadingHistory && (!sosHistory || sosHistory.length === 0)) && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent SOS requests</p>
            <p className="text-sm text-gray-400 mt-2">Your SOS requests will appear here</p>
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Police</h3>
          <p className="text-2xl font-bold text-red-600 mb-2">100</p>
          <p className="text-sm text-gray-600">Emergency police response</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Ambulance</h3>
          <p className="text-2xl font-bold text-red-600 mb-2">108</p>
          <p className="text-sm text-gray-600">Medical emergency services</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Fire</h3>
          <p className="text-2xl font-bold text-red-600 mb-2">101</p>
          <p className="text-sm text-gray-600">Fire emergency services</p>
        </div>
      </div>
    </div>
  );
}