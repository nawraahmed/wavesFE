import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/podcasts');
        setPodcasts(response.data);
      } catch (err) {
        setError('Failed to fetch podcasts');
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Podcast List</h1>
      <ul>
        {podcasts.map((podcast) => (
          <li key={podcast.externalId}>
            <img src={podcast.thumbnail} alt={podcast.title} width="100" />
            <h3>{podcast.title}</h3>
            <p>{podcast.description}</p>
            <p>Genres: {podcast.genres.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PodcastList;
