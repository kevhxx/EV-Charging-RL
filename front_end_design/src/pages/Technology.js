import React from "react";
import "../styles/technology.css";


const Technology = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Technology Stack & Data Integration</h1>
      <ul className="mt-4 space-y-2">
        <li>📍 <strong>Existing Charging Stations (Open Charge Map)</strong> – Provides real-time station data.</li>
        <li>🚦 <strong>Traffic Patterns (GB Road Traffic, TFL Data)</strong> – Analyzing congestion and travel demand.</li>
        <li>🏡 <strong>Demographics & Housing Prices</strong> – Understanding residential charging needs.</li>
        <li>⚡ <strong>Energy Grid Constraints</strong> – Ensuring grid support for new stations.</li>
        <li>📈 <strong>EV Adoption & Demand Forecasts</strong> – Predicting future growth.</li>
      </ul>
    </div>
  );
};

export default Technology;
