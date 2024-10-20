import { useEffect, useState } from 'react'
import axios from 'axios'

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_API_KEY

  const fetchPodcasts = async () => {
    const searchTerm = 'podcast'
    try {
      const response = await axios.get(
        `https://listen-api.listennotes.com/api/v2/search?q=${searchTerm}`,
        {
          headers: {
            'X-ListenAPI-Key': apiKey
          }
        }
      )

      const data = response.data
      console.log(data)

      if (data.results.length === 0) {
        setError('No more podcasts found.')
      } else {
        setPodcasts(data.results)
      }
    } catch (error) {
      setError('Error fetching podcasts: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPodcasts()
  }, [])

  if (loading) {
    return <div>Loading podcasts...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="podcast-list-container">
      <h1 className="podcast-list-title">Podcast List</h1>
      <div className="podcast-grid">
        {podcasts.map((podcast) => (
          <div className="podcast-card" key={podcast.id}>
            <div className="podcast-image-container">
              <img
                src={podcast.thumbnail}
                alt={`${podcast.title_original} thumbnail`}
                className="podcast-thumbnail"
              />
              <div className="podcast-buttons">
                <button className="like-button">❤️ Like</button>
                <button className="add-button">➕ Add</button>
              </div>
            </div>
            <div className="podcast-title">{podcast.title_original}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PodcastList
