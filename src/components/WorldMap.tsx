"use client";

import React, { memo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "@/styles/animations.css";
import MarkerItem from "./MarkerItem";

type Region = {
  name: string;
  lat: number;
  lon: number;
  continent: string;
};

type Props = {
  regions: Record<string, Region>;
  setRegions?: (regionKey: string) => void;
};

const WorldMap: React.FC<Props> = ({ regions, setRegions }) => {
  const [minZoom, setMinZoom] = React.useState<number>(2);
  const [mapInstance, setMapInstance] = React.useState<L.Map | null>(null);

  React.useEffect(() => {
    const calcMinZoom = () => {
      const w =
        window.innerWidth || document.documentElement.clientWidth || 1024;
      const h =
        window.innerHeight || document.documentElement.clientHeight || 768;
      const tileSize = 256;
      const zW = Math.ceil(Math.log2(Math.max(1, w / tileSize)));
      const zH = Math.ceil(Math.log2(Math.max(1, h / tileSize)));
      const z = Math.max(zW, zH);
      setMinZoom(Math.max(0, z));
    };

    calcMinZoom();
    window.addEventListener("resize", calcMinZoom);
    return () => window.removeEventListener("resize", calcMinZoom);
  }, []);

  React.useEffect(() => {
    if (!mapInstance) return;
    try {
      const bounds = L.latLngBounds([
        [-85, -180],
        [85, 180],
      ]);
      mapInstance.setMaxBounds(bounds);
      if ((mapInstance as any).setMinZoom)
        (mapInstance as any).setMinZoom(minZoom);
      const desired = Math.max(2, minZoom);
      if (mapInstance.getZoom() < desired) mapInstance.setZoom(desired);
    } catch {}
  }, [mapInstance, minZoom]);

  const basemapOptions: Record<string, { url: string; attribution: string }> = {
    positron: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; CARTO',
    },
    voyager: {
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; CARTO',
    },
    imagery: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri",
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; CARTO',
    },
    opentopo: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution:
        "&copy; OpenTopoMap (CC-BY-SA) &copy; OpenStreetMap contributors",
    },
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
    },
    transport: {
      url: "https://tile.memomaps.de/tilegen/{z}/{x}/{y}.png",
      attribution:
        "Map data &copy; OpenStreetMap contributors | <a href='https://memomaps.de/'>memomaps.de</a>",
    },
    cyclOSM: {
      url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      attribution: "Map data &copy; OpenStreetMap contributors | CyclOSM",
    },
    usgsTopo: {
      url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles courtesy of <a href='https://www.usgs.gov/'>U.S. Geological Survey</a>",
    },
    usgsImagery: {
      url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Imagery courtesy of <a href='https://www.usgs.gov/'>U.S. Geological Survey</a>",
    },
    usgsImageryTopo: {
      url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Imagery & Topo courtesy of <a href='https://www.usgs.gov/'>U.S. Geological Survey</a>",
    },
    usgsRelief: {
      url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Shaded Relief courtesy of <a href='https://www.usgs.gov/'>U.S. Geological Survey</a>",
    },
  };

  const [basemapKey, setBasemapKey] = React.useState<string>("imagery");

  function MapInitializer({ onMap }: { onMap: (m: L.Map) => void }) {
    const map = useMap();
    React.useEffect(() => {
      onMap(map);
    }, [map, onMap]);
    return null;
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={Math.max(2, minZoom)}
      minZoom={minZoom}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
      }}
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
      maxBoundsViscosity={1.0}
      attributionControl={false} 
      zoomAnimation={true}
    >
      <MapInitializer onMap={(m) => setMapInstance(m)} />
      <TileLayer
        attribution={basemapOptions[basemapKey].attribution}
        url={basemapOptions[basemapKey].url}
        noWrap={true}
      />

      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2000 }}>
        <select
          value={basemapKey}
          onChange={(e) => setBasemapKey(e.target.value)}
          className="px-2 py-1 rounded bg-white text-black shadow"
        >
          <option value="imagery">Esri Imagery</option>
          <option value="positron">Positron (clean)</option>
          <option value="voyager">Voyager</option>
          <option value="dark">Carto Dark</option>
          <option value="opentopo">OpenTopoMap</option>
          <option value="osm">OpenStreetMap</option>
          <option value="transport">Public Transport</option>
          <option value="cyclOSM">CyclOSM (cycling map)</option>
          <option value="usgsTopo">USGS Topographic</option>
          <option value="usgsImagery">USGS Imagery Only</option>
          <option value="usgsImageryTopo">USGS Imagery + Topo</option>
          <option value="usgsRelief">USGS Shaded Relief</option>
        </select>
      </div>

      {Object.entries(regions).map(([key, region]) => (
        <MarkerItem
          key={key}
          regionKey={key}
          region={region}
          imageUrl={`image/${key}.jpg`}
          onSelect={setRegions}
          mapInstance={mapInstance} // 👈 truyền map xuống
        />
      ))}
    </MapContainer>
  );
};

export default memo(WorldMap);
