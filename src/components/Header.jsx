import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <header className="header">
      <h1>Podcast App</h1>
      <nav>
        <NavLink to="/" exact activeClassName="active-link">
          Home
        </NavLink>
        <NavLink to="/discover" activeClassName="active-link">
          Discover
        </NavLink>
        <NavLink to="/profile" activeClassName="active-link">
          Profile
        </NavLink>
        <NavLink to="/login" activeClassName="active-link">
          Login
        </NavLink>
        <NavLink to="/register" activeClassName="active-link">
          Register
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
