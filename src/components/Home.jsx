import { NavLink } from 'react-router-dom'
const Home = () => {
  return (
    <div className="home-container">
      <div className="home-main">
        <div className="home-content">
          <h2>Find Your Favorite Podcast!</h2>
          <NavLink to="/discover" className="discover-button">
            Discover
          </NavLink>
        </div>
        <div className="home-image">
          <img src="public/home-image.png" alt="Search Icon" />
        </div>
      </div>
    </div>
  )
}

export default Home
