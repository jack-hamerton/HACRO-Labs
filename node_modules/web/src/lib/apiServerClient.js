const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3001';

const apiServerClient = {
  fetch: (path, options = {}) => {
    const url = path.startsWith('/') ? `${apiBaseUrl}${path}` : `${apiBaseUrl}/${path}`;
    
    // Get token from localStorage (either member or admin token)
    const memberToken = localStorage.getItem('memberToken');
    const adminToken = localStorage.getItem('adminToken');
    const token = memberToken || adminToken;
    
    // Prepare headers
    const headers = {
      ...options.headers,
    };
    
    // Add Authorization header if token exists
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return window.fetch(url, {
      credentials: 'include',
      ...options,
      headers,
    });
  },
};

export default apiServerClient;
