import React from "react";
import "../styles/RestaurantList.css";

function RestaurantList({ restaurants }) {
  if (!restaurants.length) return null;

  return (
    <div className="list-container">
      {restaurants.map((r) => (
        <div key={r.id} className="restaurant-card">
          <h3>{r.tags?.name || "Unnamed Place"}</h3>
          <p>{r.tags?.amenity}</p>
          
        </div>
      ))}
    </div>
  );
}

export default RestaurantList;
