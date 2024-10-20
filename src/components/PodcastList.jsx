import { useEffect, useState } from 'react'
import axios from 'axios'

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_API_KEY

  // Function to add a podcast to the backend with token
  const handleAddPodcast = async (podcast) => {
    try {
      // Extract fields from the podcast object and map them to your model
      const mappedPodcast = {
        externalId: podcast.podcast.id,
        title: podcast.title_original,
        description: podcast.description_original,
        thumbnail: podcast.thumbnail,
        genre_ids: podcast.genre_ids
      }

      console.log(mappedPodcast)

      // Send the mapped podcast data to your backend
      const token = localStorage.getItem('authToken')
      const res = await axios.post(
        'http://localhost:4000/addpodcast',
        mappedPodcast,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Podcast added:', res.data)
    } catch (error) {
      console.error('Error adding podcast:', error)
    }
  }

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
                <button onClick={() => handleAddPodcast(podcast)}>Add</button>
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
