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
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await login(formData.username, formData.password);
            navigate('/'); 
        } catch (err) {
            setError('Incorrect username or password.');
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            
            <div style={{ width: '100%', maxWidth: '450px' }}>
                
                {/* --- HEADER --- */}
                <div style={{ marginBottom: '50px', textAlign: 'center' }}>
                    <h1 style={titleStyle}>WELCOME BACK</h1>
                    <p style={subtitleStyle}>SIGN IN TO ACCESS THE VAULT.</p>
                </div>

                {/* --- MESSAGES --- */}
                {successMsg && <div style={successStyle}>{successMsg}</div>}
                {error && <div style={errorStyle}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    
                    {/* USERNAME */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={labelStyle}>USERNAME</label>
                        <input 
                            type="text" 
                            className="custom-input"
                            value={formData.username} 
                            onChange={(e) => setFormData({...formData, username: e.target.value})} 
                            placeholder="Enter username" 
                            required 
                        />
                    </div>

                    {/* PASSWORD */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                            <label style={labelStyle}>PASSWORD</label>
                            <Link to="/forgot-password" style={forgotLink}>Forgot Password?</Link>
                        </div>
                        
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="custom-input"
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                placeholder="Enter password" 
                                required 
                            />
                            
                            {/* EYE TOGGLE */}
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={eyeBtn}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" style={submitBtn} disabled={loading}>
                        {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                    </button>
                </form>

                <div style={{ marginTop: '40px', textAlign: 'center', borderTop:'1px solid #eee', paddingTop:'30px' }}>
                    <p style={{ fontFamily: 'Lato', color: '#888', fontSize: '0.9rem' }}>
                        NEW TO SHOESTERAJ? <Link to="/register" style={registerLink}>CREATE ACCOUNT</Link>
                    </p>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                body { font-family: 'Lato', sans-serif; }

                /* INPUT STYLES (Matching Edit Profile) */
                .custom-input { 
                    width: 100%; 
                    padding: 15px; 
                    background-color: #fff; 
                    border: 1px solid #e0e0e0; 
                    border-radius: 0px; 
                    font-family: 'Lato', sans-serif; 
                    fontSize: 1rem; 
                    color: #333; 
                    transition: all 0.2s ease; 
                }
                .custom-input:focus { 
                    outline: none; 
                    border-color: #000; 
                    background-color: #fafafa; 
                }
                .custom-input::placeholder { color: #aaa; font-weight: 400; }
            `}</style>
        </div>
    );
};

// --- STYLES ---

const titleStyle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '4rem', margin: '0 0 5px 0', color: '#111', lineHeight: '0.9', letterSpacing: '2px' };
const subtitleStyle = { fontFamily: '"Lato", sans-serif', color: '#b75784', fontSize: '0.9rem', margin: 0, letterSpacing: '2px', fontWeight: '700', textTransform: 'uppercase' };

const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#555', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900', fontFamily: 'Lato', textTransform: 'uppercase' };

const submitBtn = { 
    width: '100%', 
    padding: '18px', 
    backgroundColor: '#111', 
    color: '#fff', 
    border: 'none', 
    fontSize: '0.9rem', 
    fontWeight: '900', 
    letterSpacing: '2px', 
    cursor: 'pointer', 
    textTransform: 'uppercase',
    transition: 'background-color 0.2s' 
};

const eyeBtn = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
};

const forgotLink = { fontSize: '0.8rem', color: '#b75784', textDecoration: 'none', fontFamily: 'Lato', fontWeight: 'bold' };
const registerLink = { color: '#b75784', fontWeight: '900', textDecoration: 'none', marginLeft: '5px', cursor: 'pointer', textTransform: 'uppercase' };

const errorStyle = { backgroundColor: '#fef2f2', color: '#991b1b', padding: '15px', marginBottom: '30px', border: '1px solid #fecaca', fontSize: '0.9rem', textAlign: 'center', fontFamily: 'Lato', fontWeight:'bold' };
const successStyle = { backgroundColor: '#f0fdf4', color: '#15803d', padding: '15px', marginBottom: '30px', border: '1px solid #bbf7d0', fontSize: '0.9rem', textAlign: 'center', fontFamily: 'Lato', fontWeight:'bold' };

export default Login;