import React, { useState } from "react";
import "../styles/RoulettePicker.css";

function RoulettePicker({ restaurants }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [picked, setPicked] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const categories = [
    { value: "all", label: "🍽️ All" },
    { value: "restaurant", label: "🍽️ Restaurant" },
    { value: "fast_food", label: "🍔 Fast Food" },
    { value: "cafe", label: "☕ Café" },
    { value: "ice_cream", label: "🍦 Ice Cream" },
    { value: "food_court", label: "🍛 Food Court" },
  ];

  const filtered = selectedCategory === "all"
    ? restaurants
    : restaurants.filter(r => r.tags?.amenity === selectedCategory);

  const spinRoulette = () => {
    if (filtered.length === 0) {
      setPicked(null);
      return;
    }

    setSpinning(true);
    setPicked(null);

    setTimeout(() => {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setPicked(random);
      setSpinning(false);
    }, 1500);
  };

  return (
    <div className="roulette-container">
      <h2>🎯 Food Roulette</h2>

      <select
        className="category-select"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <button onClick={spinRoulette} className="spin-button" disabled={spinning}>
        {spinning ? "Spinning..." : "🎲 Spin"}
      </button>

      {picked && (
        <div className="result-card">
          <h3>{picked.tags?.name || "Unnamed Place"}</h3>
          <p>{picked.tags?.amenity}</p>
          {picked.tags?.opening_hours && <p>🕒 {picked.tags.opening_hours}</p>}
        </div>
      )}

      {!spinning && filtered.length === 0 && (
        <p className="empty-msg">No places found in this category.</p>
      )}
    </div>
  );
}

export default RoulettePicker;
