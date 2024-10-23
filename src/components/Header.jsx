import { NavLink, Link } from 'react-router-dom'

const Header = ({ user, handleLogout }) => {
  return (
    <header className="header">
      <h1 className="app-title">Podcast App</h1>
      <nav className="nav-links">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/discover" className="nav-link">
          Discover
        </NavLink>
        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/podcastList" className="nav-link">
          Podcast List
        </NavLink>
        <NavLink to="/history" className="active-link">
          Watch History
        </NavLink>
        <NavLink to="/currently-playing" className="nav-link">
          Currently Playing
        </NavLink>
        <NavLink to="/profile" className="nav-link">
          Profile
        </NavLink>
        <NavLink to="/login" className="nav-link">
          Login
        </NavLink>
        <NavLink to="/register" className="nav-link">
          Register
        </NavLink>
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
