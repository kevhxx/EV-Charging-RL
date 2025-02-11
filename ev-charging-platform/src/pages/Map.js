import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import stations from "../data/stations";

const Map = () => {
  return (
    <div className="h-screen">
      <MapContainer center={[51.5074, -0.1278]} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {stations.map((station, index) => (
          <Marker key={index} position={[station.lat, station.lng]}>
            <Popup>
              <strong>{station.name}</strong>
              <br />
              Type: {station.type}
              <br />
              Power: {station.power} kW
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;