// src/components/OTPVerification.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import {
  Mail,
  Shield,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  Building,
  Timer
} from 'lucide-react';
import '../styles/OTPVerification.css';

export default function OTPVerification() {
  const navigate = useNavigate();
  const email = useLocation().state?.email || '';
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [seconds, setSeconds] = useState(300);
  
  // Single string state instead of array - this often fixes display issues
  const [otpValue, setOtpValue] = useState('');
  const inputRefs = useRef([]);
  const isUpdatingRef = useRef(false);
  const isSubmittingRef = useRef(false);  // Add this to prevent double submissions

  // Countdown timer
  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  // Auto-focus first input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-submit when complete - DISABLED to prevent double submissions
  // useEffect(() => {
  //   if (otpValue.length === 6 && !loading && !isSubmittingRef.current) {
  //     console.log('Auto-submit triggered for OTP:', otpValue);
  //     const timer = setTimeout(() => {
  //       if (!isSubmittingRef.current) {  // Double-check before submitting
  //         handleSubmit(otpValue);
  //       }
  //     }, 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [otpValue, loading]);

  // Get individual digit for display
  const getDigit = (index) => {
    return otpValue[index] || '';
  };

  // Handle input change - much simpler approach
  const handleInputChange = (index, value) => {
    if (loading || resending) return;
    
    console.log(`Input ${index} changed to: "${value}"`);
    
    // Get just the numeric part
    const numericValue = value.replace(/\D/g, '');
    const digit = numericValue.slice(-1); // Last digit entered
    
    console.log(`Processed digit: "${digit}"`);
    
    // Build new OTP value
    const currentArray = Array.from({length: 6}, (_, i) => otpValue[i] || '');
    currentArray[index] = digit;
    const newOtpValue = currentArray.join('').replace(/\s+/g, '');
    
    console.log(`New OTP value: "${newOtpValue}"`);
    setOtpValue(newOtpValue);
    setError('');

    // Move to next input if we have a digit and not at last position
    if (digit && index < 5) {
      setTimeout(() => {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
          inputRefs.current[index + 1].select();
        }
      }, 50);
    }
  };

  // Handle backspace and navigation
  const handleKeyDown = (index, e) => {
    console.log(`Key pressed: ${e.key} at index ${index}`);
    
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const currentArray = Array.from({length: 6}, (_, i) => otpValue[i] || '');
      
      if (currentArray[index]) {
        // Clear current digit
        currentArray[index] = '';
        setOtpValue(currentArray.join('').replace(/\s+/g, ''));
      } else if (index > 0) {
        // Move to previous and clear
        currentArray[index - 1] = '';
        setOtpValue(currentArray.join('').replace(/\s+/g, ''));
        
        setTimeout(() => {
          if (inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
            inputRefs.current[index - 1].select();
          }
        }, 50);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      setTimeout(() => {
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
          inputRefs.current[index - 1].select();
        }
      }, 10);
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      setTimeout(() => {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
          inputRefs.current[index + 1].select();
        }
      }, 10);
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const digits = pastedText.replace(/\D/g, '').slice(0, 6);
    
    console.log(`Pasted: "${digits}"`);
    
    if (digits.length > 0) {
      setOtpValue(digits);
      
      // Focus appropriate input
      const nextIndex = Math.min(digits.length, 5);
      setTimeout(() => {
        if (inputRefs.current[nextIndex]) {
          inputRefs.current[nextIndex].focus();
        }
      }, 10);
    }
  };

  // Submit OTP
  const handleSubmit = async (code = null) => {
    // Prevent double submissions
    if (isSubmittingRef.current) {
      console.log('Submission already in progress, skipping...');
      return;
    }
    
    const submitCode = code || otpValue;
    
    if (submitCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    isSubmittingRef.current = true;  // Set submission flag
    setLoading(true);
    setError('');

    try {
      console.log('Submitting OTP:', submitCode);
      console.log('Email for verification:', email);
      
      // Add more detailed request logging
      const requestData = { 
        email, 
        otp: submitCode 
      };
      console.log('Request data:', requestData);
      
      // Create a new axios instance without interceptors for OTP verification
      const cleanAxios = axios.create({
        baseURL: axios.defaults.baseURL || 'http://localhost:9000/api',
        timeout: axios.defaults.timeout || 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Clean axios baseURL:', cleanAxios.defaults.baseURL);
      console.log('Making OTP request without interceptors...');
      const { data } = await cleanAxios.post('/auth/verify-otp', requestData);
      
      console.log('Verification successful:', data);
      setSuccess('✔️ Email verified!');
      
      // Clear any existing tokens before setting new ones
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Set new tokens
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      console.log('Tokens stored, navigating to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('OTP Verification Error:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error response full:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error message:', err.message);
      
      // Log the actual error message from server
      if (err.response?.data) {
        console.error('Server error details:', JSON.stringify(err.response.data, null, 2));
      }
      
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Invalid code. Please try again.';
      
      // Show specific error message based on server response
      if (errorMessage.includes('expired') || errorMessage.includes('Invalid or expired')) {
        setError('🕒 OTP has expired or already been used. Please request a new code.');
      } else {
        setError(errorMessage);
      }
      
      // Clear and refocus
      setOtpValue('');
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;  // Reset submission flag
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resending) return;
    
    setResending(true);
    setError('');

    try {
      // Create clean axios instance for resend as well
      const cleanAxios = axios.create({
        baseURL: axios.defaults.baseURL || 'http://localhost:9000/api',
        timeout: axios.defaults.timeout || 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      await cleanAxios.post('/auth/send-otp', { email });
      setSuccess('🔁 New code sent! Check your email.');
      setCanResend(false);
      setSeconds(300);
      setOtpValue('');
      
      setTimeout(() => {
        setSuccess('');
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 2000);
    } catch (err) {
      console.error('Resend OTP Error:', err);
      setError(err.response?.data?.error || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  // Format time
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Debug current state
  useEffect(() => {
    console.log('Current OTP state:', {
      otpValue: otpValue,
      length: otpValue.length,
      digits: otpValue.split('').map((d, i) => `${i}: "${d}"`),
      displayValues: Array.from({length: 6}, (_, i) => `${i}: "${getDigit(i)}"`)
    });
  }, [otpValue]);

  return (
    <div className="otp-page">
      <div className="otp-card">
        {/* Header */}
        <div className="otp-header">
          <div className="otp-icon">
            {success ? <CheckCircle size={40}/> : <Shield size={40}/>}
          </div>
          <h3>{success || 'Verify Your Email'}</h3>
          {!success && <p>Enter the 6-digit code sent to <b>{email}</b></p>}
        </div>

        {/* Body */}
        <div className="otp-body">
          {error && (
            <div className="alert error">
              <Mail size={18}/> {error}
            </div>
          )}
          
          {success && (
            <div className="alert success">
              <CheckCircle size={18}/> {success}
            </div>
          )}

          {!success && (
            <>
              <div className="otp-inputs">
                {Array.from({length: 6}, (_, index) => (
                  <input
                    key={`otp-input-${index}`}
                    ref={el => inputRefs.current[index] = el}
                    className="otp-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={getDigit(index)}
                    disabled={loading || resending}
                    onChange={(e) => {
                      console.log(`onChange fired for index ${index}, value: "${e.target.value}"`);
                      handleInputChange(index, e.target.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : null}
                    onFocus={(e) => {
                      console.log(`Input ${index} focused`);
                      e.target.select();
                    }}
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                ))}
              </div>

              <div className="otp-resend">
                {canResend ? (
                  <button 
                    onClick={handleResend} 
                    disabled={resending}
                    type="button"
                  >
                    <RefreshCw size={16}/> 
                    {resending ? ' Sending…' : ' Resend Code'}
                  </button>
                ) : (
                  <span>
                    <Timer size={16}/> {formatTime(seconds)}
                  </span>
                )}
              </div>

              <button
                className="otp-verify-btn"
                onClick={() => handleSubmit()}
                disabled={loading || resending}
                type="button"
              >
                {loading ? 'Verifying…' : 'Verify Email'}
              </button>
            </>
          )}

          <button 
            className="back-btn" 
            onClick={() => navigate('/auth')}
            type="button"
          >
            <ArrowLeft size={16}/> Back to Login
          </button>
        </div>

        {/* Footer */}
        <div className="otp-footer">
          <Building size={18}/> 
          <small>🔒 Secured by RealEstates</small>
        </div>
      </div>
    </div>
  );
}