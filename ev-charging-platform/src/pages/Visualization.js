import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/visualization.css";

const Visualization = () => {
  const mapContainer = useRef(null); // Create a ref to track the map div
  const mapInstance = useRef(null); // Keep track of Leaflet instance

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      // Initialize Leaflet map
      mapInstance.current = L.map(mapContainer.current).setView([51.5103, -0.1153], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(mapInstance.current);

      // Sample Charging Station Data
      const stations = [
        { lat: 51.515, lng: -0.09, type: "Regular", name: "Station A" },
        { lat: 51.52, lng: -0.1, type: "Super", name: "Station B" }
      ];

      stations.forEach(station => {
        L.marker([station.lat, station.lng])
          .bindPopup(`<strong>${station.name}</strong><br>Type: ${station.type}`)
          .addTo(mapInstance.current);
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove(); // Cleanup map on unmount
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapContainer} id="map" className="map-container"></div>;
};

export default Visualization;
