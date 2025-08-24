import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Navigation, User, Clock, Phone } from 'lucide-react';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createCustomIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const icons = {
  emergency: createCustomIcon('red'),
  medical: createCustomIcon('red'),
  accident: createCustomIcon('orange'),
  fire: createCustomIcon('yellow'),
  harassment: createCustomIcon('purple'),
  volunteer: createCustomIcon('blue'),
  user: createCustomIcon('green'),
  default: createCustomIcon('grey')
};

function MapUpdater({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export default function EnhancedMapComponent({ 
  sosList = [], 
  userLocation,
  onSosSelect,
  height = '500px',
  showRouting = false
}) {
  const [mapCenter, setMapCenter] = useState(userLocation || [28.6139, 77.2090]); // Default to Delhi
  const [zoom, setZoom] = useState(userLocation ? 13 : 10);
  const mapRef = useRef();

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
      setZoom(13);
    }
  }, [userLocation]);

  const getDirections = (coordinates) => {
    if (!coordinates || coordinates.length < 2) return;
    
    const [lng, lat] = coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const callUser = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  return (
    <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={icons.user}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">Your Location</h3>
                <p className="text-sm text-gray-600">
                  {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* SOS markers */}
        {sosList.map((sos) => {
          const coordinates = sos.location?.coordinates;
          if (!coordinates || coordinates.length < 2) return null;
          
          const position = [coordinates[1], coordinates[0]]; // [lat, lng]
          const icon = icons[sos.type?.toLowerCase()] || icons.emergency;

          return (
            <Marker
              key={sos._id}
              position={position}
              icon={icon}
              eventHandlers={{
                click: () => onSosSelect && onSosSelect(sos)
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-red-600 capitalize">{sos.type}</h3>
                  <p className="text-sm text-gray-600 mb-2">{sos.description}</p>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{sos.user?.name || 'Unknown'}</span>
                    </div>
                    
                    {sos.user?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>{sos.user.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(sos.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => getDirections(coordinates)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded"
                    >
                      <Navigation className="w-3 h-3" />
                      Directions
                    </button>
                    
                    {sos.user?.phone && (
                      <button
                        onClick={() => callUser(sos.user.phone)}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                      >
                        Call
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapUpdater center={mapCenter} zoom={zoom} />
      </MapContainer>
    </div>
  );
}