import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { fetchTrendingPodcastsMock } from '../mockApi/mockApi'

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [podcasts, setPodcasts] = useState([])
  const [randomPodcast, setRandomPodcast] = useState(null) // New state for random podcast
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerSlide = 6
  const apiKey = import.meta.env.VITE_API_KEY
  const touchStartX = useRef(0)
  const isDragging = useRef(false)

  // Function to handle search and fetch podcasts from ListenNotes API
  const handleSearch = async () => {
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
      setError('Error fetching podcasts: ' + error.message)
      setPodcasts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchBestPodcasts = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(
        'https://listen-api.listennotes.com/api/v2/best_podcasts',
        {
          headers: {
            'X-ListenAPI-Key': apiKey
          }
        }
      )

      setPodcasts(response.data.podcasts)
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log('Received status code 429. Using mock data instead.')
        const mockData = await fetchTrendingPodcastsMock()
        setPodcasts(mockData.podcasts)
      } else {
        setError('Error fetching podcasts: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // New function to fetch a random podcast
  const fetchRandomPodcast = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(
        'https://listen-api.listennotes.com/api/v2/just_listen',
        {
          headers: {
            'X-ListenAPI-Key': apiKey
          }
        }
      )

      setRandomPodcast(response.data)
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log('Received status code 429. Using mock data instead.')
        const mockData = await fetchTrendingPodcastsMock() // Replace with your actual mock data logic
        setRandomPodcast(mockData.randomPodcast)
      } else {
        setError('Error fetching random podcast: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBestPodcasts()
    fetchRandomPodcast() // Fetch random podcast when the component mounts
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerSlide, podcasts.length - itemsPerSlide)
    )
  }

  // Handle slide to the left
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerSlide, 0))
  }

  // Handle touch start event
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX
    isDragging.current = true
  }

  // Handle touch move event
  const handleTouchMove = (e) => {
    if (!isDragging.current) return
    const touchEndX = e.touches ? e.touches[0].clientX : e.clientX
    const diffX = touchStartX.current - touchEndX

    if (diffX > 50) {
      nextSlide()
      isDragging.current = false
    } else if (diffX < -50) {
      prevSlide()
      isDragging.current = false
    }
  }

  // Handle touch end event
  const handleTouchEnd = () => {
    isDragging.current = false
  }

  // Handle click events for the buttons (dummy handlers for now)
  const handleFavoritePodcast = (podcast) => {
    console.log('Favorite podcast:', podcast)
  }

  const handleAddPodcast = (podcast) => {
    console.log('Add podcast:', podcast)
  }

  const handlePlayClick = (podcast) => {
    console.log('Play podcast:', podcast)
  }

  return (
    <div className="discover-container">
      <h1 className="discover-title">Discover Podcasts</h1>

      {/* Podcast Results */}
      <div
        className="podcast-carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        style={{ cursor: 'grab' }}
      >
        <div
          className="podcast-results"
          style={{
            transform: `translateX(-${(currentIndex / itemsPerSlide) * 100}%)`,
            transition: 'transform 0.5s ease',
            justifyContent: 'center'
          }}
        >
          {podcasts.map((podcast, index) => (
            <div className="podcast-card" key={`${podcast.id}-${index}`}>
              <div className="podcast-image-container">
                <img
                  src={podcast.thumbnail}
                  alt={`${podcast.title_original} thumbnail`}
                  className="podcast-thumbnail"
                  onClick={() => handlePlayClick(podcast)}
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
                    <FaPlay />
                  </button>
                </div>
              </div>
              <div className="podcast-name">{podcast.title_original}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Button Section Below Podcast Cards */}
      <div className="button-container">
        {currentIndex > 0 && (
          <button className="swap-button" onClick={prevSlide}>
            &#60; {/* Left arrow */}
          </button>
        )}
        {currentIndex + itemsPerSlide < podcasts.length && (
          <button className="swap-button" onClick={nextSlide}>
            &#62; {/* Right arrow */}
          </button>
        )}
      </div>
      {/* Search Input */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search podcasts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading Indicator */}
      {loading && <div>Loading podcasts...</div>}

      {/* Random Podcast Display */}
      {randomPodcast && (
        <div className="random-podcast">
          <h2>Random Podcast:</h2>
          <h3>{randomPodcast.title}</h3>
          <audio controls>
            <source src={randomPodcast.audio_url} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}
    </div>
  )
}

export default Discover
