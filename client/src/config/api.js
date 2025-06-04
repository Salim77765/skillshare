// This is a test comment for Vercel auto-deployment
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle unauthorized errors
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

// API endpoints for reference
export const endpoints = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    verify: '/api/auth/verify'
  },
  skillProfile: {
    create: '/api/skill-profile',
    get: '/api/skill-profile',
    update: '/api/skill-profile',
    uploadImage: '/api/skill-profile/upload-picture',
    search: '/api/skill-profile/search',
    delete: (id) => `/api/skill-profile/${id}`
  },
  locations: {
    countries: '/api/skill-profile/locations/countries',
    states: (country) => `/api/skill-profile/locations/states/${country}`
  }
};
