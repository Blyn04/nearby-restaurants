import React, { useEffect, useState } from "react";
import "./styles/App.css";
import RestaurantList from "./components/RestaurantList";
import RestaurantMap from "./components/RestaurantMap";
import RoulettePicker from "./components/RoulettePicker";

function App() {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState("Getting your location...");
  const [selectedAmenity, setSelectedAmenity] = useState("all");
  const [recenterTrigger, setRecenterTrigger] = useState(false);

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
        setLoading("Searching nearby places...");
        fetchRestaurants(lat, lon);
      },
      (err) => {
        console.error(err);
        setLoading("Failed to get your location.");
      }
    );
  }, []);

  const handleRecenter = () => {
    setRecenterTrigger(true); // Signal map to recenter
    setTimeout(() => setRecenterTrigger(false), 100); // Reset
  };

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
        const withCoords = data.elements?.filter((el) => el.lat && el.lon) || [];
        setRestaurants(withCoords);
        setLoading(withCoords.length ? null : "No nearby food places found.");
      })
      .catch((err) => {
        console.error(err);
        setLoading("Failed to fetch data.");
      });
  };

  const filteredRestaurants = selectedAmenity === "all"
    ? restaurants
    : restaurants.filter(place => place.tags?.amenity === selectedAmenity);

  return (
    <main className="app-container">
      <header className="header">
        <img src={require("./assets/logo.png")} alt="FindFood Logo" className="logo" />
      </header>

      {loading && <p className="loading">{loading}</p>}

      {location && restaurants.length > 0 && (
        <>
          <div className="filter-container">
            <label htmlFor="amenity-select">Filter: </label>
            <select
              id="amenity-select"
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
            >
              <option value="all">🍽️ All</option>
              <option value="restaurant">🍽️ Restaurant</option>
              <option value="fast_food">🍔 Fast Food</option>
              <option value="cafe">☕ Café</option>
              <option value="ice_cream">🍦 Ice Cream</option>
              <option value="food_court">🍛 Food Court</option>
            </select>

            <button onClick={handleRecenter} className="recenter-btn">
              📍 Recenter to My Location
            </button>
          </div>

          <RoulettePicker restaurants={restaurants} />
          <RestaurantMap
            center={[location.lat, location.lon]}
            restaurants={filteredRestaurants}
            recenter={recenterTrigger}
          />
          <RestaurantList restaurants={filteredRestaurants} />
        </>
      )}
    </main>
  );
}

export default App;
