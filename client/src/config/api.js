import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Define API endpoints
export const endpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  profile: '/api/auth/me',
  skillProfile: '/api/skill-profile',
  searchProfiles: '/api/skill-profile/search',
  locations: {
    countries: '/api/skill-profile/locations/countries',
    states: (country) => `/api/skill-profile/locations/states/${country}`
  }
};

// Create axios instance
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
