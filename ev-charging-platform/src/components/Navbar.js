import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <a href="/" className="text-lg font-bold">EV Charging</a>
      <div>
        <a href="/stations" className="px-4">Stations</a>
        <a href="/analytics" className="px-4">Analytics</a>
      </div>
    </nav>
  );
};

export default Navbar; // Make sure this is present!
