import { useEffect } from 'react'
import { useAudio } from '../contexts/AudioContext'

const CurrentlyPlaying = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useAudio()
  console.log('Rendering CurrentlyPlaying component...')

  useEffect(() => {
    console.log('Current track in CurrentlyPlaying:', currentTrack)
  }, [currentTrack])

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
            <audio
              controls
              src={currentTrack.audio}
              autoPlay={isPlaying} // Control autoplay based on the isPlaying state
              onPlay={() =>
                console.log('Audio started playing (CurrentlyPlaying)')
              }
              onPause={() => console.log('Audio paused (CurrentlyPlaying)')}
              onEnded={() => {
                console.log('Audio ended (CurrentlyPlaying)')
                pauseTrack() // Call pauseTrack when the audio ends
              }}
            >
              Your browser does not support the audio element.
            </audio>
            <p className="track-status">{isPlaying ? 'Playing' : 'Paused'}</p>
            <div className="player-controls">
              <button
                className="control-button"
                onClick={() => playTrack(currentTrack)}
              >
                Play
              </button>
              <button className="control-button" onClick={pauseTrack}>
                Pause
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {console.log('No track is currently playing (CurrentlyPlaying)')}
          <p>No track is playing</p>
        </>
      )}
    </div>
  )
}

export default CurrentlyPlaying
