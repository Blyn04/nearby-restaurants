import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet's default marker icon issue in React
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function RestaurantMap({ center, restaurants }) {
  return (
    <MapContainer center={center} zoom={16} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />
      {restaurants.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lon]}
        >
          <Popup>
            {place.tags?.name || "Unnamed"}<br />
            {place.tags?.brand || ""}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default RestaurantMap;
