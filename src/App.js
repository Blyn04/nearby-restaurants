import React, { useEffect, useState } from "react";
import "./styles/App.css";
import RestaurantList from "./components/RestaurantList";
import RestaurantMap from "./components/RestaurantMap";

function App() {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState("Getting your location...");

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
        setLoading("Searching for nearby restaurants...");
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
      );
      out;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.elements.length === 0) {
          setLoading("No restaurants found nearby.");
        } else {
          setRestaurants(data.elements);
          setLoading(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading("Failed to fetch restaurant data.");
      });
  };

  return (
    <div>
      <h1>Nearby Restaurants</h1>
      {loading && <p>{loading}</p>}
      {location && restaurants.length > 0 && (
        <>
          <RestaurantMap center={[location.lat, location.lon]} restaurants={restaurants} />
          <RestaurantList restaurants={restaurants} />
        </>
      )}
    </div>
  );
}

export default App;
