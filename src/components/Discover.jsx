import { useState, useEffect } from 'react';
import axios from 'axios';


const Discover = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerSlide = 3; 
  const apiKey = import.meta.env.VITE_API_KEY
  // Function to fetch best podcasts from your backend
  const fetchBestPodcasts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://listen-api.listennotes.com/api/v2/best_podcasts',
        {
          headers: {
            'X-ListenAPI-Key': apiKey
          }
        }
      ); // Adjust this URL to your backend endpoint
      setPodcasts(response.data.podcasts); // Assuming your backend returns the podcasts array
    } catch (error) {
      setError('Error fetching podcasts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestPodcasts(); // Fetch best podcasts on component mount
  }, []);

  // Function to handle sliding to the right
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + itemsPerSlide, podcasts.length - itemsPerSlide));
  };

  // Function to handle sliding to the left
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerSlide, 0));
  };

  return (
    <div className="discover-container">
      <h1 className="discover-title">Discover Podcasts</h1>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading Indicator */}
      {loading && <div>Loading podcasts...</div>}

      {/* Podcast Results */}
      <div className="podcast-carousel">
        <button className="swap-button" onClick={prevSlide} disabled={currentIndex === 0}>
          &#60; {/* Left arrow */}
        </button>
        
        <div className="podcast-results" style={{ transform: `translateX(-${(currentIndex / itemsPerSlide) * 100}%)` }}>
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
        
        <button className="swap-button" onClick={nextSlide} disabled={currentIndex + itemsPerSlide >= podcasts.length}>
          &#62; {/* Right arrow */}
        </button>
      </div>
    </div>
  );
};

export default Discover;