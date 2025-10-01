'use client';

import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface HumidityChartProps {
  dates: string[];
  humidity: number[];
}

export default function HumidityChart({
  dates,
  humidity,
}: HumidityChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Kiểm tra data có hợp lệ không
    if (!dates || !humidity || dates.length === 0 || humidity.length === 0) {
      console.warn('Missing or empty data for HumidityChart');
      return;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: dates.map(date => {
          const d = new Date(date);
          return d.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: 'Độ ẩm (%)',
            data: humidity,
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgb(34, 197, 94)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Biểu đồ Độ ẩm',
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
                return `Độ ẩm: ${context.parsed.y}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 0,
            max: 100,
            title: {
              display: true,
              text: 'Độ ẩm (%)',
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
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
  }, [dates, humidity]);

  return (
    <div className="w-full h-64 md:h-80 p-4 bg-white rounded-lg shadow">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}