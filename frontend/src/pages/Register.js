import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Country } from 'country-state-city'; // Removed 'City' import

const Register = () => {
  const navigate = useNavigate();

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    re_password: ''
  });

  // --- LOCATION & PHONE STATE ---
  const [dialCode, setDialCode] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [city, setCity] = useState(''); // Manual input now

  // --- UI STATE ---
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // --- OPTIMIZED DATA LOADING ---
  const allCountries = useMemo(() => Country.getAllCountries(), []);
  
  // List for Country Dropdown (Sorted A-Z by Name)
  const countriesByName = useMemo(() => {
      return [...allCountries].sort((a, b) => a.name.localeCompare(b.name));
  }, [allCountries]);

  // List for Phone Code Dropdown (Sorted 1-999 by Code)
  const countriesByPhone = useMemo(() => {
      return [...allCountries].sort((a, b) => parseInt(a.phonecode) - parseInt(b.phonecode));
  }, [allCountries]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
        setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleCountryChange = (e) => {
      const code = e.target.value;
      
      if (!code) {
          setCountryCode(''); setCountryName(''); setDialCode('');
          return;
      }

      const cData = Country.getCountryByCode(code);
      if (cData) {
          setCountryCode(code);
          setCountryName(cData.name);
          // We no longer clear the city here, let them keep typing if they switch countries
          
          // Auto-select the correct phone code
          setDialCode(cData.phonecode);

          if (fieldErrors.location) setFieldErrors({ ...fieldErrors, location: '' });
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
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
    if (!countryName || !city.trim()) {
        errors.location = "Please enter your full location.";
    }
    if (!dialCode || !phoneDigits || phoneDigits.length < 6) {
        errors.phone_number = "Please enter a valid phone number.";
    }

    if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
    }

    setLoading(true);

    const fullLocation = `${city.trim()}, ${countryName}`;
    const fullPhoneNumber = `+${dialCode}${phoneDigits}`;

    const payload = { 
        ...formData, 
        location: fullLocation,
        phone_number: fullPhoneNumber 
    };

    try {
      await api.post('/auth/users/', payload);
      navigate('/login', { state: { successMessage: "Account created! Please log in." } });
    } catch (err) {
      console.error("Register Error:", err);
      
      if (err.response && err.response.data) {
          const backendErrors = err.response.data;
          const newFieldErrors = {};

          if (backendErrors.username) newFieldErrors.username = backendErrors.username[0];
          if (backendErrors.email) newFieldErrors.email = backendErrors.email[0];
          if (backendErrors.phone_number) newFieldErrors.phone_number = backendErrors.phone_number[0];
          if (backendErrors.password) newFieldErrors.password = backendErrors.password[0];
          
          if (backendErrors.non_field_errors) {
              setGeneralError(backendErrors.non_field_errors[0]);
          }
          setFieldErrors(newFieldErrors);
      } else {
          setGeneralError('Network error. Please try again later.');
      }
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
                    
                    {/* COUNTRY (Dropdown) */}
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>COUNTRY</label>
                        <div className="custom-select-wrapper">
                            <select 
                                value={countryCode} 
                                onChange={handleCountryChange} 
                                required 
                                className="custom-select"
                                style={fieldErrors.location ? errorBorder : {}}
                            >
                                <option value="">Select Country</option>
                                {countriesByName.map((c) => (
                                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* CITY (Manual Input) */}
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

            {/* PHONE INPUT */}
            <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>PHONE NUMBER (FOR WHATSAPP)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    
                    {/* PHONE CODE DROPDOWN */}
                    <div style={{ width: '130px', position: 'relative' }}>
                        <select 
                            value={dialCode}
                            onChange={(e) => setDialCode(e.target.value)}
                            className="custom-select"
                            style={{ 
                                paddingRight: '0', 
                                ...(fieldErrors.phone_number ? errorBorder : {})
                            }}
                            required
                        >
                            <option value="">Code</option>
                            {countriesByPhone.map((c) => (
                                <option key={c.isoCode} value={c.phonecode}>
                                    +{c.phonecode} ({c.isoCode})
                                </option>
                            ))}
                        </select>
                    </div>

                    <input 
                        type="tel" 
                        className="custom-input"
                        placeholder="123 456 789" 
                        value={phoneDigits}
                        onChange={(e) => setPhoneDigits(e.target.value)}
                        required 
                        style={{ 
                            flex: 1, 
                            ...(fieldErrors.phone_number ? errorBorder : {})
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
                        placeholder="Min 8 characters" 
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
      `}</style>
    </div>
  );
};

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