import React, { createContext, useState } from 'react'

// Create the Download context
export const DownloadContext = createContext()

// Create the provider component
export const DownloadProvider = ({ children }) => {
  const [downloadHistory, setDownloadHistory] = useState([])

  const logDownload = (episodeTitle) => {
    setDownloadHistory((prevHistory) => [
      ...prevHistory,
      { title: episodeTitle, timestamp: new Date() }
    ])
  }

  return (
    <DownloadContext.Provider value={{ downloadHistory, logDownload }}>
      {children}
    </DownloadContext.Provider>
  )
}
