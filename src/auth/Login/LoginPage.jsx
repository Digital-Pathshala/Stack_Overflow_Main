// Frontend/src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEmail } from 'react-icons/md';
import { FaUnlockKeyhole } from 'react-icons/fa6';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect based on user role
        if (response.data.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='container'>
        <div className='header'>
          <div className='text'>Log In to Stack Overflow</div>
          <div className='underline'></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='inputs'>
            <div className='input'>
              <MdEmail />
              <input
                type='email'
                placeholder='Enter your Email...'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='input'>
              <FaUnlockKeyhole />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className='forgot-password'>
            <label>
              <input type='checkbox' /> Remember me
            </label>
            <span onClick={() => navigate('/forgot-password')}>Forgot password?</span>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className='submit-container'>
            <button className='submit' type='submit' disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
        <div className='account'>
          Don't have an account? <span onClick={() => navigate('/register')}>Sign up</span>
        </div>
        <div className="google-btn-container">
          <a href="http://localhost:5000/api/auth/google">
            <button className="google-btn">Login with Google</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;