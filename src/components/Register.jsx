import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: '',
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
        name: formValues.name,
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
     <div className="register">
      <h2>Register</h2>
      <input type="text" placeholder="Username" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button>Register</button>
    </div>
  )
}

export default Register
