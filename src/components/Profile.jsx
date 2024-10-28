import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { FaArrowCircleUp } from 'react-icons/fa' // Import the arrow icon

ChartJS.register(CategoryScale, LinearScale, BarElement, Title)

const Profile = () => {
  const [profile, setProfile] = useState({
    favorites: [],
    playlists: [],
    addedPodcasts: [],
    history: []
  })
  const [showScrollTop, setShowScrollTop] = useState(false)

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

  // Prepare data for the chart
  const getChartData = () => {
    let completedCount = 0
    let partiallyCount = 0

    // Count completed and partially completed episodes
    profile.history.forEach((episode) => {
      if (episode.isFinished) {
        completedCount++
      } else {
        partiallyCount++
      }
    })

    return {
      labels: ['Completed Episodes', 'Partially Completed Episodes'],
      datasets: [
        {
          label: 'Episodes',
          data: [completedCount, partiallyCount],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }
      ]
    }
  }

  // Function to show or hide scroll-to-top button
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollTop(true)
    } else {
      setShowScrollTop(false)
    }
  }

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-username">{profile.username}</h1>
      </div>

      <nav className="profile-nav">
        <h4 className="nav-title">Navigation</h4>
        <ul>
          <li>
            <a href="#favorites">Favorite Podcasts ❤️</a>
          </li>
          <li>
            <a href="#added">Added Podcasts ✅</a>
          </li>
          <li>
            <a href="#history">Watch History 🕗</a>
          </li>
          <li>
            <a href="#dashboard">Dashboard 📊</a>
          </li>
        </ul>
      </nav>

      <section id="favorites" className="profile-section">
        <h2 className="section-title">Favorite Podcasts ❤️</h2>
        <ul className="favorites-list">
          {profile.favorites.map((favorite, index) => (
            <li className="favorite-item" key={index}>
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
                <Link to={`/podcast/${favorite.externalId}`}>
                  <h3>{favorite.title}</h3>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="added" className="profile-section">
        <h2 className="section-title">Added Podcasts ✅</h2>
        <ul className="favorites-list">
          {profile.addedPodcasts.map((podcast, index) => (
            <li className="favorite-item" key={index}>
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
                <Link to={`/podcast/${podcast.externalId}`}>
                  <h3>{podcast.title}</h3>
                </Link>
                <p>{podcast.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="history" className="profile-section">
        <h2 className="section-title">Watch History 🕗 </h2>
        <ul className="favorites-list">
          {profile.history.map((episode, index) => (
            <li className="favorite-item" key={index}>
              <div className="podcast-info">
                <h3>{episode.podcastTitle}</h3>
                <h4>{episode.episodeTitle}</h4>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Dashboard Section with Chart */}
      <section id="dashboard" className="profile-section">
        <h2 className="section-title">Dashboard 📊</h2>
        <div className="dashboard-info">
          <Bar
            data={getChartData()}
            height={600}
            width={1000}
            options={{
              maintainAspectRatio: false,
              layout: { padding: { left: 10, right: 10, top: 0, bottom: 0 } },
              scales: {
                xAxes: [{ ticks: { autoSkip: false }, barPercentage: 0.9 }]
              }
            }}
          />
        </div>
      </section>

      {/* Scroll-to-top button */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowCircleUp size={30} />
        </button>
      )}
    </div>
  )
}

export default Profile
