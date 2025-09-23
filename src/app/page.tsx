"use client";

import dynamic from "next/dynamic";
import regionsData from "@/data/regions_list.json";

const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main>
      <WorldMap regions={regionsData.regions} />
    </main>
  );
}
