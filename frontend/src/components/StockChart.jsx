
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = ({ open, high, low, prediction }) => {
  // Data for the line chart
  const data = {
    labels: ["Open Price", "High Price", "Low Price", "Predicted Closing Price"], // X-axis labels
    datasets: [
      {
        label: "Stock Prices",
        data: [open, high, low, prediction], // Y-axis data from props
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Stock Price Prediction Chart",
      },
    },
  };

  return (
    <div className="mt-8">
      <Line data={data} options={options} />
    </div>
  );
};

export default StockChart;