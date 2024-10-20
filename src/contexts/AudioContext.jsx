import { createContext, useState, useContext, useRef, useEffect } from 'react'

const AudioContext = createContext()

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(new Audio())

  useEffect(() => {
    if (currentTrack) {
      console.log('Current track available on render:', currentTrack)
    } else {
      console.log('No current track on render')
    }
  }, [currentTrack]) // This will track when currentTrack is set or updated

  const playTrack = (track) => {
    if (currentTrack && currentTrack.url === track.url) {
      // If the same track is clicked, just toggle play/pause
      if (isPlaying) {
        pauseTrack()
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    } else {
      audioRef.current.src = track.audio
      audioRef.current.play()
      setCurrentTrack(track)
      console.log('Setting current track:', track) // Add this log
      setIsPlaying(true)
    }
  }

  const pauseTrack = () => {
    audioRef.current.pause()
    setIsPlaying(false)
  }

  const nextTrack = () => {
    // Logic to get the next track (you might want to implement this based on an array of episodes)
  }

  const previousTrack = () => {
    // Logic to get the previous track (similar to nextTrack)
  }

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  return useContext(AudioContext)
}
