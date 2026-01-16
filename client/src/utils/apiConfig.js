// Centralized API configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://mass-transit-back.onrender.com';
export const API_FALLBACK_URL = process.env.REACT_APP_API_FALLBACK_URL || 'https://mass-transit-back.onrender.com';

// Helper function to construct API URLs
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function for fallback URL
export const getApiFallbackUrl = (endpoint) => {
  return `${API_FALLBACK_URL}${endpoint}`;
};
