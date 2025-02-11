import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HistoricalPriceChart = ({ symbol }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/historical-data/${symbol}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Filter data for only the 15th of each month
        const filteredData = data.filter((item) => item.date.split('-')[2] === '15');
        setHistoricalData(filteredData);
      } catch (error) {
        console.error("Error fetching historical data:", error);
        setError(error.message);
      }
    };

    if (symbol) {
      fetchHistoricalData();
    }
  }, [symbol]);

  if (error) {
    return <div>Error loading historical data: {error}</div>;
  }

  if (historicalData.length === 0) {
    return <div>Loading historical data...</div>;
  }

  // Prepare data for the chart
  const chartData = {
    labels: historicalData.map(item => item.date),  // Dates for the X-axis
    datasets: [
      {
        label: 'Close Price',
        data: historicalData.map(item => item.close),  // Close prices for the Y-axis
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historical Stock Prices (15th of each month)',
      },
    },
  };

  return (
    <div className="w-full mt-4">
      <h2 className="text-center text-xl font-bold mb-2">Historical Prices (Trend)</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HistoricalPriceChart;
