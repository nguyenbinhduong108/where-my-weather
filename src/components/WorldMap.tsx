"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "@/styles/animations.css";

type Region = {
  name: string;
  lat: number;
  lon: number;
  continent: string;
};

type Props = {
  regions: Record<string, Region>;
};

const createCustomIcon = (region: Region, imageUrl: string) => {
  const delay = (Math.random() * 0.8).toFixed(2); // random 0 → 0.8s
  return L.divIcon({
    className: "relative flex flex-col items-center group drop-pin",
    html: `
      <div style="animation-delay:${delay}s"
          class="relative flex flex-col items-center justify-start 
                  w-6 h-8 bg-red-500 rounded-[50%_50%_50%_0] rotate-[-45deg] border-2 border-white
                  transition-all duration-500 ease-in-out overflow-hidden
                  group-hover:rotate-0 group-hover:w-52 group-hover:h-52 group-hover:rounded-xl group-hover:bg-white
                  shadow-lg drop-pin p-2">
        
        <!-- Container ảnh cố định -->
        <div class="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs text-gray-800 transition-opacity duration-500">
          <strong>${region.name}</strong> (${region.continent})
        </div>
        <div class="w-full h-32 overflow-hidden rounded-lg">
          <img src="${imageUrl}" alt="preview"
              class="opacity-0 group-hover:opacity-100 !w-full h-full object-cover transition-opacity duration-500"/>
        </div>

        <div class="text-gray-800 pt-2">X: ${region.lon} Y: ${region.lat}</div>

        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 
                    w-4 h-4 bg-white rotate-45 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-500 border-l border-b"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};


export default function WorldMap({ regions }: Props) {

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Object.entries(regions).map(([key, region]) => (
        <Marker
          key={region.name}
          position={[region.lat, region.lon]}
          icon={createCustomIcon(region,`image/${key}.jpg`)}
          zIndexOffset={1000}
          eventHandlers={{
            mouseover: (e) => {
              (e.target as L.Marker).setZIndexOffset(9999);
            },
            mouseout: (e) => {
              (e.target as L.Marker).setZIndexOffset(1000);
            },
          }}
        />
      ))}
    </MapContainer>
  );
}
