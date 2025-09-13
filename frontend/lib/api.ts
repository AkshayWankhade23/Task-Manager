// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api', // your Express backend base URL
  withCredentials: true, // important if you're using cookies
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use((config) => {
  // Check if we have a token in localStorage
  const token = localStorage.getItem('accessToken');
  
  // If token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token (401) and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshResponse = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
        const newToken = refreshResponse.data.accessToken;
        
        if (newToken) {
          // Update the token in localStorage
          localStorage.setItem('accessToken', newToken);
          
          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Retry the original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear auth data and reject
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Redirect to login if we're in a browser environment
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const getMe = async () => {
  try {
    // Try to get user data from local storage first
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('No token found');
    }
    
    // We have user data cached and a token
    if (userString) {
      try {
        return { user: JSON.parse(userString) };
      } catch (e) {
        // Invalid JSON in localStorage, clear it
        localStorage.removeItem('user');
      }
    }
    
    // If not in local storage or invalid, fetch from API
    const res = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Cache the user data for future use
    localStorage.setItem('user', JSON.stringify(res.data.user));
    
    return res.data;
  } catch (error) {
    console.error('Error getting user:', error);
    // Clear any potentially invalid data
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    throw error;
  }
};
