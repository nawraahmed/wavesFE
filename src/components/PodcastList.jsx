import { useEffect, useState } from 'react'
import { useAudio } from '../contexts/AudioContext'
import { FaPlay, FaPlus } from 'react-icons/fa'
import { fetchPodcastsMock } from '../mockApi/mockApi'
import { toast } from 'react-toastify'
import axios from 'axios'

const PodcastList = ({ navigate }) => {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_API_KEY

  const handleAddPodcast = async (podcast) => {
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
        'http://localhost:4000/addpodcast',
        mappedPodcast,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log('Podcast added successfully:', res.data)
    } catch (error) {
      // Log the error details if the addition fails
      if (error.response) {
        console.error(
          'Error adding podcast, response data:',
          error.response.data
        )
        console.error('Error status code:', error.response.status)
        console.error('Error headers:', error.response.headers)

        // Check for a 409 status code
        if (error.response.status === 409) {
          toast.error('This podcast is already in your list!', {
            autoClose: 3000 // Auto-close after 3 seconds
          })
        }
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

        // Check for a 409 status code
        if (error.response.status === 409) {
          toast.error('This podcast is already in your favorites!', {
            autoClose: 3000 // Auto-close after 3 seconds
          })
        }
      } else {
        console.error('Error adding podcast:', error.message)
      }
    }
  }

  const fetchPodcasts = async () => {
    const searchTerm = 'he'
    let offset = 0 // Initialize the offset to zero for the first batch
    const allPodcasts = [] // To store all podcasts across multiple requests
    setLoading(true)
    setError(null)

    // Show loading toast notification
    const loadingToastId = toast.loading('Loading podcasts...') // Start loading notification

    try {
      while (true) {
        // Call the API with the current offset
        const response = await axios.get(
          `https://listen-api.listennotes.com/api/v2/search?q=${searchTerm}&offset=${offset}`,
          {
            headers: {
              'X-ListenAPI-Key': apiKey
            }
          }
        )

        const data = response.data

        // If there are no more podcasts to fetch, break the loop
        if (data.results.length === 0) {
          break
        }

        // Add the fetched batch of podcasts to the array
        allPodcasts.push(...data.results)

        // Update the offset for the next batch, if provided
        offset = data.next_offset || offset + data.results.length
      }

      // Check if podcasts were found, otherwise display an error message
      if (allPodcasts.length === 0) {
        setError('No podcasts found for your search.')
      } else {
        setPodcasts(allPodcasts)
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.warn('Rate limit exceeded, switching to mock data')
        const mockData = await fetchPodcastsMock() // Fetch mock data on rate limit
        setPodcasts(mockData)
      } else {
        setError('Error fetching podcasts: ' + error.message)
      }
    } finally {
      setLoading(false)
      toast.dismiss(loadingToastId) // Dismiss loading notification
    }
  }

  const handlePodcastClick = (podcastId) => {
    const defaultPodcastId = 'c5c512d4b48a42f0acef83dd9615267c' // Default static value
    const idToUse = podcastId || defaultPodcastId // Use the provided podcastId, or fallback to default
    navigate(`/podcast/${idToUse}`) // Navigate to the Podcast Details page with the correct podcast ID
  }

  useEffect(() => {
    fetchPodcasts()
  }, [])

  if (loading) {
    return null // No need to render anything while loading, handled by toast
  }

  if (error) {
    return <div>{error}</div> // Show error message if there is an error
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
