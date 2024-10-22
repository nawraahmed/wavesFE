import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Discover from './components/Discover'
import Login from './components/Login'
import Register from './components/Register'
import CurrentlyPlaying from './components/CurrentlyPlaying'
import Profile from './components/Profile'
import FavoritesList from './components/FavoritesList'
import WatchHistory from './components/WatchHistory'
import Footer from './components/Footer'
import Home from './components/Home'
import PodcastList from './components/PodcastList'
import PodcastDetails from './components/PodcastDetails'
// import Dashboard from './components/Dashboard'
import { useAudio } from './contexts/AudioContext'

const App = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const { currentTrack } = useAudio()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }, [darkMode]);  

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
    navigate('/')
  }

  return (
    <div>
      <Header user={user} handleLogout={handleLogOut} />

      {/* all the needed routes for the app */}
      <Routes>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/currently-playing"
          element={<CurrentlyPlaying track={currentTrack} />}
        />
        <Route path="/favorites" element={<FavoritesList />} />
        <Route path="/history" element={<WatchHistory />} />
        <Route
          path="/podcastList"
          element={<PodcastList navigate={navigate} />}
        />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/podcast/:podcastId" element={<PodcastDetails />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
