import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formValues.password !== formValues.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    try {
      const res = await axios.post('http://localhost:4000/auth/register', {
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      });

      setSuccess('Account created successfully!');
      setError('');
      navigate('/login'); 
    } catch (err) {
      console.error('Register failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error signing up.');
    }
  }
  return (
    <div className="signup col">
      <div className="card-overlay centered">
      <h2>Register</h2>
        <form className="col" onSubmit={handleSubmit}>
          <div className="input-wrapper">
          <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username" 
              placeholder="Username"
              value={formValues.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
               placeholder="Email"
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

          <div className="input-wrapper">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formValues.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <p>
            Already have an account? <a href="/login">LogIn</a>
          </p>

          <button
            className="btn"
            disabled={
              !formValues.username ||
              !formValues.email ||
              !formValues.password ||
              formValues.password !== formValues.confirmPassword
            }
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
