import React from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement
);

const CandleStickChart = ({ data, height = 350 }) => {
  const ohlcData = data.map((item, index) => ({
    x: new Date(item.date),
    o: item.open || item.price * 0.998,  
    h: item.high || item.price * 1.005,  
    l: item.low || item.price * 0.995,   
    c: item.close || item.price   
  }));

  return (
    <Chart
      type="candlestick"
      data={{
        datasets: [{
          label: 'Price',
          data: ohlcData,
          color: {
            up: '#4CAF50',  
            down: '#F44336',
            unchanged: '#9E9E9E',
          }
        }]
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'HH:mm'
              }
            }
          },
          y: {
            ticks: {
              callback: value => `$${value.toFixed(0)}`
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const point = context.raw;
                return [
                  `Open: $${point.o.toFixed(2)}`,
                  `High: $${point.h.toFixed(2)}`,
                  `Low: $${point.l.toFixed(2)}`,
                  `Close: $${point.c.toFixed(2)}`
                ];
              }
            }
          }
        }
      }}
      height={height}
    />
  );
};

export default CandleStickChart;

