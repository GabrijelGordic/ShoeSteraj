import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        username: '', email: '', password: '', re_password: '' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.re_password) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/users/', formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            console.error(err.response);
            if (err.response && err.response.data) {
                // Try to grab the first error message available
                const firstError = Object.values(err.response.data)[0];
                setError(Array.isArray(firstError) ? firstError[0] : "Registration failed.");
            } else {
                setError("Registration failed. Please try again.");
            }
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            
            {/* --- HEADER --- */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={headingStyle}>Join the Club</h1>
                <p style={subHeadingStyle}>Create an account for exclusive access.</p>
            </div>

            {/* --- ERROR MESSAGE --- */}
            {error && <div style={errorStyle}>{error}</div>}

            {/* --- FORM --- */}
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                
                <div style={groupStyle}>
                    <label style={labelStyle}>USERNAME</label>
                    <input 
                        type="text" 
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        style={inputStyle}
                        placeholder="Choose a username"
                        required
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>EMAIL ADDRESS</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={inputStyle}
                        placeholder="name@example.com"
                        required
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>PASSWORD</label>
                    <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        style={inputStyle}
                        placeholder="At least 8 characters"
                        required
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>CONFIRM PASSWORD</label>
                    <input 
                        type="password" 
                        value={formData.re_password}
                        onChange={(e) => setFormData({...formData, re_password: e.target.value})}
                        style={inputStyle}
                        placeholder="Repeat password"
                        required
                    />
                </div>

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </button>

            </form>

            {/* --- FOOTER LINKS --- */}
            <div style={{ marginTop: '30px' }}>
                <p style={footerTextStyle}>
                    Already a member? <Link to="/login" style={linkStyle}>Sign In</Link>
                </p>
            </div>

            {/* --- GLOBAL FONT FIX --- */}
            <style>{`
                body { font-family: 'Lato', sans-serif; }
                input::placeholder { color: #ccc; font-weight: 300; }
                input:focus { border-bottom: 1px solid #000 !important; }
            `}</style>
        </div>
    );
};

// --- STYLES (Identical to Login.js for consistency) ---

const containerStyle = {
    maxWidth: '450px', // Slightly wider than login for extra fields
    margin: '60px auto',
    padding: '40px',
    textAlign: 'center',
};

const headingStyle = {
    fontFamily: '"Playfair Display", serif',
    fontSize: '2.5rem',
    margin: '0 0 10px 0',
    color: '#111',
    fontWeight: '400'
};

const subHeadingStyle = {
    fontFamily: '"Lato", sans-serif',
    color: '#888',
    fontSize: '0.9rem',
    margin: 0
};

const groupStyle = {
    marginBottom: '25px',
    textAlign: 'left'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    color: '#999',
    letterSpacing: '1px',
    marginBottom: '5px',
    fontWeight: '700'
};

const inputStyle = {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
    padding: '10px 0',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    fontFamily: '"Lato", sans-serif',
    backgroundColor: 'transparent'
};

const buttonStyle = {
    width: '100%',
    padding: '15px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '2px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'opacity 0.2s'
};

const errorStyle = {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    fontSize: '0.9rem',
    marginBottom: '20px',
    borderRadius: '4px'
};

const footerTextStyle = {
    color: '#666',
    fontSize: '0.9rem'
};

const linkStyle = {
    color: '#111',
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginLeft: '5px',
    cursor: 'pointer'
};

export default Register;