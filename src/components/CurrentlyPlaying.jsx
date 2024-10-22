import { useAudio } from '../contexts/AudioContext'

const CurrentlyPlaying = () => {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useAudio()
  console.log('playTrack:', playTrack)
  console.log('Rendering CurrentlyPlaying component...')

  return (
    <div className="currently-playing">
      <h3>Now Playing</h3>
      {currentTrack ? (
        <div>
          {console.log('Current track:', currentTrack)}{' '}
          {/* Log current track details */}
          <p>{currentTrack.title}</p>
          <audio
            controls
            src={currentTrack.audio} // Ensure 'audio' field is consistent
            autoPlay
            onPlay={() => console.log('Audio started playing')} // Log when audio starts playing
            onPause={() => console.log('Audio paused')} // Log when audio is paused
            onEnded={() => console.log('Audio ended')} // Log when audio finishes playing
          >
            Your browser does not support the audio element.
          </audio>
          <p>{isPlaying ? 'Playing' : 'Paused'}</p>
          <div className="player-controls">
            <button
              onClick={() => {
                console.log('Play button clicked') // Log button click
                playTrack(currentTrack) // Log and play track
              }}
            >
              Play
            </button>
            <button
              onClick={() => {
                console.log('Pause button clicked') // Log button click
                pauseTrack() // Pause track
              }}
            >
              Pause
            </button>
          </div>
        </div>
      ) : (
        <>
          {console.log('No track is currently playing')} {/* Log if no track */}
          <p>No track is playing</p>
        </>
      )}
    </div>
  )
}

export default CurrentlyPlaying
