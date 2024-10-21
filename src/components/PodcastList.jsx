import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudio } from '../contexts/AudioContext'
import { FaPlay } from 'react-icons/fa'
import axios from 'axios'

const PodcastList = ({ setCurrentTrack, navigate }) => {
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
      console.log(data)

      if (data.results.length === 0) {
        setError('No podcasts found for your search.')
        setPodcasts([])
      } else {
        setPodcasts(data.results)
      }
    } catch (error) {
      setError('Error fetching podcasts: ' + error.message)
      setPodcasts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchEpisodes = async (podcastId) => {
    try {
      const response = await axios.get(
        `https://listen-api.listennotes.com/api/v2/podcasts/${podcastId}`,
        {
          headers: {
            'X-ListenAPI-Key': apiKey
          }
        }
      )
      const podcastDetails = response.data
      const episodes = podcastDetails.episodes
      console.log(episodes)
      if (episodes.length > 0) {
        setCurrentTrack(episodes[0]) // Set the first episode as current track
        console.log(episodes[0])
      } else {
        console.log('No episodes found for this podcast')
      }
    } catch (error) {
      console.error('Error fetching episodes: ' + error.message)
    }
  }

  const handlePodcastClick = (podcastId) => {
    navigate(`/podcast/${podcastId}`) // Navigate to Podcast Details page with podcast ID
  }

  const handlePlayClick = async (podcast) => {
    // Fetch episodes and play the first one, then navigate
    await fetchEpisodes(podcast.podcast.id) // Fetch episodes
    const track = podcasts.find((p) => p.podcast.id === podcast.podcast.id)
    if (track) {
      playTrack(track)
      navigate('/currently-playing') // Navigate to CurrentlyPlaying after playing
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
                onClick={() => handlePodcastClick(podcast.podcast.id)}
              />
              <div className="podcast-buttons">
                <button className="like-button">❤️ Like</button>
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
            <div className="podcast-title">{podcast.title_original}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PodcastList
