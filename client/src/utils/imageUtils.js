const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getProfilePictureUrl = (path) => {
  if (!path) return undefined;
  
  // If it's already a full URL, return it as is
  if (path.startsWith('http')) return path;
  
  // Remove any leading double slashes from path and trailing slash from baseUrl
  const cleanPath = path.replace(/^\/+/, '');
  const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, '');
  
  // Combine the base URL and path
  return `${cleanBaseUrl}/${cleanPath}`;
};
