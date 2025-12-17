import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icons
const stationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // train icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png", // human icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const stations = [
  { name: "Uttara North", lat: 23.8917, lng: 90.4002 },
  { name: "Uttara Center", lat: 23.8828, lng: 90.4003 },
  { name: "Uttara South", lat: 23.8744, lng: 90.4005 },
  { name: "Pallabi", lat: 23.8615, lng: 90.3949 },
  { name: "Mirpur-11", lat: 23.8550, lng: 90.3889 },
  { name: "Mirpur-10", lat: 23.8490, lng: 90.3847 },
  { name: "Kazipara", lat: 23.8374, lng: 90.3797 },
  { name: "Shewrapara", lat: 23.8293, lng: 90.3764 },
  { name: "Agargaon", lat: 23.8195, lng: 90.3734 },
  { name: "Bijoy Sarani", lat: 23.8126, lng: 90.3816 },
  { name: "Farmgate", lat: 23.8046, lng: 90.3895 },
  { name: "Karwan Bazar", lat: 23.7980, lng: 90.3951 },
  { name: "Shahbagh", lat: 23.7380, lng: 90.3951 },
  { name: "Dhaka University", lat: 23.7340, lng: 90.3921 },
  { name: "Bangladesh Secretariat", lat: 23.7294, lng: 90.3970 },
  { name: "Motijheel", lat: 23.7260, lng: 90.4125 },
  { name: "Kamalapur", lat: 23.7276, lng: 90.4182 },
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
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[23.7806, 90.4000]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {stations.map((station, idx) => (
          <Marker
            key={idx}
            position={[station.lat, station.lng]}
            icon={stationIcon}
          >
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
        className="absolute top-4 left-4 bg-white px-4 py-2 rounded shadow hover:bg-gray-200"
      >
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default StationMap;  