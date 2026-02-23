import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartsSection = ({ diffData, topicData }) => {
  // Theme options
  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#ffffff' : '#111827';
  const gridColor = isDarkMode ? '#374151' : '#f3f4f6';

  // Common options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ff4444',
          font: {
            family: "'Inter', 'sans-serif'",
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  };

  // Pie Chart Config (Difficulty)
  const pieData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [diffData?.easy || 0, diffData?.medium || 0, diffData?.hard || 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green
          'rgba(234, 179, 8, 0.8)', // Yellow
          'rgba(239, 68, 68, 0.8)', // Red
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Config (Topics)
  const barData = {
    labels: topicData?.labels || [],
    datasets: [
      {
        label: 'Problems Solved',
        data: topicData?.data || [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Strong Threshold',
        data: topicData?.labels.map(() => 50) || [],
        type: 'line',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Weak Threshold',
        data: topicData?.labels.map(() => 20) || [],
        type: 'line',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      }
    ],
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: '#ff4444', font: { size: 13, weight: 'bold' } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#ff4444', font: { size: 13, weight: 'bold' } }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-6 border border-gray-100 dark:border-gray-700 lg:col-span-1">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Difficulty Distribution</h3>
        <div className="h-[280px] flex justify-center items-center">
          {(diffData?.easy || diffData?.medium || diffData?.hard) ? (
             <Pie data={pieData} options={commonOptions} />
          ) : (
             <div className="text-gray-400 font-medium">No data available</div>
          )}
        </div>
      </div>
      
      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-6 border border-gray-100 dark:border-gray-700 lg:col-span-2">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Topic Strength Distribution</h3>
        <div className="h-[280px] w-full">
          {topicData ? (
             <Bar data={barData} options={barOptions} />
          ) : (
             <div className="h-full flex justify-center items-center text-gray-400 font-medium">No data available</div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ChartsSection;
