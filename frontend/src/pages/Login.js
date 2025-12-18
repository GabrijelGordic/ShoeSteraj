import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation(); 
    
    const successMsg = location.state?.successMessage;
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- NEW: VISIBILITY STATE ---
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.username, formData.password);
            navigate('/'); 
        } catch (err) {
            setError('Invalid username or password.');
            setLoading(false);
        }
    };

    return (
        <div style={pageWrapper}>
            <div style={streetwearCard}>
                
                {/* --- SUCCESS MESSAGE --- */}
                {successMsg && (
                    <div style={successStyle}>
                        {successMsg}
                    </div>
                )}

                {/* --- HEADER --- */}
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h1 style={headingStyle}>Welcome Back</h1>
                    <p style={subHeadingStyle}>SIGN IN TO ACCESS THE VAULT.</p>
                </div>

                {/* --- ERROR MESSAGE --- */}
                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    
                    {/* USERNAME */}
                    <div style={groupStyle}>
                        <label style={labelStyle}>USERNAME:</label>
                        <input 
                            type="text" 
                            value={formData.username} 
                            onChange={(e) => setFormData({...formData, username: e.target.value})} 
                            style={inputStyle} 
                            placeholder="ENTER USERNAME" 
                            required 
                        />
                    </div>

                    {/* PASSWORD (Updated with Eye) */}
                    <div style={groupStyle}>
                        <label style={labelStyle}>PASSWORD:</label>
                        <div style={passwordWrapper}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                style={inputStyle} 
                                placeholder="ENTER PASSWORD" 
                                required 
                            />
                            
                            {/* EYE TOGGLE BUTTON */}
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={eyeBtn}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '25px' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'rgba(102, 102, 102, 1)', textDecoration: 'none', fontFamily: 'Lato', letterSpacing:'1px' }}>
                            FORGOT PASSWORD?
                        </Link>
                    </div>

                    <button type="submit" style={buttonStyle} disabled={loading}>
                        {loading ? 'AUTHENTICATING...' : 'ENTER'}
                    </button>
                </form>

                <div style={{ marginTop: '30px', textAlign: 'center', borderTop:'1px solid #ccc', paddingTop:'20px' }}>
                    <p style={footerTextStyle}>
                        NOT A MEMBER? <Link to="/register" style={linkStyle}>JOIN THE CLUB</Link>
                    </p>
                </div>
            </div>

            <style>{`
                body { background-color: #b1b1b1ff; font-family: 'Lato', sans-serif; }
                input::placeholder { color: #555; font-weight: 300; font-size: 0.8rem; }
                
                /* ANIMATION: 
                   1. Default is thin grey border (set in inline styles).
                   2. Focus becomes thick black border.
                */
                input:focus { 
                    border-bottom: 2px solid #111 !important; 
                    background-color: rgba(255,255,255,0.3); /* Optional: slight highlight on focus */
                }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const pageWrapper = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };

const streetwearCard = {
    backgroundColor: '#ddddddff',
    border: '2px solid #111',
    boxShadow: '8px 8px 0px rgba(0,0,0,0.15)', // Hard Shadow
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
};

const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', margin: '0 0 5px 0', color: '#111', fontStyle: 'italic' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.8rem', margin: 0, letterSpacing: '2px', fontWeight: '700' };
const groupStyle = { marginBottom: '25px', textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '1.1rem', color: '#111', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900' };

// Updated Input Style: Subtle grey line by default
const inputStyle = { 
    width: '100%', 
    border: 'none', 
    borderBottom: '1px solid #999', // The "Show a little" line
    padding: '12px 0', 
    fontSize: '1rem', 
    outline: 'none', 
    transition: 'all 0.3s ease', 
    fontFamily: '"Lato", sans-serif', 
    backgroundColor: 'transparent', 
    fontWeight: 'bold',
    color: '#111'
};

const buttonStyle = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase' };
const errorStyle = { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', fontSize: '0.85rem', marginBottom: '20px', border: '1px solid #ef9a9a', fontWeight: 'bold', textAlign: 'center' };
const successStyle = { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', marginBottom: '30px', border: '1px solid #c8e6c9', fontSize: '0.9rem', textAlign: 'center' };
const footerTextStyle = { color: '#666', fontSize: '0.85rem', margin: 0 };
const linkStyle = { color: '#111', fontWeight: '900', textDecoration: 'underline', marginLeft: '5px', cursor: 'pointer' };

// --- NEW STYLES FOR EYE ICON ---
const passwordWrapper = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
};

const eyeBtn = {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
};

export default Login;