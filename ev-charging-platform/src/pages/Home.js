import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to EV Charging Platform</h1>
      <p>Analyze and locate the best charging stations.</p>
      <div className="mt-4">
        <Link to="/map" className="bg-blue-500 text-white px-4 py-2 rounded">View Map</Link>
      </div>
    </div>
  );
};

export default Home;
