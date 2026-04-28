const apiBaseUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3001';

const apiServerClient = {
  fetch: (path, options = {}) => {
    const url = path.startsWith('/') ? `${apiBaseUrl}${path}` : `${apiBaseUrl}/${path}`;
    return window.fetch(url, {
      credentials: 'include',
      ...options,
    });
  },
};

export default apiServerClient;
