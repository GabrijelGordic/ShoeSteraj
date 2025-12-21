import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Check if user is already logged in when app starts
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Ask Django: "Who belongs to this token?"
                    const res = await api.get('/auth/users/me/');
                    setUser(res.data);
                } catch (error) {
                    console.error("Token invalid", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // 2. Login Function
    const login = async (username, password) => {
        // Get Token
        const res = await api.post('/auth/token/login/', { username, password });
        const token = res.data.auth_token;
        
        localStorage.setItem('token', token);
        
        // Get User Details immediately after
        const userRes = await api.get('/auth/users/me/');
        setUser(userRes.data);
    };

    // 3. Logout Function
    const logout = async () => {
        try {
            // 1. Tell backend to destroy the token (while we still have it!)
            await api.post('/auth/token/logout/');
        } catch (err) {
            // If token is already invalid/expired, just ignore the error
            console.log("Logout backend error (harmless):", err);
        } finally {
            // 2. ALWAYS clear local storage and state
            localStorage.removeItem('token');
            setUser(null);
            
            // Remove the header from future requests
            delete api.defaults.headers.common['Authorization'];
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;