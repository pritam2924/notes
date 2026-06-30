
// Performance.jsx
import React from "react";
import { Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler, // for area under line if needed
  CategoryScale, // x-axis categories for Line charts
} from "chart.js";

import "../styles/Performance.css";

// Register everything your charts need
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  RadialLinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Performance = () => {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Velocity",
        data: [12, 19, 15, 22, 18, 24],
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13,110,253,0.2)",
        tension: 0.3,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Team Velocity (Last 6 Months)" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  const radarData = {
    labels: ["Quality", "Speed", "Collaboration", "Innovation", "Ownership"],
    datasets: [
      {
        label: "Current Sprint",
        data: [4, 3, 5, 4, 3],
        borderColor: "#198754",
        backgroundColor: "rgba(25,135,84,0.2)",
        pointBackgroundColor: "#198754",
      },
      {
        label: "Last Sprint",
        data: [3, 4, 4, 3, 4],
        borderColor: "#dc3545",
        backgroundColor: "rgba(220,53,69,0.2)",
        pointBackgroundColor: "#dc3545",
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Sprint Performance Radar" },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { circular: true },
      },
    },
  };

  return (
    <div className="performance">
      <div className="chart-card">
        <Line data={lineData} options={lineOptions} />
      </div>
      <div className="chart-card">
        <Radar data={radarData} options={radarOptions} />
      </div>
    </div>
  );
};

export default Performance;
