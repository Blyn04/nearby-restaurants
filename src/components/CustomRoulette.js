import React, { useState } from "react";

const CustomRoulette = () => {
  const [entries, setEntries] = useState([""]);
  const [result, setResult] = useState("");

  const handleAdd = () => {
    setEntries([...entries, ""]);
  };

  const handleChange = (i, value) => {
    const updated = [...entries];
    updated[i] = value;
    setEntries(updated);
  };

  const handleSpin = () => {
    const clean = entries.filter((e) => e.trim() !== "");
    if (clean.length === 0) return setResult("Add some places!");
    const winner = clean[Math.floor(Math.random() * clean.length)];
    setResult(`🎯 You should go to: ${winner}`);
  };

  return (
    <div
      style={{
        background: "#fffaf3",
        borderRadius: "16px",
        padding: "1.5rem",
        maxWidth: "600px",
        margin: "2rem auto",
        boxShadow: "0 8px 16px rgba(124, 81, 50, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#7c5132" }}>🎲 Custom Roulette</h2>
      {entries.map((entry, i) => (
        <input
          key={i}
          value={entry}
          onChange={(e) => handleChange(i, e.target.value)}
          placeholder={`Option ${i + 1}`}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "0.75rem",
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #c4b7a8",
            background: "#fdf9f5",
          }}
        />
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
        <button className="recenter-btn" onClick={handleAdd}>
          ➕ Add Option
        </button>
        <button className="recenter-btn" onClick={handleSpin}>
          🎯 Spin
        </button>
      </div>
      {result && (
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#7c5132", fontWeight: "bold" }}>
          {result}
        </p>
      )}
    </div>
  );
};

export default CustomRoulette;
