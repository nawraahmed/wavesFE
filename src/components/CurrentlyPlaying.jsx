import { useEffect, useState } from 'react'
import { useAudio } from '../contexts/AudioContext'
import axios from 'axios' // Import axios for API calls

const CurrentlyPlaying = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack, currentTime } =
    useAudio()
  const [progress, setProgress] = useState(0)
  const user = JSON.parse(localStorage.getItem('user')) // Get the user ID from local storage
  const userId = user.id
  const episodeId = '0e8f68f851394349afa9a7dbadfb35b7' // Get the episode ID from the currentTrack (you might need to pass this down)

  useEffect(() => {
    if (currentTrack) {
      const trackDuration = currentTrack.duration || 950 // Fallback to 15 minutes if no duration
      setProgress((currentTime / trackDuration) * 100)
      updateProgress() // Call update progress function
    }
  }, [currentTime, currentTrack])

  const updateProgress = async () => {
    const progressData = {
      userId,
      podcastId: 'cc01c37cc6b54nkjk5ebw5d3756fcae4cc9f0',
      episodeId,
      progress: currentTime,
      totalLength: currentTrack.duration || 950 // Fallback to 15 minutes if no duration
    }

    try {
      // Put the update progress to the backend with auth token
      await axios.post('http://localhost:4000/history/track', progressData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
    } catch (error) {
      console.error('Error updating history record:', error.message)
    }
  }

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = ('0' + Math.floor(timeInSeconds % 60)).slice(-2)
    return `${minutes}:${seconds}`
  }

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
