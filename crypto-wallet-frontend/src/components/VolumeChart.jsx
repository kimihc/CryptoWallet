import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  BarElement,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LinearScale,
  TimeScale,
  BarElement,
  Tooltip
);

const VolumeChart = ({ data = [], theme = 'dark', height = 250 }) => {

  const currentColors = colors[theme] || colors.dark;

  const chartData = useMemo(() => ({
    datasets: [{
      label: 'Volume',
      data: data.map(item => ({
        x: new Date(item.date),
        y: item.volume,
        priceChange: (item.close || 0) - (item.open || 0)
      })),
      backgroundColor: (ctx) => {
        const priceChange = ctx.raw?.priceChange || 0;
        return priceChange >= 0 ? currentColors.up : currentColors.down;
      },
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 2,
      barPercentage: 0.8,
      categoryPercentage: 0.9
    }]
  }), [data, currentColors]);

  const timeUnit = useMemo(() => {
    if (!data || data.length < 2) return 'day';
    const diff = new Date(data[data.length - 1].date) - new Date(data[0].date);
    const days = diff / (1000 * 60 * 60 * 24);
    
    if (days <= 1) return 'hour';
    if (days <= 7) return 'day';
    if (days <= 30) return 'week';
    return 'month';
  }, [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: currentColors.tooltipBg,
        borderColor: currentColors.border,
        borderWidth: 1,
        bodyColor: currentColors.text,
        padding: 8,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            if (value >= 1000000000) {
              return `Volume: $${(value/1000000000).toFixed(2)}B`;
            }
            if (value >= 1000000) {
              return `Volume: $${(value/1000000).toFixed(2)}M`;
            }
            return `Volume: $${value.toLocaleString()}`;
          },
          title: (items) => {
            const date = new Date(items[0].parsed.x);
            return date.toLocaleString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeUnit,
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy'
          }
        },
        grid: {
          color: currentColors.grid,
          drawOnChartArea: false,
          drawTicks: false
        },
        ticks: {
          color: currentColors.text,
          maxRotation: 0,
          autoSkip: true,
          padding: 4
        },
        border: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: currentColors.grid,
          drawOnChartArea: true,
          drawTicks: false
        },
        ticks: {
          color: currentColors.text,
          padding: 8,
          callback: (value) => {
            if (value >= 1000000000) return `$${(value/1000000000).toFixed(1)}B`;
            if (value >= 1000000) return `$${(value/1000000).toFixed(1)}M`;
            return `$${value}`;
          }
        },
        border: {
          display: false
        }
      }
    }
  }), [currentColors, timeUnit]);

  return (
    <div style={{ 
      height: `${height}px`,
      position: 'relative',
      background: currentColors.background,
      borderRadius: '8px',
      border: `1px solid ${currentColors.border}`,
      overflow: 'hidden'
    }}>
      <Bar 
        data={chartData} 
        options={options} 
        redraw={true} 
      />
    </div>
  );
};

export default VolumeChart;