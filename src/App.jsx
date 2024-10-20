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
// import Dashboard from './components/Dashboard'

const App = () => {
  const [user, setUser] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

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
          element={
            <PodcastList
              setCurrentTrack={setCurrentTrack}
              navigate={navigate}
            />
          } // Pass setCurrentTrack and navigate to PodcastList
        />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
      <Footer />
    </div>
  )
}

export default App
