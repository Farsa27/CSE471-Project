// Utility to handle dual URLs with fallback
export const cleanUrl = (urlWithFallback) => {
  // If URL contains pipe (|), return just the primary URL
  // The fallback logic is handled separately
  if (typeof urlWithFallback === 'string' && urlWithFallback.includes('|')) {
    return urlWithFallback.split('|')[0];
  }
  return urlWithFallback;
};

// Fetch wrapper that tries both URLs
export const fetchWithFallback = async (urlWithFallback, options = {}) => {
  const urls = urlWithFallback.includes('|') 
    ? urlWithFallback.split('|') 
    : [urlWithFallback];

  let lastError;

  for (const url of urls) {
    try {
      const response = await fetch(url, options);
      // Return if response is successful or we got a proper response status
      return response;
    } catch (error) {
      lastError = error;
      // Try next URL
      continue;
    }
  }

  // If all failed, throw the last error
  throw lastError || new Error('All API endpoints failed');
};

// Axios wrapper for fallback support
export const getAxiosWithFallback = (axios) => {
  return {
    get: async (urlWithFallback, config = {}) => {
      const urls = urlWithFallback.includes('|') 
        ? urlWithFallback.split('|') 
        : [urlWithFallback];

      let lastError;
      for (const url of urls) {
        try {
          return await axios.get(url, config);
        } catch (error) {
          lastError = error;
          continue;
        }
      }
      throw lastError;
    },

    post: async (urlWithFallback, data, config = {}) => {
      const urls = urlWithFallback.includes('|') 
        ? urlWithFallback.split('|') 
        : [urlWithFallback];

      let lastError;
      for (const url of urls) {
        try {
          return await axios.post(url, data, config);
        } catch (error) {
          lastError = error;
          continue;
        }
      }
      throw lastError;
    },

    put: async (urlWithFallback, data, config = {}) => {
      const urls = urlWithFallback.includes('|') 
        ? urlWithFallback.split('|') 
        : [urlWithFallback];

      let lastError;
      for (const url of urls) {
        try {
          return await axios.put(url, data, config);
        } catch (error) {
          lastError = error;
          continue;
        }
      }
      throw lastError;
    },

    delete: async (urlWithFallback, config = {}) => {
      const urls = urlWithFallback.includes('|') 
        ? urlWithFallback.split('|') 
        : [urlWithFallback];

      let lastError;
      for (const url of urls) {
        try {
          return await axios.delete(url, config);
        } catch (error) {
          lastError = error;
          continue;
        }
      }
      throw lastError;
    },

    patch: async (urlWithFallback, data, config = {}) => {
      const urls = urlWithFallback.includes('|') 
        ? urlWithFallback.split('|') 
        : [urlWithFallback];

      let lastError;
      for (const url of urls) {
        try {
          return await axios.patch(url, data, config);
        } catch (error) {
          lastError = error;
          continue;
        }
      }
      throw lastError;
    },
  };
};
