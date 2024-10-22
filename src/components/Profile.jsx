import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Profile = () => {
  const [profile, setProfile] = useState({
    favorites: [],
    playlists: [],
    addedPodcasts: [],
    episodes: []
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:4000/profile/details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }

        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        alert('Error loading profile')
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-username">{profile.username}</h1>
      </div>

      <section className="profile-section">
        <h2 className="section-title">Favorite Podcasts</h2>
        <ul className="favorites-list">
          {profile.favorites.map((favorite, index) => (
            <li className="favorite-item" key={index}>
              {/* Make thumbnail clickable */}
              <Link to={`/podcast/${favorite.externalId}`}>
                <div className="podcast-thumbnail-container">
                  <img
                    src={favorite.thumbnail}
                    alt={`${favorite.title} thumbnail`}
                    className="podcast-thumbnail"
                  />
                </div>
              </Link>
              <div className="podcast-info">
                {/* Make title clickable */}
                <Link to={`/podcast/${favorite.externalId}`}>
                  <h3>{favorite.title}</h3>
                </Link>
                <p>{favorite.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="profile-section">
        <h2 className="section-title">Added Podcasts</h2>
        <ul className="favorites-list">
          {profile.addedPodcasts.map((podcast, index) => (
            <li className="favorite-item" key={index}>
              {/* Make thumbnail clickable */}
              <Link to={`/podcast/${podcast.externalId}`}>
                <div className="podcast-thumbnail-container">
                  <img
                    src={podcast.thumbnail}
                    alt={`${podcast.title} thumbnail`}
                    className="podcast-thumbnail"
                  />
                </div>
              </Link>
              <div className="podcast-info">
                {/* Make title clickable */}
                <Link to={`/podcast/${podcast.externalId}`}>
                  <h3>{podcast.title}</h3>
                </Link>
                <p>{podcast.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Profile
