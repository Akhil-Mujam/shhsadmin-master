// axiosInstance.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'https://demohsbackend-production.up.railway.app', // Replace with your backend URL
  withCredentials: true, // Allows cookies to be sent with requests
});


// In-memory token storage
let accessToken = null;
let isRefreshing = false;
let refreshSubscribers = [];

// Function to subscribe to refresh token completion
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Function to notify all subscribers when the token is refreshed
const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Function to set the access token (after login or token refresh)
export const setAuthToken = (token) => {
  accessToken = token;
};

// Request Interceptor to add Authorization header
axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Response Interceptor to handle 401 errors (unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error status is 401 (Unauthorized), try to refresh the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if refresh token is already in progress
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Call the refresh token endpoint
          const refreshResponse = await axiosInstance.put('/userauthdata/refresh');
          const newAccessToken = refreshResponse.data.accessToken;
          
          // Set the new token in memory and update requests
          setAuthToken(newAccessToken);
          onRefreshed(newAccessToken);
          isRefreshing = false;

          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // If the refresh token has also expired, redirect to login
          console.error('Session expired, redirecting to login');
          const navigate = useNavigate();
          navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      // If a token refresh is already in progress, queue the request
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
