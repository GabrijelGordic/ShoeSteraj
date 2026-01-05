import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 

// New Phone Library
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Register = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    re_password: ''
  });

  // Phone state (library handles code splitting)
  const [phone, setPhone] = useState('');
  
  // Location state
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
        setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({}); 
    setGeneralError('');
    
    // 1. VALIDATION
    let errors = {};

    if (formData.password !== formData.re_password) {
      errors.re_password = "Passwords do not match.";
    }
    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!country || !city.trim()) {
        errors.location = "Please enter your full location.";
    }
    // react-phone-input-2 returns the full string with code
    if (!phone || phone.length < 8) {
        errors.phone_number = "Please enter a valid phone number.";
    }

    if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
    }

    setLoading(true);

    const fullLocation = `${city.trim()}, ${country}`;
    const fullPhoneNumber = `+${phone}`; // Ensure + is added

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                username: formData.username,
                phone_number: fullPhoneNumber,
                location: fullLocation
            }
        }
      });

      if (error) throw error;

      if (data?.session) {
          navigate('/', { state: { successMessage: "Account created! You are logged in." } });
      } else {
          navigate('/login', { state: { successMessage: "Account created! Please check your email to confirm." } });
      }

    } catch (err) {
      console.error("Register Error:", err);
      if (err.message.includes('already registered')) {
          setFieldErrors({ email: "This email is already registered." });
      } else if (err.message.includes('Password')) {
          setFieldErrors({ password: err.message });
      } else {
          setGeneralError(err.message || 'Failed to create account.');
      }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      
      <div style={{ width: '100%', maxWidth: '500px' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: '50px', textAlign: 'center' }}>
            <h1 style={titleStyle}>JOIN THE CLUB</h1>
            <p style={subtitleStyle}>CREATE AN ACCOUNT TO START TRADING.</p>
        </div>

        {generalError && (
            <div style={errorBannerStyle}>
                {generalError}
            </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            
            <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>USERNAME</label>
                <input 
                    type="text" 
                    name="username" 
                    className="custom-input"
                    placeholder="Choose a username" 
                    onChange={handleChange} 
                    required 
                    style={fieldErrors.username ? errorBorder : {}}
                />
                {fieldErrors.username && <p style={fieldErrorText}>{fieldErrors.username}</p>}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>EMAIL</label>
                <input 
                    type="email" 
                    name="email" 
                    className="custom-input"
                    placeholder="name@example.com" 
                    onChange={handleChange} 
                    required 
                    style={fieldErrors.email ? errorBorder : {}}
                />
                {fieldErrors.email && <p style={fieldErrorText}>{fieldErrors.email}</p>}
            </div>

            {/* LOCATION SELECTOR */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    
                    {/* COUNTRY (Clean HTML Select) */}
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>COUNTRY</label>
                        <div className="custom-select-wrapper">
                            <select 
                                value={country} 
                                onChange={(e) => setCountry(e.target.value)} 
                                required 
                                className="custom-select"
                                style={fieldErrors.location ? errorBorder : {}}
                            >
                                <option value="">Select Country</option>
                                {/* You can add more countries here easily */}
                                {commonCountries.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* CITY */}
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>CITY</label>
                        <input 
                            type="text" 
                            className="custom-input"
                            placeholder="Enter City" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)}
                            required 
                            style={fieldErrors.location ? errorBorder : {}}
                        />
                    </div>
                </div>
                {fieldErrors.location && <p style={fieldErrorText}>{fieldErrors.location}</p>}
            </div>

            {/* PHONE INPUT (New Library) */}
            <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>PHONE NUMBER</label>
                <div style={fieldErrors.phone_number ? {border: '1px solid #d32f2f'} : {}}>
                    <PhoneInput
                        country={'us'} // Default country
                        value={phone}
                        onChange={phone => setPhone(phone)}
                        enableSearch={true}
                        disableSearchIcon={true}
                        searchPlaceholder="Search country..."
                        inputStyle={{
                            width: '100%',
                            height: '50px',
                            borderRadius: '0px',
                            border: '1px solid #e0e0e0',
                            fontFamily: 'Lato, sans-serif',
                            fontSize: '1rem',
                            paddingLeft: '48px' // Make space for flag
                        }}
                        buttonStyle={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRight: '1px solid #e0e0e0',
                            borderRadius: '0px',
                            paddingLeft: '5px'
                        }}
                        dropdownStyle={{
                            fontFamily: 'Lato, sans-serif',
                            width: '300px'
                        }}
                    />
                </div>
                {fieldErrors.phone_number && <p style={fieldErrorText}>{fieldErrors.phone_number}</p>}
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        className="custom-input"
                        placeholder="Min 6 characters" 
                        onChange={handleChange} 
                        required 
                        style={fieldErrors.password ? errorBorder : {}}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>
                        {showPassword ? <EyeOpenIcon/> : <EyeClosedIcon/>}
                    </button>
                </div>
                {fieldErrors.password && <p style={fieldErrorText}>{fieldErrors.password}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div style={{ marginBottom: '30px' }}>
                <label style={labelStyle}>CONFIRM PASSWORD</label>
                <div style={{ position: 'relative' }}>
                    <input 
                        type={showRePassword ? "text" : "password"} 
                        name="re_password" 
                        className="custom-input"
                        placeholder="Repeat password" 
                        onChange={handleChange} 
                        required 
                        style={fieldErrors.re_password ? errorBorder : {}}
                    />
                    <button type="button" onClick={() => setShowRePassword(!showRePassword)} style={eyeBtn}>
                         {showRePassword ? <EyeOpenIcon/> : <EyeClosedIcon/>}
                    </button>
                </div>
                {fieldErrors.re_password && <p style={fieldErrorText}>{fieldErrors.re_password}</p>}
            </div>

            <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
            </button>

            <div style={{ marginTop: '40px', textAlign: 'center', borderTop:'1px solid #eee', paddingTop:'30px' }}>
                <p style={{ fontFamily: 'Lato', color: '#888', fontSize: '0.9rem' }}>
                    ALREADY A MEMBER? <Link to="/login" style={linkStyle}>LOGIN HERE</Link>
                </p>
            </div>

        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        body { font-family: 'Lato', sans-serif; }

        .custom-input { width: 100%; padding: 15px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 0px; font-family: 'Lato', sans-serif; fontSize: 1rem; color: #333; transition: all 0.2s ease; }
        .custom-input:focus { outline: none; border-color: #000; background-color: #fafafa; }
        .custom-input::placeholder { color: #aaa; font-weight: 400; }
        
        .custom-select-wrapper { position: relative; width: 100%; }
        .custom-select { width: 100%; padding: 15px; appearance: none; -webkit-appearance: none; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 0px; font-family: 'Lato', sans-serif; fontSize: 1rem; color: #333; cursor: pointer; transition: all 0.2s ease; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 10px center; background-size: 16px; }
        .custom-select:focus { outline: none; border-color: #000; background-color: #fafafa; }

        /* Override React Phone Input Styles to match theme */
        .react-tel-input .form-control:focus {
            box-shadow: none !important;
            border-color: #000 !important;
            background-color: #fafafa !important;
        }
        .react-tel-input .flag-dropdown:hover .selected-flag {
            background-color: transparent !important;
        }
        .react-tel-input .country-list .country.highlight {
            background-color: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
};

// --- STATIC DATA (No heavy library) ---
const commonCountries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", 
    "Italy", "Spain", "Netherlands", "Sweden", "Switzerland", "Croatia", "Serbia", 
    "Bosnia & Herzegovina", "Slovenia", "Austria", "Japan", "China", "India", 
    "Brazil", "Mexico", "United Arab Emirates", "Singapore"
];

// --- STYLES & ICONS ---
const EyeOpenIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>);
const EyeClosedIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>);

const titleStyle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '4rem', margin: '0 0 5px 0', color: '#111', lineHeight: '0.9', letterSpacing: '2px' };
const subtitleStyle = { fontFamily: '"Lato", sans-serif', color: '#b75784', fontSize: '0.9rem', margin: 0, letterSpacing: '2px', fontWeight: '700', textTransform: 'uppercase' };
const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#555', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900', fontFamily: 'Lato', textTransform: 'uppercase' };
const buttonStyle = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', textTransform: 'uppercase', transition: 'background-color 0.2s' };
const eyeBtn = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' };
const linkStyle = { color: '#b75784', fontWeight: '900', textDecoration: 'none', marginLeft: '5px', cursor: 'pointer', textTransform: 'uppercase' };
const errorBannerStyle = { backgroundColor: '#fef2f2', color: '#991b1b', padding: '15px', marginBottom: '30px', border: '1px solid #fecaca', fontSize: '0.9rem', textAlign: 'center', fontFamily: 'Lato', fontWeight:'bold' };
const errorBorder = { border: '1px solid #d32f2f', backgroundColor: '#fff5f5' };
const fieldErrorText = { color: '#d32f2f', fontSize: '0.8rem', marginTop: '5px', fontWeight: 'bold', fontFamily: 'Lato' };

export default Register;