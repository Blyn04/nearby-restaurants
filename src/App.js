import React, { useEffect, useState } from "react";
import "./styles/App.css";
import RestaurantList from "./components/RestaurantList";
import RestaurantMap from "./components/RestaurantMap";

function App() {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState("Getting your location...");
  const [selectedAmenity, setSelectedAmenity] = useState("all");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLocation({ lat, lon });
        setLoading("Searching for nearby food places...");
        fetchRestaurants(lat, lon);
      },
      (err) => {
        console.error(err);
        setLoading("Failed to get your location.");
      }
    );
  }, []);

  const fetchRestaurants = (lat, lon) => {
    const query = `
      [out:json];
      (
        node["amenity"="restaurant"](around:500,${lat},${lon});
        node["amenity"="fast_food"](around:500,${lat},${lon});
        node["amenity"="cafe"](around:500,${lat},${lon});
        node["amenity"="ice_cream"](around:500,${lat},${lon});
        node["amenity"="food_court"](around:500,${lat},${lon});
      );
      out;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!data.elements || data.elements.length === 0) {
          setLoading("No food-related places found nearby.");
        } else {
          const withCoords = data.elements.filter((el) => el.lat && el.lon);
          setRestaurants(withCoords);
          setLoading(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading("Failed to fetch data.");
      });
  };

  const handleAmenityChange = (e) => {
    setSelectedAmenity(e.target.value);
  };

  const filteredRestaurants = selectedAmenity === "all"
    ? restaurants
    : restaurants.filter(
        (place) => place.tags?.amenity === selectedAmenity
      );

  return (
    <div>
      <h1>Nearby Food Places</h1>

      {loading && <p>{loading}</p>}

      {location && restaurants.length > 0 && (
        <>
          {/* 🔽 Filter Dropdown */}
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="amenity-select">Filter by type: </label>
            <select id="amenity-select" value={selectedAmenity} onChange={handleAmenityChange}>
              <option value="all">🍽️ All</option>
              <option value="restaurant">🍽️ Restaurant</option>
              <option value="fast_food">🍔 Fast Food</option>
              <option value="cafe">☕ Café</option>
              <option value="ice_cream">🍦 Ice Cream</option>
              <option value="food_court">🍛 Food Court</option>
            </select>
          </div>

          <RestaurantMap center={[location.lat, location.lon]} restaurants={filteredRestaurants} />
          <RestaurantList restaurants={filteredRestaurants} />
        </>
      )}
    </div>
  );
}

export default App;
