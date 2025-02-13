import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>EV Charging Placement in London</h1>
      <p>
        London is the starting city for our project, analyzing optimal locations 
        for EV charging stations using AI and real-time data insights.
      </p>
      <Link to="/visualization">
        <button className="home-button">Explore London's Charging Map</button>
      </Link>
    </div>
  );
};

export default Home;
