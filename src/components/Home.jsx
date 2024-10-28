import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaRandom } from 'react-icons/fa'
import axios from 'axios'

const Home = () => {
  const [randomPodcast, setRandomPodcast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_API_KEY

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
    fetchRandomPodcast()
  }, [])

  return (
    <div className="home-container">
      <div className="home-main">
        <div className="home-content">
          <h2 className="highlight-text">Find Your Favorite Podcast!</h2>

          <h3>Play A Random Episode 🔀</h3>
          {loading && <p className="loading-text">Loading...</p>}
          {error && <p className="error-text">{error}</p>}
          {randomPodcast && (
            <div className="random-podcast">
              <div className="podcast-cover">
                <img src={randomPodcast.image} alt={randomPodcast.title} />
                <button className="like-button" onClick={fetchRandomPodcast}>
                  <FaRandom />
                </button>
              </div>
              <div className="podcast-info">
                <h3 className="podcast-title">{randomPodcast.title}</h3>
                {randomPodcast.audio ? (
                  <audio controls className="audio-player">
                    <source src={randomPodcast.audio} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                ) : (
                  <p>No audio available for this podcast.</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="home-image">
          <img src="/home-image.png" alt="Search Icon" />
        </div>
      </div>
    </div>
  )
}

export default Home
