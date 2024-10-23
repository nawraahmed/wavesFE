import { useEffect, useState } from 'react'
import { useAudio } from '../contexts/AudioContext'
import { FaPlay, FaPlus } from 'react-icons/fa'
import { fetchPodcastsMock } from '../mockApi/mockApi'
import axios from 'axios'

const PodcastList = ({ navigate }) => {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_API_KEY
  const { playTrack } = useAudio()

  const handleAddPodcast = async (podcast) => {
    console.log('Attempting to add podcast:', podcast.podcast.id) // Log the ID of the podcast being added
    try {
      const mappedPodcast = {
        externalId: podcast.podcast.id,
        title: podcast.podcast.title_original,
        description: podcast.podcast.description_original,
        thumbnail: podcast.podcast.thumbnail,
        genre_ids: podcast.podcast.genre_ids
      }

      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('No authentication token found. Cannot add podcast.')
        return // Exit if there's no token
      }

      const res = await axios.post(
        'http://localhost:4000/addpodcast',
        mappedPodcast,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log('Podcast added successfully:', res.data) // Log the response data after a successful addition
    } catch (error) {
      // Log the error details if the addition fails
      if (error.response) {
        console.error(
          'Error adding podcast, response data:',
          error.response.data
        )
        console.error('Error status code:', error.response.status)
        console.error('Error headers:', error.response.headers)
      } else {
        console.error('Error adding podcast:', error.message)
      }
    }
  }

  const handleFavoritePodcast = async (podcast) => {
    console.log('Attempting to add podcast:', podcast.podcast.id)

    try {
      const mappedPodcast = {
        externalId: podcast.podcast.id,
        title: podcast.podcast.title_original,
        description: podcast.podcast.description_original,
        thumbnail: podcast.podcast.thumbnail,
        genre_ids: podcast.podcast.genre_ids
      }

      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('No authentication token found. Cannot add podcast.')
        return // Exit if there's no token
      }

      const res = await axios.post(
        'http://localhost:4000/favorite',
        mappedPodcast,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Podcast favorited:', res.data)
    } catch (error) {
      // Log the error details if the addition fails
      if (error.response) {
        console.error(
          'Error adding podcast, response data:',
          error.response.data
        )
        console.error('Error status code:', error.response.status)
        console.error('Error headers:', error.response.headers)
      } else {
        console.error('Error adding podcast:', error.message)
      }
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
    navigate(`/podcast/c5c512d4b48a42f0acef83dd9615267c`) // Navigate to Podcast Details page with podcast ID
  }

  const handlePlayClick = async (podcast) => {
    const podcastId = podcast.podcast.id // Get the podcast ID
    console.log(podcastId)
    const episodeId = '0e8f68f851394349afa9a7dbadfb35b7' // Get the episode ID
    // Get the user object from local storage
    const user = JSON.parse(localStorage.getItem('user')) // Parse the JSON string to an object

    if (!user || !user.id) {
      // Ensure user exists and has an id property
      console.error('User ID not found in local storage.')
      return // Handle the case when userId is not available
    }

    const userId = user.id // Extract the userId

    // Now you can use podcastId, episodeId, and userId
    console.log(
      `Podcast ID: ${podcastId}, Episode ID: ${episodeId}, User ID: ${userId}`
    )

    // Hardcoded audio URL for testing
    const hardcodedAudioUrl =
      'https://audio.listennotes.com/e/p/0e8f68f851394349afa9a7dbadfb35b7/' // Replace with your desired audio URL

    // Create a new history record
    const newHistory = {
      userId,
      podcastId,
      episodeId,
      podcastTitle: 'podcast.podcast.title', // Assuming you have this in your podcast object
      episodeTitle: 'podcast.episode.title', // Assuming you have this in your episode object
      progress: 0, // Initial progress
      totalLength: 950 // You can get this from the episode details if available
    }

    try {
      // Post the new history record to the backend
      await axios.post('http://localhost:4000/history/track', newHistory, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
    } catch (error) {
      console.error('Error creating history record:', error.message)
    }

    // Use the hardcoded audio URL to play the track
    playTrack({
      podcastId: podcastId,
      audio: hardcodedAudioUrl,
      title: ' Episode Title',
      thumbnail:
        'https://cdn-images-3.listennotes.com/podcasts/sivan-says-taking-the-torah-personally-NsxhDfT1LKi-u5JpkIDUH34.300x300.jpg',
      duration: '950'
    })
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
      {/* <h1 className="podcast-list-title">Podcast List</h1> */}
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
                <button
                  className="like-button"
                  onClick={() => handleFavoritePodcast(podcast)}
                >
                  ❤️
                </button>

                <button
                  className="add-button"
                  onClick={() => handleAddPodcast(podcast)}
                >
                  <FaPlus />
                </button>
                <button
                  className="play-button"
                  onClick={() => handlePlayClick(podcast)}
                >
                  <FaPlay /> {/* Play icon */}
                </button>
              </div>
            </div>
            <div className="podcast-name">{podcast.podcast.title_original}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PodcastList
