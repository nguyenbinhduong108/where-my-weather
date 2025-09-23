"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useCallback } from "react";

// Fix default icon
import "leaflet/dist/images/marker-shadow.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";

const customIcon = new L.Icon({
  iconUrl: (typeof iconUrl === "string" ? iconUrl : iconUrl.src),
  shadowUrl: "leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Region = {
  name: string;
  lat: number;
  lon: number;
  continent: string;
};

type Props = {
  regions: Record<string, Region>;
};

export default function WorldMap({ regions }: Props) {
  const handleMarkerClick = useCallback((region: Region) => {
    console.log("Clicked region:", region);
  }, []);

  return (
    <MapContainer
      center={[20, 0]} // trung tâm thế giới
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Object.values(regions).map((region) => (
        <Marker
          key={region.name}
          position={[region.lat, region.lon]}
          icon={customIcon}
          eventHandlers={{
            click: () => handleMarkerClick(region),
          }}
        >
          <Popup>
            <strong>{region.name}</strong> <br />
            {region.continent} <br />
            ({region.lat}, {region.lon})
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
