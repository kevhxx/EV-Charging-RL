import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = ({ setVideoSource }) => {
  return (
    <nav className="navbar">
      <h1 className="logo">EV Charging - London</h1> {/* Updated title to reflect London */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/technology">Technology</Link>
        <Link to="/visualization">Map</Link>
        <Link to="/ai-model">AI Model</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="city-selector">
        <select onChange={(e) => setVideoSource(e.target.value)} defaultValue="/videos/london.mp4">
          <option value="/videos/london.mp4">London (Default)</option>
          <option value="/videos/newyork.mp4">New York</option>
          <option value="/videos/losangeles.mp4">Los Angeles</option>
          <option value="/videos/hongkong.mp4">Hong Kong</option>
          <option value="/videos/singapore.mp4">Singapore</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
