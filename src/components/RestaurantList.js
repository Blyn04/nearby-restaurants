import React from "react";

function RestaurantList({ restaurants }) {
  if (!restaurants.length) return null;

  return (
    <ul>
      {restaurants.map((r) => (
        <li key={r.id}>{r.tags?.name || "Unnamed Restaurant"}</li>
      ))}
    </ul>
  );
}

export default RestaurantList;
