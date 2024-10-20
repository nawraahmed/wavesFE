import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LogIn = ({ setUser }) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:4000/auth/login', formValues);
      const { token, user } = res.data;

      // Store token and user in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user); 
      navigate('/home'); 
    } catch (err) {
      console.error('Sign-in failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  }
const Login = () => {
  return (
    <div className="login">
      <h2>Login</h2>
      <input type="text" placeholder="Username/Email" />
      <input type="password" placeholder="Password" />
      <button>Login</button>
    </div>
  )
}
}
export default Login
