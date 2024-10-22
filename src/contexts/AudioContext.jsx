import { createContext, useState, useEffect, useContext } from 'react'

const AudioContext = createContext()

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio] = useState(new Audio())

  useEffect(() => {
    // This will clean up the audio instance when the component unmounts
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [audio])

  useEffect(() => {
    if (currentTrack) {
      audio.src = currentTrack.audio // Set audio source
      isPlaying ? audio.play() : audio.pause() // Play or pause based on state

      audio.onended = () => {
        setIsPlaying(false) // Reset playing state when the track ends
        setCurrentTrack(null) // Optionally clear current track when done
      }

      console.log('Current track available:', currentTrack)
    }
  }, [currentTrack, isPlaying, audio])

  const playTrack = (track) => {
    if (currentTrack && currentTrack.audio === track.audio) {
      // If the track is already playing, toggle play/pause
      if (isPlaying) {
        pauseTrack()
      } else {
        audio.play()
        setIsPlaying(true)
      }
    } else {
      // Stop the previous track if it's different
      audio.pause()
      setCurrentTrack(track)
      audio.play()
      setIsPlaying(true)
      console.log('Setting new current track:', track)
    }
  }

  const pauseTrack = () => {
    audio.pause()
    setIsPlaying(false)
  }

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  return useContext(AudioContext)
}
