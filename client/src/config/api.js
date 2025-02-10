const API_BASE_URL = 'http://localhost:3001';

export const api = {
  baseURL: API_BASE_URL,
  endpoints: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    profile: '/api/auth/me',
    skillProfile: '/api/skill-profile',
    searchProfiles: '/api/skill-profile/search',
    locations: {
      countries: '/api/skill-profile/locations/countries',
      states: (country) => `/api/skill-profile/locations/states/${country}`
    }
  },
  getHeaders: () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }
};
