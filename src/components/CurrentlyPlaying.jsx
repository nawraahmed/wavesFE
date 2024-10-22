import { useAudio } from '../contexts/AudioContext'

const CurrentlyPlaying = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack, currentTime } =
    useAudio()

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
