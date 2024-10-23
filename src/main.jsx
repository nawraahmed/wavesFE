import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AudioProvider } from './contexts/AudioContext'
import { DownloadProvider } from './contexts/DownloadContext' // Import the DownloadProvider
import App from './App.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AudioProvider>
      <DownloadProvider>
        {' '}
        {/* Wrap the App in DownloadProvider */}
        <App />
      </DownloadProvider>
    </AudioProvider>
  </BrowserRouter>
)
