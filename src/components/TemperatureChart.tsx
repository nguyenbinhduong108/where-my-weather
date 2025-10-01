'use client';

import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface TemperatureChartProps {
  dates: string[];
  temperatures: number[];
  temperatureMax: number[];
  temperatureMin: number[];
}

export default function TemperatureChart({
  dates,
  temperatures,
  temperatureMax,
  temperatureMin,
}: TemperatureChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
        type: 'line',
        data: {
          labels: dates.map(date => new Date(date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })),
          datasets: [
            // max line (used as reference for band)
            {
              label: 'Nhiệt độ cao nhất (°C)',
              data: temperatureMax,
              borderColor: 'rgba(239, 68, 68, 0.6)',
              backgroundColor: 'rgba(239, 68, 68, 0.06)',
              pointRadius: 0,
              borderWidth: 1,
              tension: 0.3,
              fill: false,
            },
            // min line, fill to previous (max) -> creates shaded band between max and min
            {
              label: 'Nhiệt độ thấp nhất (°C)',
              data: temperatureMin,
              borderColor: 'rgba(34, 197, 94, 0.6)',
              backgroundColor: 'rgba(34, 197, 94, 0.06)',
              pointRadius: 0,
              borderWidth: 1,
              tension: 0.3,
              fill: '-1',
              // subtle dashed for min/max outlines
              borderDash: [4, 4],
            },
            // average line on top
            {
              label: 'Nhiệt độ TB (°C)',
              data: temperatures,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: false,
            },
          ],
        },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Biểu đồ Nhiệt độ',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                boxWidth: 12,
              },
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  const v = context.raw as number | null;
                  if (v === null || v === undefined) return '';
                  return `${context.dataset.label}: ${v} °C`;
                }
              }
            },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Nhiệt độ (°C)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Ngày',
            },
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [dates, temperatures, temperatureMax, temperatureMin]);

  return (
    <div className="w-full h-64 md:h-80 p-4 bg-white rounded-lg shadow">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
