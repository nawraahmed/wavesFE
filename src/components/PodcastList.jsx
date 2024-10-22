import { useEffect, useState } from 'react'
import { useAudio } from '../contexts/AudioContext'
import { FaPlay } from 'react-icons/fa'
import { fetchPodcastsMock } from '../mockApi/mockApi'
import axios from 'axios'

const PodcastList = ({ navigate }) => {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_API_KEY
  const { playTrack } = useAudio()

  const handleAddPodcast = async (podcast) => {
    try {
      const mappedPodcast = {
        externalId: podcast.podcast.id,
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
    const podcastId = podcast.podcast.id || podcast.externalId
    console.log('Podcast ID:', podcastId)

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
    const searchTerm = 're'
    setLoading(true)
    setError(null)

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
        setError('No podcasts found for your search.')
        setPodcasts([])
      } else {
        setPodcasts(data.results)
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.warn('Rate limit exceeded, switching to mock data')
        const mockData = await fetchPodcastsMock() // Fetch mock data on rate limit
        setPodcasts(mockData)
      } else {
        setError('Error fetching podcasts: ' + error.message)
        setPodcasts([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePodcastClick = (podcastId) => {
    navigate(`/podcast/${podcastId}`) // Navigate to Podcast Details page with podcast ID
  }

  const handlePlayClick = async (podcast) => {
    const podcastId = podcast.podcast.id // Get the podcast ID

    // Hardcoded audio URL for testing
    const hardcodedAudioUrl =
      'https://audio.listennotes.com/e/p/0e8f68f851394349afa9a7dbadfb35b7/' // Replace with your desired audio URL

    // Use the hardcoded audio URL to play the track
    playTrack({ audio: hardcodedAudioUrl, title: 'Hardcoded Episode Title' }) // Replace 'Hardcoded Episode Title' as needed
    navigate('/currently-playing') // Navigate to currently playing page
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
                src={podcast.podcast.thumbnail}
                alt={`${podcast.title_original} thumbnail`}
                className="podcast-thumbnail"
                onClick={() => handlePodcastClick(podcast.podcast.id)}
              />
              <div className="podcast-buttons">
                <button onClick={() => handleFavoritePodcast(podcast)}>
                  ❤️ Like
                </button>

                <button
                  className="add-button"
                  onClick={() => handleAddPodcast(podcast)}
                >
                  Add
                </button>
                <button
                  className="play-button"
                  onClick={() => handlePlayClick(podcast)}
                >
                  <FaPlay /> {/* Play icon */}
                </button>
              </div>
            </div>
            <div className="podcast-title">
              {podcast.podcast.title_original}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PodcastList
