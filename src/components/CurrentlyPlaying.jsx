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
      <h3>Now Playing</h3>
      {currentTrack ? (
        <div>
          {console.log('Current track:', currentTrack)}
          <p>{currentTrack.title}</p>
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
          <p>{isPlaying ? 'Playing' : 'Paused'}</p>
          <div className="player-controls">
            <button onClick={() => playTrack(currentTrack)}>Play</button>
            <button onClick={pauseTrack}>Pause</button>
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
