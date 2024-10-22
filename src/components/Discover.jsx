import { useState } from 'react'
import axios from 'axios'

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_API_KEY // Assuming your .env has this key

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

  return (
    <div className="discover-container">
      <h1 className="discover-title">Discover Podcasts</h1>

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

      {/* Podcast Results */}
      <div className="podcast-results">
        {podcasts.map((podcast) => (
          <div className="podcast-card" key={podcast.id}>
            <img
              src={podcast.thumbnail}
              alt={podcast.title_original}
              className="podcast-thumbnail"
            />
            <div className="podcast-info">
              <h3>{podcast.title_original}</h3>
              <p>{podcast.publisher_original}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Discover
