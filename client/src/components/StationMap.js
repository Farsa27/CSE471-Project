import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icons
// Train icon for stations
const stationIcon = L.divIcon({
  html:
    '<div style="font-size:28px;line-height:1;color:#1d4ed8;text-shadow:0 1px 0 rgba(0,0,0,0.6)">🚆</div>',
  className: "train-station-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Human location marker with gradient badge
const userIcon = L.divIcon({
  html: `
    <div style="position:relative;width:36px;height:36px;">
      <div style="position:absolute;inset:0;border-radius:50%;
                  background:radial-gradient(circle at 35% 35%, #fef3c7, #f59e0b);
                  box-shadow:0 2px 6px rgba(0,0,0,0.35),0 0 0 2px rgba(255,255,255,0.6);"></div>
      <div style="position:absolute;inset:0;display:grid;place-items:center;font-size:20px;">🧍</div>
    </div>
  `,
  className: "user-location-icon",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const stations = [
  { name: "Uttara North", lat: 23.86914, lng: 90.36748 },
  { name: "Uttara Center", lat: 23.85972, lng: 90.36518 },
  { name: "Uttara South", lat: 23.8456, lng: 90.36314 },
  { name: "Pallabi", lat: 23.82615, lng: 90.36427 },
  { name: "Mirpur-11", lat: 23.81924, lng: 90.36527 },
  { name: "Mirpur-10", lat: 23.79095, lng: 90.37553 },
  { name: "Kazipara", lat: 23.7995, lng: 90.3719 },
  { name: "Shewrapara", lat: 23.79095, lng: 90.37553 },
  { name: "Agargaon", lat: 23.77842, lng: 90.38015 },
  { name: "Bijoy Sarani", lat: 23.76634, lng: 90.38313 },
  { name: "Farmgate", lat: 23.75903, lng: 90.38635 },
  { name: "Karwan Bazar", lat: 23.75154, lng: 90.39266 },
  { name: "Shahbagh", lat: 23.73958, lng: 90.39601 },
  { name: "Dhaka University", lat: 23.73142, lng: 90.39702 },
  { name: "Bangladesh Secretariat", lat: 23.73001, lng: 90.40787 },
  { name: "Motijheel", lat: 23.72743, lng: 90.42018 },
  { name: "Kamalapur", lat: 23.73186, lng: 90.4253 },
];

const UpdateMapCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
};

const StationMap = () => {
  const navigate = useNavigate();
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    document.title = "Real-time Metro Station Locations";

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting user location:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 7000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="relative max-w-6xl mx-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-xl overflow-hidden">
          <MapContainer
            center={[23.7806, 90.4]}
            zoom={12}
            scrollWheelZoom={true}
            className="h-[75vh] w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {stations.map((station, idx) => (
              <Marker key={idx} position={[station.lat, station.lng]} icon={stationIcon}>
                <Popup>{station.name}</Popup>
              </Marker>
            ))}

            {userPosition && (
              <>
                <Marker position={userPosition} icon={userIcon}>
                  <Popup>Your Location</Popup>
                </Marker>
                <UpdateMapCenter position={userPosition} />
              </>
            )}
          </MapContainer>

          <button
            onClick={() => navigate("/home")}
            className="absolute top-6 left-6 bg-white/90 text-slate-800 px-4 py-2 rounded-md shadow hover:bg-white"
          >
            ⬅ Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationMap;