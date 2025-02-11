import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Ensure Home.js has default export
import Stations from "./pages/Stations"; // Ensure Stations.js has default export
import Analytics from "./pages/Analytics"; // Ensure Analytics.js has default export
import Navbar from "./components/Navbar"; // Ensure Navbar.js has default export
import "tailwindcss/tailwind.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Make sure App.js has a default export
