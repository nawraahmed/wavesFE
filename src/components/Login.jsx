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
    <div className="login">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}{' '}
      {/* Display error message if exists */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email" // Set name attribute for controlled input
          placeholder="Username/Email"
          value={formValues.email} // Bind to state
          onChange={handleChange} // Handle change
        />
        <input
          type="password"
          name="password" // Set name attribute for controlled input
          placeholder="Password"
          value={formValues.password} // Bind to state
          onChange={handleChange} // Handle change
        />
        <button type="submit">Login</button>{' '}
        {/* Use type="submit" to trigger form submission */}
      </form>
    </div>
  )
}

export default Login
