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
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const endpoints = {
  register: '/api/auth/register',
  login: '/api/auth/login',
  profile: '/api/auth/me',
  skillProfile: '/api/skill-profile',
  searchProfiles: '/api/skill-profile/search',
  locations: {
    countries: '/api/skill-profile/locations/countries',
    states: (country) => `/api/skill-profile/locations/states/${country}`
  }
};
