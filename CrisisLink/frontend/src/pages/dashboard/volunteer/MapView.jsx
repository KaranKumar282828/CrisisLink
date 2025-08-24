import { useState, useEffect } from "react";
import { Map, Navigation, User, Clock } from "lucide-react";

export default function MapView() {
  const [nearbyRequests, setNearbyRequests] = useState([
    {
      id: 1,
      type: "Medical Emergency",
      distance: "0.8km",
      time: "2 min ago",
      user: "John Doe",
    },
    {
      id: 2,
      type: "Accident",
      distance: "1.2km",
      time: "5 min ago",
      user: "Jane Smith",
    }
  ]);

  const acceptRequest = async (requestId) => {
    alert(`Accepted request #${requestId}`);
    setNearbyRequests(prev => prev.filter(req => req.id !== requestId));
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Nearby Emergencies Map</h2>
        <div className="h-96 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Map className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Live Map View</p>
            <p className="text-sm text-gray-500 mt-2">Real-time emergency locations</p>
            <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
              <p className="text-xs text-gray-600">{nearbyRequests.length} active emergencies nearby</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Requests</p>
              <p className="text-2xl font-bold text-gray-900">{nearbyRequests.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Distance</p>
              <p className="text-2xl font-bold text-gray-900">1.0km</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Map className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-900">4.2m</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}