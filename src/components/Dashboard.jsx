import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DownloadChart from './DownloadChart'
import { fetchWatchHistory } from '../mockApi/mockApi' // Adjust path as necessary
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  const [history, setHistory] = useState([])
  const [downloadData, setDownloadData] = useState([])
  const [chartData, setChartData] = useState(null)
  const [error, setError] = useState('')

  // Function to fetch download data from the backend
  const fetchDownloadData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/download') // Ensure this is correct
      setDownloadData(response.data) // Set your download data from the API
    } catch (error) {
      console.error('Error fetching download data:', error)
    }
  }

  // Fetch user history and download data on component mount
  useEffect(() => {
    const getHistory = async () => {
      try {
        const userHistory = await fetchWatchHistory()
        setHistory(userHistory)
        generateChartData(userHistory)
      } catch (err) {
        console.error('Error fetching history:', err)
        setError('Failed to load history.')
      }
    }

    getHistory()
    fetchDownloadData()
  }, [])

  // Generate data for the chart based on history
  const generateChartData = (history) => {
    // Extract dates and progress from history
    const labels = history.map((entry) =>
      new Date(entry.timestamp).toLocaleDateString()
    )
    const data = history.map((entry) => entry.progress / 60) // Convert seconds to minutes

    // Prepare chart data object
    setChartData({
      labels,
      datasets: [
        {
          label: 'Listening Time (minutes)',
          data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    })
  }

  return (
    <div>
      <h2>User Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {chartData ? (
        <>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top'
                },
                title: {
                  display: true,
                  text: 'Listening History'
                }
              }
            }}
          />
          <DownloadChart downloadData={downloadData} />{' '}
          {/* Render the download chart */}
        </>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  )
}

export default Dashboard
