'use client';

import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface PrecipitationChartProps {
  dates: string[];
  precipitation: number[];
}

export default function PrecipitationChart({
  dates,
  precipitation,
}: PrecipitationChartProps) {
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

    // Debug log
    console.log('Precipitation data:', precipitation);
    console.log('Dates length:', dates.length);
    console.log('Precipitation length:', precipitation.length);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: dates.map(date => {
          const d = new Date(date);
          return d.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: 'Lượng mưa (mm)',
            data: precipitation,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Biểu đồ Lượng mưa',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Lượng mưa: ${context.parsed.y} mm`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Lượng mưa (mm)',
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
  }, [dates, precipitation]);

  return (
    <div className="w-full h-64 md:h-80 p-4 bg-white rounded-lg shadow">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
