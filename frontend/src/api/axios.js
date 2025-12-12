import axios from 'axios';

// 1. Create the instance with the backend URL
const api = axios.create({
    baseURL: 'http://localhost:8000', 
    // We point to port 8000 where Django is listening
});

// 2. The Interceptor (The Security Guard)
// Before every request, check if we have a token in LocalStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // If token exists, attach it to the header: "Authorization: Token xyz123"
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api;