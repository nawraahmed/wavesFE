import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { fetchTrendingPodcastsMock } from '../mockApi/mockApi'
import { FaPlay, FaPlus, FaSearch } from 'react-icons/fa'

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [podcasts, setPodcasts] = useState([])
  const [searchResults, setSearchResults] = useState([])
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
        setSearchResults([]) // Update search results state
      } else {
        setSearchResults(data.results) // Store the search results
      }
    } catch (error) {
      setError('Error fetching podcasts: ' + error.message)
      setSearchResults([]) // Clear search results if there’s an error
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
      console.log(response.data.podcasts)
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

  useEffect(() => {
    fetchBestPodcasts()
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

  // Handle click events for the buttons
  const handleFavoritePodcast = async (podcast) => {
    console.log('Attempting to add podcast:', podcast.id)

    try {
      const mappedPodcast = {
        externalId: podcast.id,
        title: podcast.title,
        description: podcast.description,
        thumbnail: podcast.thumbnail,
        genre_ids: podcast.genre_ids
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

  const handlePlayClick = (podcast) => {
    console.log('Play podcast:', podcast)
  }

  return (
    <div className="discover-container">
      <h1 className="discover-title">Trending Podcasts 🔥 </h1>
      {/* Podcast Slideshow */}
      <>
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
              transform: `translateX(-${
                (currentIndex / itemsPerSlide) * 100
              }%)`,
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
                  </div>
                </div>
                <div className="podcast-name">{podcast.title}</div>
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
      </>

      {/* Search Input - Now placed below the slideshow */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search podcasts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="like-button" onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      {/* Loading Indicator */}
      {loading && <div>Loading podcasts...</div>}
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <div className="podcast-grid">
            {' '}
            {/* Replaced podcast-list with podcast-grid */}
            {searchResults.map((podcast, index) => (
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
      )}
    </div>
  )
}

export default Discover
