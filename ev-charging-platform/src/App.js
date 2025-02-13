import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BackgroundVideo from "./components/BackgroundVideo";
import Home from "./pages/Home";
import Technology from "./pages/Technology";
import Visualization from "./pages/Visualization";
import AIModel from "./pages/AIModel";
import Contact from "./pages/Contact";
import "./styles/global.css";

function App() {
  // Set London as the default video
  const [videoSource, setVideoSource] = useState("/videos/london.mp4");

  return (
    <Router>
      <Navbar setVideoSource={setVideoSource} />
      <BackgroundVideo videoSource={videoSource} />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/visualization" element={<Visualization />} />
          <Route path="/ai-model" element={<AIModel />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
