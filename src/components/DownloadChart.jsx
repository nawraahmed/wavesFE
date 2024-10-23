import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register required components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const DownloadChart = ({ downloadData }) => {
  const chartData = {
    labels: downloadData.map((item) => item.podcastTitle), // Assuming each data point has a 'podcastTitle'
    datasets: [
      {
        label: 'Downloads',
        data: downloadData.map((item) => item.downloadCount), // Assuming each data point has a 'downloadCount'
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div>
      <h2>Podcast Downloads</h2>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default DownloadChart
