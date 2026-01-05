import axios from 'axios';
import { supabase } from '../supabase';

const API = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
const api = axios.create({ baseURL: API });

api.interceptors.request.use(async (config) => {
    // ASK SUPABASE FOR THE CURRENT TOKEN
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

export default api;