import { useEffect, useState } from 'react'
import { useAudio } from '../contexts/AudioContext'

const CurrentlyPlaying = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack, currentTime } =
    useAudio()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentTrack) {
      const trackDuration = currentTrack.duration || 950 // Fallback to 15 minutes if no duration
      setProgress((currentTime / trackDuration) * 100)
    }
  }, [currentTime, currentTrack])

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = ('0' + Math.floor(timeInSeconds % 60)).slice(-2)
    return `${minutes}:${seconds}`
  }

  return (
    <div className="currently-playing">
      <h3 className="cp-heading">Now Playing</h3>
      {currentTrack ? (
        <div className="track-info">
          <div className="track-image">
            <img src={currentTrack.thumbnail} alt={currentTrack.title} />
          </div>
          <div className="track-details">
            <p className="track-title">{currentTrack.title}</p>
            <p className="track-status">{isPlaying ? 'Playing' : 'Paused'}</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="track-time-info">
              <p className="track-time">{formatTime(currentTime)}</p>
              <p className="track-duration">
                {formatTime(currentTrack.duration || 950)}
              </p>
            </div>
            <div className="player-controls">
              <button
                className="control-button"
                onClick={() => playTrack(currentTrack)}
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
