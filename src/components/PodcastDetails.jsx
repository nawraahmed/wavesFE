import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// Gain access to the context values
import { useAudio } from '../contexts/AudioContext'
import { FaPlay, FaDownload } from 'react-icons/fa'
import { mockPodcastDetails } from '../mockApi/mockApi'
import axios from 'axios'

const PodcastDetails = ({ navigate }) => {
  const { podcastId } = useParams()
  const [episodes, setEpisodes] = useState([])
  const [podcast, setPodcast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_API_KEY
  const { playTrack } = useAudio()

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [hours > 0 ? `${hours}h` : null, `${minutes}m`, `${secs}s`]
      .filter(Boolean)
      .join(' ')
  }

  const fetchPodcastDetails = async () => {
    try {
      const response = await axios.get(
        `https://listen-api.listennotes.com/api/v2/podcasts/${podcastId}`,
        {
          headers: {
            'X-ListenAPI-Key': apiKey
          }
        }
      )
      setPodcast(response.data)
      setEpisodes(response.data.episodes)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Podcast not found. Please check the ID or try another one.')
        } else if (error.response.status === 429) {
          // Fallback to mock data if status is 429
          setPodcast(mockPodcastDetails)
          setEpisodes(mockPodcastDetails.episodes)
        } else {
          setError('Error fetching podcast details: ' + error.message)
        }
      } else {
        setError('Error fetching podcast details: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePlayEpisode = (episode) => {
    playTrack(episode)
    navigate('/currently-playing')
  }

  const downloadEpisode = async (audioUrl, title) => {
    try {
      alert(`Downloading episode "${title}"...`)

      const response = await fetch(audioUrl)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${title}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading episode:', error)
      alert(
        `Failed to download episode "${title}". Please check your network connection or try again later.`
      )
    }
  }

  const handleDownloadEpisode = async (episode) => {
    try {
      const audioUrl = episode.audio

      // Alert to notify the user that the download has started
      alert(`Downloading episode "${episode.title}"...`)

      const response = await axios.get(audioUrl, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'audio/mpeg' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${episode.title}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Save download data to the backend
      await axios.post('http://localhost:4000/downloads/record', {
        podcastId: episode.podcast.id, // Make sure this matches your podcast ID structure
        podcastTitle: episode.title
      })

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading episode:', error)
      alert(
        `Failed to download episode "${episode.title}". Please check your network connection or try again later.`
      )
    }
  }

  useEffect(() => {
    fetchPodcastDetails()
  }, [podcastId])

  if (loading) {
    return <div>Loading podcast details...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="podcast-details-container">
      {podcast && (
        <div>
          <img
            src={podcast.image}
            alt={podcast.title}
            className="podcast-image"
          />
          <h1 className="podcast-title-details">{podcast.title}</h1>
          <p className="podcast-publisher">Publisher: {podcast.publisher}</p>
          <p className="podcast-country">Country: {podcast.country}</p>
          <p className="podcast-language">Language: {podcast.language}</p>
          <p className="podcast-description">{podcast.description}</p>
        </div>
      )}
      <div className="episode-list">
        <h2>Episodes</h2>
        {episodes.map((episode) => (
          <div className="episode-card" key={episode.id}>
            <div className="episode-thumbnail">
              <img
                src={episode.thumbnail}
                alt={episode.title}
                className="episode-image"
              />
            </div>
            <div className="episode-info">
              <h3 className="episode-title">
                {episode.title}
                <span className="episode-duration">
                  ({formatDuration(episode.audio_length_sec)})
                </span>
              </h3>
              <p className="episode-date">
                {new Date(episode.pub_date_ms).toLocaleDateString()}
              </p>
              <div className="episode-buttons">
                <button onClick={() => handlePlayEpisode(episode)}>
                  <FaPlay /> Play
                </button>
                <button onClick={() => handleDownloadEpisode(episode)}>
                  <FaDownload /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PodcastDetails
