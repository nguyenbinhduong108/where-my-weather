"use client";

import dynamic from "next/dynamic";
import regionsData from "@/data/regions_list.json";
import { useEffect, useState } from "react";
import { WeatherBody } from "@/params";
import { WeatherInfo } from "@/models/weather";
import WeatherDrawer from "@/components/WeatherDrawer";
import HumidityChart from "@/components/HumidityChart";
import PrecipitationChart from "@/components/PrecipitationChart";
import TemperatureChart from "@/components/TemperatureChart";

const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
});

export default function HomePage() {
  const [regions, setRegions] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);

  const getWeatherData = async (region: string, startdate?: string, enddate?: string) => {
    if (!region) return;
    try {
      const param: WeatherBody = {
        region_name: region,
        startdate: startdate ?? "2025-09-01",
        enddate: enddate ?? "2025-09-20",
      };

      const res = await fetch('/api/weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(param),
      });

      if (!res.ok) {
        console.error('Server /api/weather returned', res.status);
        return;
      }

      const data: WeatherInfo = await res.json();
      console.log('Weather data:', data);
      setWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather', error);
    }
  };

  useEffect(() => {
    console.log("Selected region key:", regions);
    if (regions) {
      // open drawer immediately and clear previous data so skeletons show
      setWeatherData(null);
      setDrawerOpen(true);
      getWeatherData(regions);
    }
  }, [regions]);

  return (
    <main>
      <WorldMap regions={regionsData.regions} setRegions={setRegions} />

      {drawerOpen && (
        <WeatherDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onMonthSelect={(start, end) => {
            // when month picked, fetch with those dates
            setWeatherData(null);
            getWeatherData(regions, start, end);
          }}
            title={
              weatherData
                ? `Weather: ${
                    (regions && (regionsData.regions as any)[regions]?.name) || ((weatherData as any).region_name || "")
                  }`
                : "Weather"
            }
        >
          {weatherData ? (
            <div className="gap-4 md:gap-8 grid grid-cols-1 ">
              {/* Render weather data here */}
              <HumidityChart dates={weatherData.dates} humidity={weatherData.humidity} />
              <PrecipitationChart dates={weatherData.dates} precipitation={weatherData.precipitation} />
              <TemperatureChart 
                dates={weatherData.dates} 
                temperatures={weatherData.temperatures}
                temperatureMax={weatherData.temperature_max} 
                temperatureMin={weatherData.temperature_min} />
              {/* <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(weatherData, null, 2)}</pre> */}
            </div>
          ) : (
            <div className="space-y-4">
              <section className="p-4 bg-white rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
              </section>

              <div className="grid grid-cols-1 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-full h-80 p-4 bg-white rounded-lg shadow animate-pulse" />
                ))}
              </div>
            </div>
          )}
        </WeatherDrawer>
      )}
    </main>
  );
}
