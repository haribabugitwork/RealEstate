import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Eye, EyeOff, Mail, Lock, User, UserCheck, Building, Home, ArrowRight, Shield } from 'lucide-react';

const AuthComponent = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Tenant'); // Changed to match backend
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debug state
  const [debugInfo, setDebugInfo] = useState('');

  const addDebugInfo = (info) => {
    console.log('Debug:', info);
    setDebugInfo(prev => prev + '\n' + new Date().toLocaleTimeString() + ': ' + info);
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    addDebugInfo(`Sending OTP to: ${email}`);

    try {
      const res = await axios.post('/auth/send-otp', { email });
      addDebugInfo(`OTP Send Response: ${JSON.stringify(res.data)}`);
      
      // Navigate to dedicated OTP verification page
      navigate('/otp-verification', { state: { email } });
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send OTP';
      addDebugInfo(`OTP Send Error: ${errorMsg}`);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    addDebugInfo(`${isRegistering ? 'Registration' : 'Login'} attempt for: ${email}`);

    try {
      if (isRegistering) {
        const res = await axios.post('/auth/register', { 
          email, 
          password, 
          username, 
          role 
        });
        addDebugInfo(`Registration Response: ${JSON.stringify(res.data)}`);
        
        if (res.data.message === "User registered") {
          setSuccess('Registration successful! Please sign in.');
          setIsRegistering(false);
        }
      } else {
        // Traditional login
        const res = await axios.post('/auth/login', { email, password });
        addDebugInfo(`Login Response: ${JSON.stringify(res.data)}`);
        
        const { token, refreshToken } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Something went wrong';
      addDebugInfo(`${isRegistering ? 'Registration' : 'Login'} Error: ${errorMsg}`);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        background: `linear-gradient(135deg, 
          rgba(102, 126, 234, 0.9) 0%, 
          rgba(118, 75, 162, 0.9) 50%,
          rgba(102, 126, 234, 0.8) 100%
        ),
        url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Debug Panel - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div 
          className="position-fixed top-0 end-0 bg-dark text-white p-2 m-2 rounded"
          style={{ 
            width: '300px', 
            height: '200px', 
            fontSize: '10px', 
            overflow: 'auto',
            zIndex: 9999,
            opacity: 0.8
          }}
        >
          <strong>Debug Log:</strong>
          <pre>{debugInfo}</pre>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100 overflow-hidden">
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.1)',
            top: '10%',
            left: '10%',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.05)',
            bottom: '20%',
            right: '15%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        />
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            {/* Main Auth Card */}
            <div 
              className="card border-0 shadow-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '25px'
              }}
            >
              {/* Header with Brand */}
              <div className="card-header border-0 text-center py-4" style={{ background: 'transparent' }}>
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div 
                    className="rounded-4 d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <Building size={30} className="text-white" />
                  </div>
                </div>
                <h3 className="fw-bold mb-2 text-dark">RealEstates</h3>
                <p className="text-muted mb-0">
                  {isRegistering ? 'Create your account' : 'Welcome back'}
                </p>
              </div>

              <div className="card-body px-4 pb-4">
                {/* Toggle Tabs */}
                <div className="d-flex mb-4 p-1 rounded-4" style={{ background: '#f8f9fa' }}>
                  <button
                    type="button"
                    className={`btn flex-fill py-2 border-0 fw-semibold transition-all ${
                      !isRegistering 
                        ? 'text-white shadow-sm' 
                        : 'text-muted bg-transparent'
                    }`}
                    style={{
                      background: !isRegistering 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : 'transparent',
                      borderRadius: '12px'
                    }}
                    onClick={() => setIsRegistering(false)}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={`btn flex-fill py-2 border-0 fw-semibold transition-all ${
                      isRegistering 
                        ? 'text-white shadow-sm' 
                        : 'text-muted bg-transparent'
                    }`}
                    style={{
                      background: isRegistering 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : 'transparent',
                      borderRadius: '12px'
                    }}
                    onClick={() => setIsRegistering(true)}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Success Alert */}
                {success && (
                  <div 
                    className="alert border-0 text-center py-3 mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
                      color: 'white',
                      borderRadius: '15px'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-check-circle me-2"></i>
                      {success}
                    </div>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div 
                    className="alert border-0 text-center py-3 mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                      color: 'white',
                      borderRadius: '15px'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  </div>
                )}

                {/* Login/Register Form */}
                <form onSubmit={handleSubmit}>
                  {isRegistering && (
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark mb-2">
                        Username <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <User 
                          size={18} 
                          className="position-absolute top-50 translate-middle-y text-muted"
                          style={{ left: '15px', zIndex: 10 }}
                        />
                        <input
                          type="text"
                          className="form-control border-0 bg-light ps-5 py-3"
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          style={{
                            borderRadius: '15px',
                            fontSize: '15px',
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <Mail 
                        size={18} 
                        className="position-absolute top-50 translate-middle-y text-muted"
                        style={{ left: '15px', zIndex: 10 }}
                      />
                      <input
                        type="email"
                        className="form-control border-0 bg-light ps-5 py-3"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          borderRadius: '15px',
                          fontSize: '15px',
                          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                        }}
                      />
                    </div>
                  </div>

                  {isRegistering && (
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark mb-2">
                        Role <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <UserCheck 
                          size={18} 
                          className="position-absolute top-50 translate-middle-y text-muted"
                          style={{ left: '15px', zIndex: 10 }}
                        />
                        <select
                          className="form-select border-0 bg-light ps-5 py-3"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                          style={{
                            borderRadius: '15px',
                            fontSize: '15px',
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          <option value="Owner">Property Owner</option>
                          <option value="Agent">Real Estate Agent</option>
                          <option value="Tenant">Property Tenant</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="position-relative">
                      <Lock 
                        size={18} 
                        className="position-absolute top-50 translate-middle-y text-muted"
                        style={{ left: '15px', zIndex: 10 }}
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control border-0 bg-light ps-5 pe-5 py-3"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                          borderRadius: '15px',
                          fontSize: '15px',
                          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                        }}
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
                      </button>
                    </div>
                  </div>

                  {isRegistering && (
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark mb-2">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <Lock 
                          size={18} 
                          className="position-absolute top-50 translate-middle-y text-muted"
                          style={{ left: '15px', zIndex: 10 }}
                        />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-control border-0 bg-light ps-5 pe-5 py-3"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          style={{
                            borderRadius: '15px',
                            fontSize: '15px',
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                          }}
                        />
                        <button
                          type="button"
                          className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {!isRegistering && (
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="text-decoration-none" style={{ color: '#667eea' }}>
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn w-100 py-3 border-0 fw-semibold text-white position-relative overflow-hidden mb-3"
                    style={{
                      background: loading 
                        ? '#dee2e6' 
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '15px',
                      fontSize: '16px',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span className="d-flex align-items-center justify-content-center">
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          {isRegistering ? 'Creating...' : 'Signing In...'}
                        </>
                      ) : (
                        <>
                          {isRegistering ? 'Create Account' : 'Sign In'}
                          <ArrowRight size={18} className="ms-2" />
                        </>
                      )}
                    </span>
                  </button>

                  {/* OTP Login Option - Only for non-registration */}
                  {!isRegistering && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || !email}
                      className="btn btn-outline-primary w-100 py-3 border-2 fw-semibold mb-4"
                      style={{
                        borderRadius: '15px',
                        fontSize: '16px',
                        borderColor: '#667eea',
                        color: '#667eea'
                      }}
                    >
                      <span className="d-flex align-items-center justify-content-center">
                        {loading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Sending OTP...
                          </>
                        ) : (
                          <>
                            <Shield size={18} className="me-2" />
                            Login with OTP
                          </>
                        )}
                      </span>
                    </button>
                  )}
                </form>

                {/* Footer Links */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-2">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                  </p>
                  <button
                    type="button"
                    className="btn btn-link p-0 fw-semibold text-decoration-none"
                    style={{ color: '#667eea' }}
                    onClick={() => {
                      setIsRegistering(!isRegistering);
                      setError(null);
                      setSuccess(null);
                    }}
                  >
                    {isRegistering ? 'Sign In Here' : 'Create New Account'}
                  </button>
                </div>

                {/* Social Login Options */}
                <div className="mt-4">
                  <div className="position-relative text-center mb-3">
                    <hr className="text-muted" />
                    <span 
                      className="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted small"
                    >
                      Or continue with
                    </span>
                  </div>
                  
                  <div className="row g-2">
                    <div className="col-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary w-100 py-2 border-2"
                        style={{ borderRadius: '12px' }}
                      >
                        <i className="bi bi-google me-1"></i>
                        Google
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary w-100 py-2 border-2"
                        style={{ borderRadius: '12px' }}
                      >
                        <i className="bi bi-microsoft me-1"></i>
                        Microsoft
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info Card */}
            <div className="text-center mt-4">
              <div 
                className="card border-0 py-3 px-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px'
                }}
              >
                <div className="d-flex align-items-center justify-content-center text-white">
                  <Home size={18} className="me-2" />
                  <small className="fw-medium">
                    Trusted by 10,000+ property professionals worldwide
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          border-color: transparent !important;
        }
        
        .btn:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default AuthComponent;