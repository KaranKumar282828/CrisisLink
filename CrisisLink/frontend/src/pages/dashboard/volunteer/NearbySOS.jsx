import { useEffect, useState } from "react";
import { AlertTriangle, Navigation, User, Clock, RefreshCw, MapPin, Radio } from "lucide-react";
import { useSOS } from "../../../hooks/useSOS";
import { useRealtimeSOS } from "../../../hooks/useRealtimeSOS";
import toast from "react-hot-toast";

export default function NearbySOS() {
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const { getNearbySOS, acceptSOS, getCurrentLocation } = useSOS();

  // Real-time SOS handling
  const { emitSOSEvent, isConnected } = useRealtimeSOS(
    // onSOSCreated - new SOS received
    (newSOS) => {
      setSosList(prev => [newSOS, ...prev]);
    },
    // onSOSAccepted - SOS accepted by someone
    (data) => {
      setSosList(prev => prev.filter(sos => sos._id !== data.sosId));
    }
  );

  const fetchNearbySOS = async (lat, lng) => {
    setLoading(true);
    try {
      const requests = await getNearbySOS(lat, lng);
      setSosList(requests);
    } catch (error) {
      console.error("Failed to fetch nearby SOS:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      fetchNearbySOS(location.lat, location.lng);
      
      // Emit location update to server
      if (isConnected) {
        emitSOSEvent('location_update', {
          lat: location.lat,
          lng: location.lng,
          accuracy: location.accuracy
        });
      }
      
      toast.success("Location updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAcceptSOS = async (sosId) => {
    try {
      const result = await acceptSOS(sosId);
      
      // Notify other volunteers via socket
      if (isConnected) {
        emitSOSEvent('sos_accepted', {
          sosId: sosId,
          volunteerId: result.volunteerId
        });
      }
      
      setSosList(prev => prev.filter(sos => sos._id !== sosId));
    } catch (error) {
      console.error("Failed to accept SOS:", error);
    }
  };

  useEffect(() => {
    updateLocation();
    
    // Set up periodic location updates (every 30 seconds)
    const interval = setInterval(updateLocation, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      {/* Header with connection status */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nearby SOS Requests</h2>
          <p className="text-gray-600">Real-time emergency alerts</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            <Radio className="w-4 h-4" />
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <button
            onClick={updateLocation}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Real-time SOS List */}
      <div className="space-y-4">
        {sosList.map((sos) => (
          <div key={sos._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{sos.type}</h3>
                    <p className="text-sm text-gray-600">{sos.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{sos.user?.name || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(sos.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                
                {sos.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {sos.location.coordinates 
                        ? `${sos.location.coordinates[1].toFixed(4)}, ${sos.location.coordinates[0].toFixed(4)}`
                        : 'Location available'
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleAcceptSOS(sos._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button 
                  onClick={() => {
                    if (sos.location?.coordinates) {
                      navigator.clipboard.writeText(
                        `https://maps.google.com/?q=${sos.location.coordinates[1]},${sos.location.coordinates[0]}`
                      );
                      toast.success("Location copied to clipboard");
                    }
                  }}
                  className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  Copy Location
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sosList.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No active emergency requests in your area</p>
          <p className="text-sm text-gray-400 mt-2">You will receive real-time alerts when new SOS requests come in</p>
        </div>
      )}
    </div>
  );
}