import WorldMap from "@/components/WorldMap";
import regionsData from "@/data/regions_list.json";

export default function Home() {
  return <WorldMap regions={regionsData.regions} />;
}
