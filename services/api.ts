import axios from 'axios';

const api = axios.create({
  // In a real production environment, this would be an environment variable
  // For this example, we assume the backend runs on port 5000
  baseURL: 'http://localhost:5000/api', 
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
