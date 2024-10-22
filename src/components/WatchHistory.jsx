import React, { useEffect, useState } from 'react'
import { fetchWatchHistory, saveWatchHistory } from '../mockApi/mockApi' // Adjust import as necessary

const WatchHistory = () => {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const getHistory = async () => {
      const userHistory = await fetchWatchHistory()
      setHistory(userHistory)
    }
    getHistory()
  }, [])

  const handleSaveHistory = async (podcastId, progress) => {
    try {
      const newEntry = await saveWatchHistory(podcastId, progress)
      setHistory((prevHistory) => [...prevHistory, newEntry]) // Update local state with the new entry
    } catch (error) {
      console.error('Error saving history:', error)
    }
  }

  return (
    <div>
      <h2>Your Watch History</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            <img src={entry.thumbnail} alt={entry.title} />
            <h4>{entry.title}</h4>
            <p>Progress: {entry.progress} seconds</p>
            <p>Timestamp: {new Date(entry.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      {/* Call handleSaveHistory with appropriate podcastId and progress */}
      <button onClick={() => handleSaveHistory('some-podcast-id', 150)}>
        Save History
      </button>
    </div>
  )
}

export default WatchHistory
