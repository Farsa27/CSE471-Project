import axios from 'axios';

// Create an axios instance with fallback logic
const createAxiosWithFallback = () => {
  let currentUrl = process.env.REACT_APP_API_BASE_URL || 'https://mass-transit-back.onrender.com';
  const fallbackUrl = 'https://mass-transit-back.onrender.com';
  
  console.log('🔧 API BaseURL:', currentUrl);

  const instance = axios.create({
    baseURL: currentUrl,
  });

  // Response interceptor to handle fallback
  instance.interceptors.response.use(
    response => response,
    async error => {
      // Check if the request was made with the primary URL
      const originalRequest = error.config;
      
      // If not yet retried and primary failed, try fallback
      if (!originalRequest._retry && currentUrl !== fallbackUrl) {
        originalRequest._retry = true;
        
        // Update base URL to fallback
        originalRequest.baseURL = fallbackUrl;
        instance.defaults.baseURL = fallbackUrl;
        currentUrl = fallbackUrl;
        
        // Retry the request
        return instance(originalRequest);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = createAxiosWithFallback();

// Custom fetch with fallback
export const fetchWithFallback = async (urlWithFallback, options = {}) => {
  const urls = urlWithFallback.includes('|') 
    ? urlWithFallback.split('|') 
    : [urlWithFallback];

  let lastError;

  for (const url of urls) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status < 500) {
        return response;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) throw lastError;
  throw new Error('All URLs failed');
};

export default axiosInstance;
