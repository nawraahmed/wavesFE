import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { fetchTrendingPodcastsMock } from '../mockApi/mockApi';

const Discover = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerSlide = 6; 
  const apiKey = import.meta.env.VITE_API_KEY; 
  const touchStartX = useRef(0); 
  const isDragging = useRef(false); 

 
  const fetchBestPodcasts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        'https://listen-api.listennotes.com/api/v2/best_podcasts',
        {
          headers: {
            'X-ListenAPI-Key': apiKey
          }
        }
      );

      setPodcasts(response.data.podcasts); 
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log('Received status code 429. Using mock data instead.');
        const mockData = await fetchTrendingPodcastsMock(); 
        setPodcasts(mockData.podcasts);
      } else {
        setError('Error fetching podcasts: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestPodcasts(); 
  }, []);

  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerSlide, podcasts.length - itemsPerSlide)
    );
  };

  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerSlide, 0));
  };

  
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX; // Get initial touch or mouse position
    isDragging.current = true; 
  };

  
  const handleTouchMove = (e) => {
    if (!isDragging.current) return; // Exit if not dragging
    const touchEndX = e.touches ? e.touches[0].clientX : e.clientX; // Get current position
    const diffX = touchStartX.current - touchEndX; // Calculate the difference

    if (diffX > 50) {
      nextSlide(); // Swipe left
      isDragging.current = false; // Reset dragging state
    } else if (diffX < -50) {
      prevSlide(); // Swipe right
      isDragging.current = false; // Reset dragging state
    }
  };

  // Handle swipe/mouse drag end
  const handleTouchEnd = () => {
    isDragging.current = false; // Reset dragging state
  };

  return (
    <div className="discover-container">
      <h1 className="discover-title">Discover Podcasts</h1>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading Indicator */}
      {loading && <div>Loading podcasts...</div>}

      {/* Podcast Results */}
      <div
        className="podcast-carousel"
        onTouchStart={handleTouchStart} // Handle touch start
        onTouchMove={handleTouchMove}   // Handle touch move
        onTouchEnd={handleTouchEnd}      // Handle touch end
        onMouseDown={handleTouchStart}   // Handle mouse down
        onMouseMove={handleTouchMove}     // Handle mouse move
        onMouseUp={handleTouchEnd}        // Handle mouse up
        style={{ cursor: 'grab' }}        // Change cursor style for grabbing
      >
        <div
          className="podcast-results"
          style={{
            transform: `translateX(-${(currentIndex / itemsPerSlide) * 100}%)`,
            transition: 'transform 0.5s ease', // Smooth transition
            justifyContent: 'center', // Center the podcast cards
          }}
        >
          {podcasts.map((podcast) => (
            <div className="podcast-card" key={podcast.id}>
              <img
                src={podcast.thumbnail}
                alt={podcast.title_original}
                className="podcast-thumbnail"
              />
              <div className="podcast-info">
                <h3 className="podcast-title-ss">{podcast.title_original}</h3>
              </div>
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
    </div>
  );
};

export default Discover;
