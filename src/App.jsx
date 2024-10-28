import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Discover from './components/Discover'
import Login from './components/Login'
import Register from './components/Register'
import CurrentlyPlaying from './components/CurrentlyPlaying'
import Profile from './components/Profile'
import Footer from './components/Footer'
import Home from './components/Home'
import PodcastList from './components/PodcastList'
import PodcastDetails from './components/PodcastDetails'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // Import the CSS for styling

//destructuring the currentTrack from useAudio()
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
        {/* passes currentTrack to the component as a prop */}
        <Route
          path="/currently-playing"
          element={<CurrentlyPlaying currentTrack={currentTrack} />}
        />

        <Route
          path="/podcastList"
          element={<PodcastList navigate={navigate} />}
        />

        <Route
          path="/podcast/:podcastId"
          element={<PodcastDetails navigate={navigate} />}
        />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default App
