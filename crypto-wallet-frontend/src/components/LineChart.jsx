import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const LineChart = ({ data = [], theme = 'dark', height = 500 }) => {
  const colors = {
    dark: {
      line: '#3a86ff',
      area: 'rgba(58, 134, 255, 0.2)',
      grid: 'rgba(255, 255, 255, 0.1)',
      text: 'rgba(255, 255, 255, 0.7)',
      tooltipBg: 'rgba(30, 30, 30, 0.9)',
      border: 'rgba(255, 255, 255, 0.1)'
    },
    light: {
      line: '#3a86ff',
      area: 'rgba(58, 134, 255, 0.2)',
      grid: 'rgba(0, 0, 0, 0.1)',
      text: 'rgba(0, 0, 0, 0.7)',
      tooltipBg: 'rgba(255, 255, 255, 0.9)',
      border: 'rgba(0, 0, 0, 0.1)'
    }
  };

  const currentColors = colors[theme] || colors.dark;

  const chartData = {
    datasets: [{
      label: 'Price',
      data: data.map(item => ({
        x: new Date(item.date),
        y: item.price
      })),
      borderColor: currentColors.line,
      backgroundColor: currentColors.area,
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointBackgroundColor: currentColors.line
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: currentColors.tooltipBg,
        borderColor: currentColors.line,
        borderWidth: 1,
        bodyColor: currentColors.text,
        titleColor: currentColors.text,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return `$${context.parsed.y.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            })}`;
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
          unit: autoDetermineTimeUnit(data),
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM d',
            week: 'MMM d',
            month: 'MMM yyyy'
          }
        },
        grid: {
          color: currentColors.grid,
          drawOnChartArea: true,
          drawTicks: false
        },
        ticks: {
          color: currentColors.text,
          maxRotation: 0,
          autoSkip: true,
          padding: 8
        },
        border: {
          color: currentColors.border
        }
      },
      y: {
        position: 'right',
        grid: {
          color: currentColors.grid,
          drawOnChartArea: true,
          drawTicks: false
        },
        ticks: {
          color: currentColors.text,
          padding: 8,
          callback: (value) => {
            return `$${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8
            })}`;
          }
        },
        border: {
          color: currentColors.border
        }
      }
    },
    elements: {
      line: {
        cubicInterpolationMode: 'monotone'
      },
      point: {
        hoverRadius: 6,
        hoverBorderWidth: 2
      }
    }
  };

  return (
    <div style={{ 
      height: `${height}px`,
      position: 'relative',
      background: theme === 'dark' ? '#121212' : '#ffffff',
      borderRadius: '8px',
      border: `1px solid ${currentColors.border}`,
      overflow: 'hidden'
    }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

function autoDetermineTimeUnit(data) {
  if (!data || data.length < 2) return 'day';
  const diff = new Date(data[data.length - 1].date) - new Date(data[0].date);
  const days = diff / (1000 * 60 * 60 * 24);
  
  if (days <= 1) return 'hour';
  if (days <= 7) return 'day';
  if (days <= 30) return 'week';
  return 'month';
}

export default LineChart;