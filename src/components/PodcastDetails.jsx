import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAudio } from '../contexts/AudioContext'
import { FaPlay, FaDownload } from 'react-icons/fa'
import { mockPodcastDetails } from '../mockApi/mockApi'
import axios from 'axios'
import { toast } from 'react-toastify'

const PodcastDetails = ({ navigate }) => {
  const { podcastId } = useParams()
  const [episodes, setEpisodes] = useState([])
  const [podcast, setPodcast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMore, setShowMore] = useState(false)
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
    toast.info('Loading podcast details...', { autoClose: false }) // Show loading toast
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

      toast.dismiss() // Dismiss loading toast
      toast.success('Podcast details loaded successfully!') // Show success toast
    } catch (error) {
      toast.dismiss() // Dismiss loading toast
      if (error.response) {
        if (error.response.status === 404) {
          setError('Podcast not found. Please check the ID or try another one.')
        } else if (error.response.status === 429) {
          setPodcast(mockPodcastDetails)
          setEpisodes(mockPodcastDetails.episodes)
          console.log('Rate limit exceeded, using mock data instead!') // Warn for mock data usage
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

  const handlePlayEpisode = async (episode) => {
    const episodeId = episode.id
    const user = JSON.parse(localStorage.getItem('user'))

    if (!user || !user.id) {
      // Ensure user exists and has an id property
      console.error('User ID not found in local storage.')
      return
    }
    // Extract the userId
    const userId = user.id

    // Now you can use podcastId, episodeId, and userId
    console.log(
      `Podcast ID: ${podcastId}, Episode ID: ${episodeId}, User ID: ${userId}, show title: ${podcast.title}`
    )

    // Create a new history record
    const newHistory = {
      userId,
      podcastId,
      episodeId,
      podcastTitle: podcast.title,
      episodeTitle: episode.title,
      progress: 0, // Initial progress
      totalLength: episode.audio_length_sec
    }

    console.log(newHistory)
    try {
      // Post the new history record to the backend
      await axios.post('http://localhost:4000/history/track', newHistory, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })
    } catch (error) {
      console.error('Error creating history record:', error.message)
    }

    playTrack(episode)
    navigate('/currently-playing')
  }

  const handleDownloadEpisode = async (episode) => {
    const audioUrl = episode.audio
    const episodeTitle = episode.title

    toast.info(`Starting download for "${episodeTitle}"...`)

    try {
      // First, handle the file download part
      const response = await axios.get(audioUrl, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'audio/mpeg' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${episodeTitle}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
      toast.success(`Successfully downloaded "${episodeTitle}"!`)
    } catch (error) {
      console.error('Error downloading episode:', error)
      toast.error(`Failed to download "${episodeTitle}". Please try again.`)
      return // Exit the function if the download fails
    }

    // Second, handle the server call to record the download
    try {
      await axios.post('http://localhost:4000/downloads/record', {
        podcastId: episode.podcast.id,
        podcastTitle: episodeTitle
      })
    } catch (error) {
      console.error('Error recording download to the server:', error)
    }
  }

  useEffect(() => {
    fetchPodcastDetails()
  }, [podcastId])

  if (loading) {
    return null
  }

  if (error) {
    return <div>{error}</div>
  }

  const renderDescription = () => {
    if (!podcast.description) return null
    if (podcast.description.length > 400) {
      return (
        <div>
          <div>
            {showMore
              ? podcast.description
              : podcast.description.slice(0, 400) + '...'}
          </div>
          <div>
            <button
              onClick={() => setShowMore(!showMore)}
              className="show-more-btn"
            >
              {showMore ? 'Show less' : 'Show more'}
            </button>
          </div>
        </div>
      )
    }
    return <p className="podcast-description">{podcast.description}</p>
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
          {renderDescription()} {/* Use the renderDescription function */}
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
