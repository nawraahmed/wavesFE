import { useEffect } from 'react'
import { useAudio } from '../contexts/AudioContext'
import { saveWatchHistory } from '../mockApi/mockApi' // Adjust import as necessary

const CurrentlyPlaying = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack, currentTime } =
    useAudio()

  // Save progress when the user plays/pauses or navigates away
  useEffect(() => {
    if (currentTrack) {
      const saveProgress = async () => {
        try {
          await saveWatchHistory(currentTrack.id, currentTime) // Save podcast and progress
        } catch (error) {
          console.error('Error saving history:', error)
        }
      }

      // Save progress when pausing
      if (!isPlaying) {
        saveProgress()
      }

      // Optionally, save progress every 60 seconds if the user is still listening
      const intervalId = setInterval(() => {
        saveProgress()
      }, 60000)

      // Clear interval when component is unmounted or track changes
      return () => clearInterval(intervalId)
    }
  }, [currentTrack, currentTime, isPlaying])

  return (
    <div className="currently-playing">
      <h3>Now Playing</h3>
      {currentTrack ? (
        <div className="track-info">
          <div className="track-image">
            <img src={currentTrack.thumbnail} alt={currentTrack.title} />
          </div>
          <div className="track-details">
            <p className="track-title">{currentTrack.title}</p>
            <p className="track-status">{isPlaying ? 'Playing' : 'Paused'}</p>
            <p className="track-time">
              {Math.floor(currentTime / 60)}:
              {('0' + Math.floor(currentTime % 60)).slice(-2)}
            </p>
            <div className="player-controls">
              <button
                className="control-button"
                onClick={() =>
                  isPlaying ? pauseTrack() : playTrack(currentTrack)
                }
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No track is playing</p>
      )}
    </div>
  )
}

export default CurrentlyPlaying
