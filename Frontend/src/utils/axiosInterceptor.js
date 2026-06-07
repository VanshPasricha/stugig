import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://stugig-backend.onrender.com',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Fetch token from localStorage before each request
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            if (parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401s (unauthorized/expired token)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is expired or invalid
            localStorage.removeItem('userInfo');
            window.location.href = '/login'; // Force logout
        }
        return Promise.reject(error);
    }
);

export default api;
