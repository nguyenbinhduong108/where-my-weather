"use client";

import React, { memo, useEffect, useMemo, useRef } from "react";
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
  setRegions?: (regionKey: string) => void;
};

// Memoized marker item: creates its icon once and attaches a click listener
const MarkerItem = memo(function MarkerItem({
  region,
  imageUrl,
  onSelect,
  regionKey,
}: {
  region: Region;
  imageUrl: string;
  onSelect?: (k: string) => void;
  regionKey: string;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  // create icon only once per marker (so re-renders won't recreate it)
  const icon = useMemo(() => {
    const delay = (Math.random() * 0.8).toFixed(2);
    return L.divIcon({
      className: "relative flex flex-col items-center group drop-pin",
      html: `
      <div style="animation-delay:${delay}s"
           class="relative flex flex-col items-center justify-start 
                  w-6 h-8 bg-blue-400 rounded-[50%_50%_50%_0] rotate-[-45deg] border-2 border-white
                  transition-all duration-500 ease-in-out overflow-hidden
                  group-hover:rotate-0 group-hover:w-52 group-hover:h-52 group-hover:rounded-xl group-hover:bg-white
                  shadow-lg drop-pin p-2"
           data-region="${region.name}">

        <div class="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs text-gray-800 transition-opacity duration-500 cursor-pointer">
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mrk = markerRef.current as unknown as L.Marker | null;
    if (!mrk) return;

    let el: HTMLElement | null = null;
    const handler = () => onSelect && onSelect(regionKey);

    const attach = () => {
      el = (mrk.getElement && (mrk.getElement() as HTMLElement)) || null;
      if (el) {
        el.addEventListener("click", handler);
      }
    };

    // Listen for when the marker is added to the map, then attach
    if (mrk.on) mrk.on("add", attach);

    // Try to attach right away in case element already exists
    attach();

    return () => {
      if (el) el.removeEventListener("click", handler);
      if (mrk.off) mrk.off("add", attach);
    };
  }, [onSelect, regionKey]);

  return (
    <Marker
      ref={markerRef}
      position={[region.lat, region.lon]}
      icon={icon}
      zIndexOffset={1000}
      eventHandlers={{
        mouseover: (e) => (e.target as L.Marker).setZIndexOffset(9999),
        mouseout: (e) => (e.target as L.Marker).setZIndexOffset(1000),
      }}
    />
  );
});

const WorldMap: React.FC<Props> = ({ regions, setRegions }) => {
  // ensure when noWrap=true we don't zoom out so far that the tile world is smaller than viewport
  const [minZoom, setMinZoom] = React.useState<number>(2);

  React.useEffect(() => {
    const calcMinZoom = () => {
      const w = window.innerWidth || document.documentElement.clientWidth || 1024;
      const h = window.innerHeight || document.documentElement.clientHeight || 768;
      // For tiles (256px) we need 256 * 2^z >= width AND >= height
      // Solve for z: z >= log2(w/256) and z >= log2(h/256) -> take max
      const zW = Math.ceil(Math.log2(Math.max(1, w / 256)));
      const zH = Math.ceil(Math.log2(Math.max(1, h / 256)));
      const z = Math.max(zW, zH);
      setMinZoom(Math.max(0, z));
    };

    calcMinZoom();
    window.addEventListener('resize', calcMinZoom);
    return () => window.removeEventListener('resize', calcMinZoom);
  }, []);

  // basemap options (you can add/remove): key -> { url, attribution }
  const basemapOptions: Record<string, { url: string; attribution: string }> = {
    positron: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; CARTO',
    },
    voyager: {
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; CARTO',
    },
    imagery: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri',
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; CARTO',
    },
    opentopo: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenTopoMap (CC-BY-SA) &copy; OpenStreetMap contributors',
    },
  };

  const [basemapKey, setBasemapKey] = React.useState<string>("imagery");
  return (
    <MapContainer
      center={[20, 0]}
      // ensure initial zoom respects calculated minZoom
      zoom={Math.max(2, minZoom)}
      minZoom={minZoom}
      // use fixed inset so map always fills viewport and isn't constrained by parent layout
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution={basemapOptions[basemapKey].attribution}
        url={basemapOptions[basemapKey].url}
        noWrap={true}
      />

      {/* basemap selector control */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2000 }}>
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
        </select>
      </div>

      {Object.entries(regions).map(([key, region]) => (
        <MarkerItem
          key={key}
          regionKey={key}
          region={region}
          imageUrl={`image/${key}.jpg`}
          onSelect={setRegions}
        />
      ))}
    </MapContainer>
  );
};

export default memo(WorldMap);
