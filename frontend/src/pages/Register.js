import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    
    // Form States
    const [formData, setFormData] = useState({ 
        username: '', email: '', password: '', re_password: '' 
    });
    
    // Image States
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);

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
            // 1. Register the User
            await api.post('/auth/users/', formData);

            // 2. If an avatar was selected, upload it immediately
            if (avatar) {
                // A. We need a token to edit the profile, so we silently log in
                const loginRes = await api.post('/auth/token/login/', {
                    username: formData.username,
                    password: formData.password
                });
                const tempToken = loginRes.data.auth_token;

                // B. Upload the image
                const imgData = new FormData();
                imgData.append('avatar', avatar);

                // C. Send Patch request using the temp token
                await api.patch(`/api/profiles/${formData.username}/`, imgData, {
                    headers: {
                        'Authorization': `Token ${tempToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            
            // 3. Redirect to Login Page
            navigate('/login', { 
                state: { successMessage: "Account created successfully! Please sign in." } 
            });

        } catch (err) {
            console.error(err.response);
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.email) setError(data.email[0]);
                else if (data.username) setError(data.username[0]);
                else if (data.password) setError(data.password[0]);
                else setError("Registration failed.");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
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
                
                {/* --- OPTIONAL AVATAR UPLOAD --- */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={avatarContainer}>
                        {preview ? (
                            <img src={preview} alt="Avatar Preview" style={avatarImg} />
                        ) : (
                            <div style={avatarPlaceholder}>+</div>
                        )}
                    </div>
                    <label style={uploadLabel}>
                        ADD PROFILE PHOTO <span style={{fontWeight:'normal', color:'#aaa'}}>(OPTIONAL)</span>
                        <input 
                            type="file" 
                            style={{ display: 'none' }} 
                            onChange={e => {
                                if(e.target.files[0]) {
                                    setAvatar(e.target.files[0]);
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }
                            }} 
                            accept="image/*"
                        />
                    </label>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>USERNAME <span style={reqStar}>*</span></label>
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
                    <label style={labelStyle}>EMAIL ADDRESS <span style={reqStar}>*</span></label>
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
                    <label style={labelStyle}>PASSWORD <span style={reqStar}>*</span></label>
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
                    <label style={labelStyle}>CONFIRM PASSWORD <span style={reqStar}>*</span></label>
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

// --- STYLES ---

const containerStyle = {
    maxWidth: '450px', 
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

// Avatar Styles (Matches EditProfile)
const avatarContainer = {
    width: '80px',
    height: '80px',
    margin: '0 auto 10px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid #eee',
    cursor: 'pointer'
};

const avatarImg = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const avatarPlaceholder = {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: '#ccc',
    fontFamily: 'Lato'
};

const uploadLabel = {
    fontFamily: '"Lato", sans-serif',
    fontSize: '0.7rem',
    fontWeight: '700',
    letterSpacing: '1px',
    color: '#111',
    cursor: 'pointer',
    borderBottom: '1px solid #111',
    paddingBottom: '2px'
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

const reqStar = {
    color: '#d32f2f',
    marginLeft: '3px'
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