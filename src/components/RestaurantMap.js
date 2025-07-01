import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function RestaurantMap({ center, restaurants }) {
  return (
    <MapContainer center={center} zoom={17} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={center}>
        <Popup>You are here</Popup>
      </Marker>

      {restaurants
        .filter((place) => place.lat && place.lon)
        .map((place) => (
          <Marker key={place.id} position={[place.lat, place.lon]}>
            <Popup>
              {place.tags?.name || "Unnamed"}<br />
              {place.tags?.amenity || ""}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

export default RestaurantMap;
