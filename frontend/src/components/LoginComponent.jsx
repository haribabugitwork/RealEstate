import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import background from '../assets/RealEstate_image_home.jpeg';
import { Eye, EyeOff, Mail, Lock, User, UserCheck } from 'lucide-react';

const AuthComponent = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Agent');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (isRegistering) {
        const res = await axios.post('/auth/register', { email, password, role });
        if (res.data.message === "User registered") setIsRegistering(false);
      } else {
        const res = await axios.post('/auth/login', { email, password });
        const { token, refreshToken } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-white p-5 rounded shadow" style={{ width: '100%', maxWidth: '400px', opacity: 0.95 }}>
        <h2 className="text-center mb-4">{isRegistering ? 'Register' : 'Login'}</h2>

        {error && (
          <div className="alert alert-danger text-center py-2 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="mb-3 position-relative">
              <label className="form-label">Username <span className="text-danger">*</span></label>
              <User size={18} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-secondary" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3 position-relative">
            <label className="form-label">Email <span className="text-danger">*</span></label>
            <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-secondary" />
            <input
              type="email"
              className="form-control ps-5"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {isRegistering && (
            <div className="mb-3 position-relative">
              <label className="form-label">Role <span className="text-danger">*</span></label>
              <UserCheck size={18} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-secondary" />
              <select
                className="form-select ps-5"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="Agent">Agent</option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>
          )}

          <div className="mb-3 position-relative">
            <label className="form-label">Password <span className="text-danger">*</span></label>
            <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-secondary" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control ps-5 pe-5"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isRegistering && (
            <div className="mb-3 position-relative">
              <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
              <Lock size={18} className="position-absolute top-50 start-0 translate-middle-y ms-2 text-secondary" />
              <input
                type="password"
                className="form-control ps-5"
                placeholder="Retype password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-3">
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-3">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthComponent;
