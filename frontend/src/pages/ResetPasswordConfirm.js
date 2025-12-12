import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ResetPasswordConfirm = () => {
    const { uid, token } = useParams(); // Capture secrets from URL
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== reNewPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            // Send secrets + new password to Django
            await api.post('/auth/users/reset_password_confirm/', {
                uid,
                token,
                new_password: newPassword,
                re_new_password: reNewPassword
            });
            alert("Password has been reset successfully! Please Login.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError("Failed to reset password. The link may have expired.");
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>New Password</h1>
            <p style={subHeadingStyle}>Create a strong new password.</p>

            {error && <div style={errorStyle}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
                <div style={groupStyle}>
                    <label style={labelStyle}>NEW PASSWORD</label>
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="At least 8 characters"
                        required
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>CONFIRM PASSWORD</label>
                    <input 
                        type="password" 
                        value={reNewPassword}
                        onChange={(e) => setReNewPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="Repeat password"
                        required
                    />
                </div>

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'UPDATING...' : 'SET NEW PASSWORD'}
                </button>
            </form>
        </div>
    );
};

// --- STYLES (Identical) ---
const containerStyle = { maxWidth: '400px', margin: '80px auto', padding: '40px', textAlign: 'center' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 10px 0', color: '#111' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.9rem' };
const groupStyle = { marginBottom: '25px', textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#999', letterSpacing: '1px', marginBottom: '5px', fontWeight: '700' };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent' };
const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px' };
const errorStyle = { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', fontSize: '0.9rem', marginBottom: '20px', borderRadius: '4px' };

export default ResetPasswordConfirm;