import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { Mail, Shield, CheckCircle, RefreshCw, ArrowLeft, Building, Timer } from 'lucide-react';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState(location.state?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Auto-focus next input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all fields filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
      setOtp(newOtp);
      if (pastedData.length === 6) {
        handleVerifyOTP(pastedData);
      }
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/verify-otp', {
        email: email,
        otp: otpCode
      });

      setSuccess('Email verified successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/auth', { 
          state: { 
            message: 'Email verified! You can now sign in.',
            email: email 
          }
        });
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Invalid verification code');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');
    
    try {
      await axios.post('/auth/resend-otp', { email });
      setSuccess('New verification code sent to your email!');
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      {/* Animated Background Elements */}
      <div className="position-absolute w-100 h-100 overflow-hidden">
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: '250px',
            height: '250px',
            background: 'rgba(255, 255, 255, 0.1)',
            top: '15%',
            left: '15%',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: '180px',
            height: '180px',
            background: 'rgba(255, 255, 255, 0.05)',
            bottom: '25%',
            right: '20%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        />
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            {/* Main Verification Card */}
            <div 
              className="card border-0 shadow-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '25px'
              }}
            >
              {/* Header */}
              <div className="card-header border-0 text-center py-4" style={{ background: 'transparent' }}>
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div 
                    className="rounded-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: success 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    {success ? (
                      <CheckCircle size={40} className="text-white" />
                    ) : (
                      <Shield size={40} className="text-white" />
                    )}
                  </div>
                </div>
                <h3 className="fw-bold mb-2 text-dark">
                  {success ? 'Verification Complete!' : 'Verify Your Email'}
                </h3>
                <p className="text-muted mb-0 px-3">
                  {success 
                    ? 'Your email has been successfully verified'
                    : `We've sent a 6-digit verification code to`
                  }
                </p>
                {!success && (
                  <p className="fw-semibold text-primary mb-0">{email}</p>
                )}
              </div>

              <div className="card-body px-4 pb-4">
                {/* Success Message */}
                {success && (
                  <div 
                    className="alert border-0 text-center py-3 mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      borderRadius: '15px'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <CheckCircle size={18} className="me-2" />
                      {success}
                    </div>
                  </div>
                )}

                {/* Error Message */}
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
                      <Mail size={18} className="me-2" />
                      {error}
                    </div>
                  </div>
                )}

                {!success && (
                  <>
                    {/* OTP Input Fields */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark mb-3 text-center d-block">
                        Enter Verification Code
                      </label>
                      <div className="d-flex justify-content-center gap-2 mb-3">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="form-control text-center fw-bold border-0 bg-light"
                            style={{
                              width: '50px',
                              height: '60px',
                              borderRadius: '15px',
                              fontSize: '24px',
                              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)',
                              transition: 'all 0.3s ease'
                            }}
                            disabled={isLoading}
                          />
                        ))}
                      </div>
                      <p className="text-muted text-center small mb-0">
                        Enter the 6-digit code sent to your email
                      </p>
                    </div>

                    {/* Timer and Resend */}
                    <div className="text-center mb-4">
                      {!canResend ? (
                        <div className="d-flex align-items-center justify-content-center text-muted">
                          <Timer size={16} className="me-2" />
                          <span>Resend code in {formatTime(timeLeft)}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 fw-semibold text-decoration-none d-flex align-items-center justify-content-center"
                          style={{ color: '#667eea' }}
                          onClick={handleResendOTP}
                          disabled={isResending}
                        >
                          {isResending ? (
                            <>
                              <RefreshCw size={16} className="me-2 spinner-border spinner-border-sm" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <RefreshCw size={16} className="me-2" />
                              Resend Verification Code
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Verify Button */}
                    <button 
                      type="button"
                      onClick={() => handleVerifyOTP()}
                      disabled={isLoading || otp.some(digit => digit === '')}
                      className="btn w-100 py-3 border-0 fw-semibold text-white position-relative overflow-hidden mb-3"
                      style={{
                        background: isLoading || otp.some(digit => digit === '') 
                          ? '#6c757d' 
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '15px',
                        fontSize: '16px',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isLoading ? (
                        <span className="d-flex align-items-center justify-content-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Verifying...
                        </span>
                      ) : (
                        <span className="d-flex align-items-center justify-content-center">
                          <Shield size={18} className="me-2" />
                          Verify Email
                        </span>
                      )}
                    </button>
                  </>
                )}

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-link p-0 fw-semibold text-decoration-none d-flex align-items-center justify-content-center"
                    style={{ color: '#667eea' }}
                    onClick={() => navigate('/auth')}
                  >
                    <ArrowLeft size={16} className="me-2" />
                    Back to Login
                  </button>
                </div>

                {/* Help Text */}
                <div className="mt-4 p-3 rounded-3" style={{ background: '#f8f9fa' }}>
                  <h6 className="fw-semibold mb-2 text-dark">
                    <Mail size={16} className="me-2" />
                    Didn't receive the code?
                  </h6>
                  <ul className="small text-muted mb-0 ps-3">
                    <li>Check your spam/junk folder</li>
                    <li>Make sure {email} is correct</li>
                    <li>Wait a few minutes for the email to arrive</li>
                    <li>Click "Resend" if the timer expires</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Notice */}
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
                  <Building size={18} className="me-2" />
                  <small className="fw-medium">
                    🔒 Your security is our priority - RealEstates
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
        
        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3) !important;
          border-color: transparent !important;
          transform: scale(1.05);
        }
        
        .btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4) !important;
        }
        
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }
      `}</style>
    </div>
  );
};

export default OTPVerification;