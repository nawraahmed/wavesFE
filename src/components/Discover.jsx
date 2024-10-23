import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { fetchTrendingPodcastsMock } from '../mockApi/mockApi';
import { FaPlus, FaPlay } from 'react-icons/fa';

const Discover = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerSlide = 6;
  const apiKey = import.meta.env.VITE_API_KEY;
  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  // Fetch best podcasts from the backend
  const fetchBestPodcasts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        'https://listen-api.listennotes.com/api/v2/best_podcasts',
        {
          headers: {
            'X-ListenAPI-Key': apiKey,
          },
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

  // Handle slide to the right
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + itemsPerSlide, podcasts.length - itemsPerSlide)
    );
  };

  // Handle slide to the left
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerSlide, 0));
  };

  // Handle touch start event
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    isDragging.current = true;
  };

  // Handle touch move event
  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const touchEndX = e.touches ? e.touches[0].clientX : e.clientX;
    const diffX = touchStartX.current - touchEndX;

    if (diffX > 50) {
      nextSlide();
      isDragging.current = false;
    } else if (diffX < -50) {
      prevSlide();
      isDragging.current = false;
    }
  };

  // Handle touch end event
  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Handle click events for the buttons (dummy handlers for now)
  const handleFavoritePodcast = (podcast) => {
    console.log('Favorite podcast:', podcast);
  };

  const handleAddPodcast = (podcast) => {
    console.log('Add podcast:', podcast);
  };

  const handlePlayClick = (podcast) => {
    console.log('Play podcast:', podcast);
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
            justifyContent: 'center',
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
    </div>
  );
};

export default Discover;