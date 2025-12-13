import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import Phone Input
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const EditProfile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get(`/api/profiles/${user.username}/`)
                .then(res => {
                    setLocation(res.data.location || '');
                    setPhone(res.data.phone_number || '');
                    setPreview(res.data.avatar);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const data = new FormData();
        data.append('location', location);
        data.append('phone_number', phone); 
        if (avatar) {
            data.append('avatar', avatar);
        }

        try {
            await api.patch(`/api/profiles/${user.username}/`, data);
            
            // REMOVED ALERT
            // Redirect to Profile Page with Success Message
            navigate(`/seller/${user.username}`, {
                state: { successMessage: "Profile updated successfully!" }
            });

        } catch (err) {
            console.error("Update failed:", err.response);
            setError("Failed to update profile. Please check your inputs.");
        }
    };

    if (!user) return <div style={centerMsg}>Please Login...</div>;
    if (loading) return <div style={centerMsg}>Loading Profile...</div>;

    return (
        <div style={containerStyle}>
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={headingStyle}>Account Settings</h1>
                <p style={subHeadingStyle}>Update your public profile details.</p>
            </div>

            {error && <div style={errorStyle}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                
                {/* AVATAR SECTION */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={avatarContainer}>
                        {preview ? (
                            <img src={preview} alt="Avatar" style={avatarImg} />
                        ) : (
                            <div style={avatarPlaceholder}>{user.username[0].toUpperCase()}</div>
                        )}
                    </div>
                    
                    <label style={uploadLabel}>
                        CHANGE PHOTO
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

                {/* LOCATION */}
                <div style={groupStyle}>
                    <label style={labelStyle}>LOCATION</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        style={inputStyle} 
                        placeholder="e.g. Zagreb, Croatia"
                    />
                </div>

                {/* PHONE */}
                <div style={groupStyle}>
                    <label style={labelStyle}>PHONE NUMBER</label>
                    <div className="custom-phone-input">
                        <PhoneInput
                            country={'hr'}
                            value={phone}
                            onChange={phone => setPhone(phone)}
                            inputProps={{
                                required: true,
                            }}
                        />
                    </div>
                </div>

                <button type="submit" style={buttonStyle}>
                    SAVE CHANGES
                </button>
            </form>

            <style>{`
                body { font-family: 'Lato', sans-serif; }
                .custom-phone-input .react-tel-input .form-control {
                    width: 100% !important;
                    height: auto !important;
                    background: transparent !important;
                    border: none !important;
                    border-bottom: 1px solid #e0e0e0 !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    padding-left: 48px !important;
                    padding-bottom: 10px !important;
                    padding-top: 10px !important;
                    font-family: 'Lato', sans-serif !important;
                    font-size: 1rem !important;
                    color: #333 !important;
                    transition: border-color 0.3s;
                }
                .custom-phone-input .react-tel-input .form-control:focus {
                    border-bottom: 1px solid #000 !important;
                }
                .custom-phone-input .react-tel-input .flag-dropdown {
                    background: transparent !important;
                    border: none !important;
                    border-bottom: 1px solid #e0e0e0 !important;
                }
                input:focus {
                    border-bottom: 1px solid #000 !important;
                }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const containerStyle = { maxWidth: '600px', margin: '60px auto', padding: '40px' };
const centerMsg = { textAlign: 'center', marginTop: '100px', fontFamily: 'Lato', color: '#888' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 10px 0', color: '#111', fontWeight: '400' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.9rem', margin: 0 };
const avatarContainer = { width: '100px', height: '100px', margin: '0 auto 15px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #eee' };
const avatarImg = { width: '100%', height: '100%', objectFit: 'cover' };
const avatarPlaceholder = { width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#999', fontFamily: '"Playfair Display", serif' };
const uploadLabel = { fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', color: '#111', cursor: 'pointer', borderBottom: '1px solid #111', paddingBottom: '2px' };
const groupStyle = { marginBottom: '30px', textAlign: 'left' };
const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#999', letterSpacing: '1px', marginBottom: '8px', fontWeight: '700' };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', color: '#333' };
const buttonStyle = { width: '100%', padding: '15px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px', transition: 'opacity 0.2s' };
const errorStyle = { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', fontSize: '0.9rem', marginBottom: '20px', borderRadius: '4px', textAlign: 'center' };

export default EditProfile;