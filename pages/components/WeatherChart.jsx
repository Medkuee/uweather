import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useGlobalState } from "@/context/GlobalStateContext";
import { celsiusToFahrenheit } from "@/utils/conversion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WeatherChart({ hourlyData }) {
  const { globalState } = useGlobalState();

  const chartData = {
    labels: hourlyData.map((_, index) => index),
    datasets: [
      {
        label: `Temperature (${globalState?.temperature})`,
        // data: hourlyData,
        data:
          globalState?.temperature === "C°"
            ? hourlyData
            : hourlyData.map((_data) => celsiusToFahrenheit(_data)),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}°C`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hours",
        },
        ticks: {
          callback: (value, index) => (index % 6 === 0 ? value : null),
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
        beginAtZero: false,
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}
