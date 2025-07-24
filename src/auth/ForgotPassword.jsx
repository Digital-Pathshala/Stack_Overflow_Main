import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); 
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const otpRefs = useRef([...Array(6)].map(() => React.createRef()));

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setStep(2);
      setMessage('OTP sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    // Move to next input if value entered
    if (value && idx < 5) {
      otpRefs.current[idx + 1].current.focus();
    }
    // Move to previous input if backspace on empty
    if (!value && idx > 0 && e.nativeEvent.inputType === "deleteContentBackward") {
      otpRefs.current[idx - 1].current.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: otpValue.trim()
      });
      setStep(3);
      setMessage('OTP verified. Please enter your new password.');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const otpValue = otp.join('');
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp: otpValue,
        newPassword
      });
      setMessage('Password reset! You can now login.');
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" className="forgot-btn">Send OTP</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label>Enter 6-digit OTP</label>
              <div className="otp-inputs">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={otpRefs.current[idx]}
                    onChange={e => handleOtpChange(e, idx)}
                    className="otp-box"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="forgot-btn">Verify OTP</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <div className="input password-input">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowNewPassword(prev => !prev)}
                  style={{ cursor: 'pointer' }}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="forgot-btn">Reset Password</button>
          </form>
        )}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        {step === 4 && (
          <div className="after-reset">
            <a href="/login" className="login-link">Go to Login</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;