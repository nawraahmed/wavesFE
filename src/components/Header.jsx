import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Header = ({ user, handleLogout }) => {
  return (
    <header className="header">
      <h1>Podcast App</h1>
      <nav>
        <NavLink to="/" className="active-link">
          Home
        </NavLink>
        <NavLink to="/discover" className="active-link">
          Discover
        </NavLink>
        <NavLink to="/podcastList" className="active-link">
          Podcast List
        </NavLink>
        <NavLink to="/profile" className="active-link">
          Profile
        </NavLink>
        <NavLink to="/login" className="active-link">
          Login
        </NavLink>
        <NavLink to="/register" className="active-link">
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
