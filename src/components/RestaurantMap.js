import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/RestaurantMap.css";

// Set default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const userIcon = new L.Icon({
  iconUrl: require("../assets/userlocation.png"),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

// Recenter logic
function RecenterMap({ center, trigger }) {
  const map = useMap();

  useEffect(() => {
    if (trigger && center) {
      map.setView(center, 17); // Adjust zoom as needed
    }
  }, [trigger, center, map]);

  return null;
}

function RestaurantMap({ center, restaurants, recenter }) {
  return (
    <MapContainer center={center} zoom={17} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap center={center} trigger={recenter} />

      <Marker position={center} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {restaurants
        .filter((place) => place.lat && place.lon)
        .map((place) => (
          <Marker key={place.id} position={[place.lat, place.lon]}>
            <Popup>
              <strong>{place.tags?.name || "Unnamed"}</strong>
              <br />
              {place.tags?.amenity || ""}
              <br />
              {place.tags?.opening_hours
                ? `🕒 Open: ${place.tags.opening_hours}`
                : "🕒 Hours not listed"}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

export default RestaurantMap;
