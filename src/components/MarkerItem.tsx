"use client";

import React, { memo, useEffect, useMemo, useRef } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

type Region = {
  name: string;
  lat: number;
  lon: number;
  continent: string;
};

const MarkerItem = memo(function MarkerItem({
  region,
  imageUrl,
  onSelect,
  regionKey,
  mapInstance,
}: {
  region: Region;
  imageUrl: string;
  onSelect?: (k: string) => void;
  regionKey: string;
  mapInstance: L.Map | null;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  // giữ nguyên icon + animation cũ của bạn
  const icon = useMemo(() => {
    const delay = (Math.random() * 0.8).toFixed(2);
    return L.divIcon({
      className: "relative flex flex-col items-center group drop-pin",
      html: `
        <div style="animation-delay:${delay}s"
             class="marker-box relative flex flex-col items-center justify-start 
                    w-6 h-8 bg-blue-400 rounded-[50%_50%_50%_0] rotate-[-45deg] border-2 border-white
                    transition-all duration-500 ease-in-out overflow-hidden
                    group-hover:rotate-0 group-hover:w-52 group-hover:h-52 group-hover:rounded-xl group-hover:bg-white
                    shadow-lg drop-pin p-2"
             data-region="${region.name}">

          <div class="info opacity-0 group-hover:opacity-100 px-2 py-1 text-xs text-gray-800 transition-opacity duration-500 cursor-pointer">
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
  }, [region.name, region.continent, region.lon, region.lat, imageUrl]);

  // xử lý flip khi gần mép - CHỈ khi hover
  useEffect(() => {
    if (!mapInstance || !markerRef.current) return;
    const marker = markerRef.current;
    const el = marker.getElement() as HTMLElement;
    if (!el) return;

    const markerBox = el.querySelector('.marker-box') as HTMLElement;
    if (!markerBox) return;

    let isHovering = false;

    const checkFlip = () => {
      if (!isHovering) return;

      const mapSize = mapInstance.getSize();
      const pos = mapInstance.latLngToContainerPoint(marker.getLatLng());

      markerBox.classList.remove("flip-x", "flip-y");

      // Kiểm tra gần mép phải
      if (pos.x > mapSize.x - 260) {
        markerBox.classList.add("flip-x");
      }
      // Kiểm tra gần mép dưới
      if (pos.y > mapSize.y - 260) {
        markerBox.classList.add("flip-y");
      }
    };

    const onMouseEnter = () => {
      isHovering = true;
      checkFlip();
    };

    const onMouseLeave = () => {
      isHovering = false;
      markerBox.classList.remove("flip-x", "flip-y");
    };

    markerBox.addEventListener('mouseenter', onMouseEnter);
    markerBox.addEventListener('mouseleave', onMouseLeave);

    return () => {
      markerBox.removeEventListener('mouseenter', onMouseEnter);
      markerBox.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [mapInstance]);

  // giữ nguyên click select cũ
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

    if (mrk.on) mrk.on("add", attach);
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
}, (prev, next) => {
  // Chỉ re-render khi data thực sự thay đổi
  return prev.regionKey === next.regionKey &&
         prev.region.lat === next.region.lat &&
         prev.region.lon === next.region.lon &&
         prev.imageUrl === next.imageUrl;
});

export default MarkerItem;
