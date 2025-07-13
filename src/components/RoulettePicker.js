import React, { useState } from "react";
import "../styles/RoulettePicker.css";

function RoulettePicker({ restaurants, useCustomRoulette, setUseCustomRoulette }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [picked, setPicked] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [customEntries, setCustomEntries] = useState([""]);
  const [customResult, setCustomResult] = useState("");

  const categories = [
    { value: "all", label: "🍽️ All" },
    { value: "restaurant", label: "🍽️ Restaurant" },
    { value: "fast_food", label: "🍔 Fast Food" },
    { value: "cafe", label: "☕ Café" },
    { value: "ice_cream", label: "🍦 Ice Cream" },
    { value: "food_court", label: "🍛 Food Court" },
  ];

  const filtered =
    selectedCategory === "all"
      ? restaurants
      : restaurants.filter((r) => r.tags?.amenity === selectedCategory);

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

  const handleAddEntry = () => {
    setCustomEntries([...customEntries, ""]);
  };

  const handleChangeEntry = (i, value) => {
    const updated = [...customEntries];
    updated[i] = value;
    setCustomEntries(updated);
  };

  const handleCustomSpin = () => {
    const clean = customEntries.filter((e) => e.trim() !== "");
    if (clean.length === 0) return setCustomResult("Add some places!");
    const winner = clean[Math.floor(Math.random() * clean.length)];
    setCustomResult(`You should go to: ${winner}`);
  };

  return (
    <div className="roulette-container side-layout">
      <div className="roulette-controls">
        <div className="roulette-header">
          <button className="spin-button toggle-btn" onClick={() => setUseCustomRoulette(!useCustomRoulette)}>
            {useCustomRoulette ? "Use Nearby Roulette" : "Use Custom Roulette"}
          </button>
          <h2>{useCustomRoulette ? "🎲 Custom Roulette" : "🎯 Food Roulette"}</h2>
        </div>

        {!useCustomRoulette ? (
          <>
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <button onClick={spinRoulette} className="spin-button" disabled={spinning}>
              {spinning ? "Spinning..." : "🎲 Spin"}
            </button>

            {!spinning && filtered.length === 0 && (
              <p className="empty-msg">No places found in this category.</p>
            )}
          </>
        ) : (
          <>
            {customEntries.map((entry, i) => (
              <input
                key={i}
                value={entry}
                onChange={(e) => handleChangeEntry(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                style={{
                  display: "block",
                  width: "60%",
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "1px solid #c4b7a8",
                  background: "#fdf9f5",
                }}
              />
            ))}
            <div className="custom-btn-group">
              <button className="custom-btn" onClick={handleAddEntry}>
                ➕ Add Option
              </button>
              <button className="custom-btn" onClick={handleCustomSpin}>
                🎯 Spin
              </button>
            </div>
          </>
        )}
      </div>

      <div className="result-card side-result">
        {useCustomRoulette ? (
          <p style={{ color: "#7c5132", fontWeight: "bold" }}>
            {customResult || "Add entries and spin"}
          </p>
        ) : picked ? (
          <>
            <h3>{picked.tags?.name || "Unnamed Place"}</h3>
            <p>{picked.tags?.amenity}</p>
            {picked.tags?.opening_hours && <p>🕒 {picked.tags.opening_hours}</p>}
          </>
        ) : (
          <p style={{ color: "#9c7e6b", fontStyle: "italic" }}>No selection yet</p>
        )}
      </div>
    </div>
  );
}

export default RoulettePicker;
