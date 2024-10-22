import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AudioProvider } from './contexts/AudioContext'
import App from './App.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AudioProvider>
      <App />
    </AudioProvider>
  </BrowserRouter>
)
