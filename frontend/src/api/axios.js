// frontend/src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9000/api',  // <-- direct to your Gateway
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor with debugging
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log('🔍 Axios Interceptor - Token from localStorage:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Axios Interceptor - Authorization header set:', config.headers.Authorization);
    } else {
      console.log('❌ Axios Interceptor - No token found in localStorage');
    }
    
    console.log('📋 Axios Interceptor - Final config:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers
    });
    
    return config;
  },
  error => {
    console.error('❌ Axios Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with debugging
instance.interceptors.response.use(
  response => {
    console.log('✅ Axios Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('❌ Axios Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
      fullError: error
    });
    
    // Handle token expiration
    if (error.response?.status === 401) {
      console.log('🔄 Token might be expired or invalid');
      // You can add auto-refresh logic here later
      // handleTokenRefresh();
    }
    
    return Promise.reject(error);
  }
);

// Optional: Add a function to manually refresh token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.post('http://localhost:9000/api/auth/refresh', {
      refreshToken: refreshToken
    });
    
    const { token, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', newRefreshToken);
    
    console.log('✅ Token refreshed successfully');
    return token;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    // Clear tokens and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // window.location.href = '/login'; // Uncomment if needed
    throw error;
  }
};

// Export the instance and refresh function
export default instance;
export { refreshToken };