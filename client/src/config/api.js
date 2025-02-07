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

// API endpoints for reference
export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/me'
  },
  skillProfile: {
    create: '/api/skill-profile',
    search: '/api/skill-profile/search',
    update: (id) => `/api/skill-profile/${id}`,
    delete: (id) => `/api/skill-profile/${id}`
  },
  locations: {
    countries: '/api/skill-profile/locations/countries',
    states: (country) => `/api/skill-profile/locations/states/${country}`
  }
};
