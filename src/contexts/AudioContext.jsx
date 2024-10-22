import { createContext, useState, useEffect, useContext } from 'react'

// Created using React’s createContext()
const AudioContext = createContext()

export const AudioProvider = ({ children }) => {
  // The current track being played
  const [currentTrack, setCurrentTrack] = useState(null)
  // Whether audio is currently playing or paused
  const [isPlaying, setIsPlaying] = useState(false)
  // The audio object used to play the track
  const [audio] = useState(new Audio())

  // Current playback time
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (currentTrack) {
      // Set the audio source to the current track
      audio.src = currentTrack.audio
      audio.currentTime = currentTime // Resume from last known position

      // If isPlaying is true, play the track; otherwise, pause it.
      isPlaying ? audio.play() : audio.pause()

      audio.onended = () => {
        // When the track finishes, reset isPlaying to false
        setIsPlaying(false)
        // Clear current track when the audio ends
        setCurrentTrack(null)
      }
      console.log('Current track available:', currentTrack)
    }
  }, [currentTrack, audio])

  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime) // Update the current time based on the event
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)

    // Clean up the event listener on unmount
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [audio])

  const playTrack = (track) => {
    // checks if the currentTrack is the same as the one being requested to play
    if (currentTrack?.audio === track.audio) {
      // Toggle play/pause
      isPlaying ? pauseTrack() : audio.play() && setIsPlaying(true)
    } else {
      //---------------------------------------------------
      // If a different track is requested, it pauses the current track, sets the new track, and plays it.
      audio.pause()
      setCurrentTrack(track)
      setCurrentTime(0) // Reset currentTime to 0 for the new track
      audio.play()
      setIsPlaying(true)
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
        currentTime,
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
