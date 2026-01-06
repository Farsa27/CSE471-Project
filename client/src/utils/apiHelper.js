// Helper function to make API requests with automatic fallback between URLs
export async function fetchWithFallback(url, options = {}) {
  // Split URL if it contains pipe separator (dual URL format)
  const urls = url.includes('|') ? url.split('|') : [url];
  
  let lastError;
  
  for (const apiUrl of urls) {
    try {
      const response = await fetch(apiUrl, options);
      
      // If response is ok or we get a response with status, return it
      if (response.ok || response.status) {
        return response;
      }
    } catch (error) {
      lastError = error;
      // Continue to next URL
      continue;
    }
  }
  
  // If all URLs failed, throw the last error
  if (lastError) {
    throw lastError;
  }
  
  // Fallback error if no URLs were provided
  throw new Error('No valid URLs provided');
}

// Axios wrapper with fallback support
export function axiosWithFallback(axiosInstance) {
  return {
    get: async (url, config) => {
      const urls = url.includes('|') ? url.split('|') : [url];
      
      for (const apiUrl of urls) {
        try {
          return await axiosInstance.get(apiUrl, config);
        } catch (error) {
          if (apiUrl === urls[urls.length - 1]) {
            throw error;
          }
          continue;
        }
      }
    },
    
    post: async (url, data, config) => {
      const urls = url.includes('|') ? url.split('|') : [url];
      
      for (const apiUrl of urls) {
        try {
          return await axiosInstance.post(apiUrl, data, config);
        } catch (error) {
          if (apiUrl === urls[urls.length - 1]) {
            throw error;
          }
          continue;
        }
      }
    },
    
    put: async (url, data, config) => {
      const urls = url.includes('|') ? url.split('|') : [url];
      
      for (const apiUrl of urls) {
        try {
          return await axiosInstance.put(apiUrl, data, config);
        } catch (error) {
          if (apiUrl === urls[urls.length - 1]) {
            throw error;
          }
          continue;
        }
      }
    },
    
    delete: async (url, config) => {
      const urls = url.includes('|') ? url.split('|') : [url];
      
      for (const apiUrl of urls) {
        try {
          return await axiosInstance.delete(apiUrl, config);
        } catch (error) {
          if (apiUrl === urls[urls.length - 1]) {
            throw error;
          }
          continue;
        }
      }
    },
    
    patch: async (url, data, config) => {
      const urls = url.includes('|') ? url.split('|') : [url];
      
      for (const apiUrl of urls) {
        try {
          return await axiosInstance.patch(apiUrl, data, config);
        } catch (error) {
          if (apiUrl === urls[urls.length - 1]) {
            throw error;
          }
          continue;
        }
      }
    },
  };
}
