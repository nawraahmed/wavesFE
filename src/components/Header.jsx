import { NavLink, Link } from 'react-router-dom'

const Header = ({ user, handleLogout }) => {
  return (
    <header className="header">
      <img src="/logo.png" alt="Podcast App Logo" className="app-logo" />
      <nav className="nav-links">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/discover" className="nav-link">
          Discover
        </NavLink>
        <NavLink to="/podcastList" className="nav-link">
          Podcast Library
        </NavLink>
        <NavLink to="/currently-playing" className="nav-link">
          Currently Playing
        </NavLink>

        {/* Conditionally render Profile link */}
        {user && (
          <NavLink to="/profile" className="nav-link">
            Profile
          </NavLink>
        )}

        {/* Conditionally render either Sign In or Logout */}
        {user ? (
          <button onClick={handleLogout} className="sign-in-btn">
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="sign-in-btn">Login</button>
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Header
