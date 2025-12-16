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
  { name: "Uttara North", lat: 23.86914, lng: 90.36748 },
  { name: "Uttara Center", lat: 23.85972, lng: 90.36518 },
  { name: "Uttara South", lat: 23.84560, lng: 90.36314 },
  { name: "Pallabi", lat: 23.82615, lng: 90.36427 },
  { name: "Mirpur-11", lat: 23.81924, lng: 90.36527 },
  { name: "Mirpur-10", lat: 23.79095, lng: 90.37553 },
  { name: "Kazipara", lat: 23.79950, lng: 90.37190 },
  { name: "Shewrapara", lat: 23.79095, lng: 90.37553 },
  { name: "Agargaon", lat: 23.77842, lng: 90.38015 },
  { name: "Bijoy Sarani", lat: 23.76634, lng: 90.38313 },
  { name: "Farmgate", lat: 23.75903, lng: 90.38635 },
  { name: "Karwan Bazar", lat: 23.75154, lng: 90.39266 },
  { name: "Shahbagh", lat: 23.73958, lng: 90.39601 },
  { name: "Dhaka University", lat: 23.73142, lng: 90.39702 },
  { name: "Bangladesh Secretariat", lat: 23.73001, lng: 90.40787 },
  { name: "Motijheel", lat: 23.72743, lng: 90.42018 },
  { name: "Kamalapur", lat: 23.73186, lng: 90.42530 },
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