import { useEffect, useState } from 'react'
import axios from 'axios'

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_API_KEY

  const handleAddPodcast = async (podcast) => {
    try {
      const mappedPodcast = {
        externalId: podcast.podcast.id, // Ensure this matches the property you're using
        title: podcast.title_original,
        description: podcast.description_original,
        thumbnail: podcast.thumbnail,
        genre_ids: podcast.genre_ids
      }

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

  const handleFavoritePodcast = async (podcast) => {
    const token = localStorage.getItem('authToken')
    const podcastId = podcast.podcast.id || podcast.externalId // Use the appropriate ID
    console.log('Podcast ID:', podcastId) // Log the ID for debugging

    // Validate the podcastId
    if (!podcastId || typeof podcastId !== 'string') {
      console.error('Invalid podcast ID:', podcastId)
      return // Exit the function if the ID is invalid
    }

    // Check the length of the ID
    console.log('Podcast ID Length:', podcastId.length)

    try {
      const res = await axios.post(
        'http://localhost:4000/favorite',
        { podcastId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Podcast favorited:', res.data)
    } catch (error) {
      console.error(
        'Error favoriting podcast:',
        error.response?.data || error.message
      )
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
        {podcasts.map((podcast, index) => (
          <div className="podcast-card" key={`${podcast.id}-${index}`}>
            <div className="podcast-image-container">
              <img
                src={podcast.thumbnail}
                alt={`${podcast.title_original} thumbnail`}
                className="podcast-thumbnail"
              />
              <div className="podcast-buttons">
                <button onClick={() => handleFavoritePodcast(podcast)}>
                  ❤️ Like
                </button>
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
