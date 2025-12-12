import React, { useState } from 'react';
import api from '../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Djoser endpoint to trigger the email
            await api.post('/auth/users/reset_password/', { email });
            setMessage('If an account exists, an email has been sent.');
        } catch (err) {
            // For security, we usually show the same message even if email fails, 
            // but for dev we log it.
            console.error(err);
            setMessage('If an account exists, an email has been sent.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Reset Password</h1>
            <p style={subHeadingStyle}>Enter your email to receive a reset link.</p>

            {message && <div style={successStyle}>{message}</div>}

            <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
                <div style={groupStyle}>
                    <label style={labelStyle}>EMAIL ADDRESS</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        placeholder="name@example.com"
                        required
                    />
                </div>

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'SENDING...' : 'SEND RESET LINK'}
                </button>
            </form>
        </div>
    );
};

// --- STYLES (Matching Login.js) ---
const containerStyle = { maxWidth: '400px', margin: '80px auto', padding: '40px', textAlign: 'center' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 10px 0', color: '#111' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.9rem' };
const groupStyle = { marginBottom: '25px', textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#999', letterSpacing: '1px', marginBottom: '5px', fontWeight: '700' };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent' };
const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px' };
const successStyle = { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', fontSize: '0.9rem', marginBottom: '20px', borderRadius: '4px' };

export default ForgotPassword;