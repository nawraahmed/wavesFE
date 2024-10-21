import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = ({ setUser }) => {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        'http://localhost:4000/auth/login',
        formValues
      )
      const { token, user } = res.data

      // Store token and user in localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))

      setUser(user)
      navigate('/')
    } catch (err) {
      console.error('Sign-in failed:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Invalid credentials')
    }
  }

  return (
    <div className="signup col">
      <div className="card-overlay centered">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form className="col" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Username/Email"
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn" type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;