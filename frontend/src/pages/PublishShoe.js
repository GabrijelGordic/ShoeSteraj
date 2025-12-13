import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

// Import Phone Input Library
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PublishShoe = () => {
    const navigate = useNavigate();
    
    // Form States
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('EUR'); 
    const [condition, setCondition] = useState('New');
    const [description, setDescription] = useState('');
    const [contact, setContact] = useState(''); // This will now hold the phone number
    
    const [coverImage, setCoverImage] = useState(null);
    const [gallery, setGallery] = useState([]);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Generate Size Options
    const SIZE_OPTIONS = [];
    for (let i = 35; i <= 49.5; i += 0.5) {
        SIZE_OPTIONS.push(i);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. STRICT VALIDATION (Everything except Description & Gallery)
        if (!title || !brand || !size || !price || !contact) {
            setError("Please fill in all required fields marked with *");
            setLoading(false);
            return;
        }

        if (!coverImage) {
            setError("A Main Cover Photo is required *");
            setLoading(false);
            return;
        }
        
        const data = new FormData();
        data.append('title', title);
        data.append('brand', brand);
        data.append('size', size);
        data.append('price', price);
        data.append('currency', currency); 
        data.append('condition', condition);
        data.append('description', description); // Optional, can be empty
        data.append('contact_info', contact); // Sends the formatted phone number
        data.append('image', coverImage);

        // Append gallery only if files exist
        for (let i = 0; i < gallery.length; i++) {
            data.append('gallery_images', gallery[i]);
        }

        try {
            await api.post('/api/shoes/', data);
            
            navigate('/mylistings', { 
                state: { successMessage: "Listing published successfully!" } 
            }); 
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const key = Object.keys(err.response.data)[0];
                const msg = err.response.data[key];
                setError(`${key.toUpperCase()}: ${Array.isArray(msg) ? msg[0] : msg}`);
            } else {
                setError('Failed to publish. Please check your network connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={headingStyle}>List a Product</h1>
                <p style={subHeadingStyle}>Share your collection with the world.</p>
            </div>

            {error && <div style={errorStyle}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                
                {/* --- TITLE --- */}
                <div style={groupStyle}>
                    <label style={labelStyle}>
                        PRODUCT TITLE <span style={reqStar}>*</span>
                    </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Air Jordan 1 High Chicago" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        style={inputStyle} 
                        required 
                    />
                </div>

                {/* --- BRAND & CONDITION --- */}
                <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>
                            BRAND <span style={reqStar}>*</span>
                        </label>
                        <select value={brand} onChange={e => setBrand(e.target.value)} style={selectStyle} required>
                            <option value="">Select...</option>
                            <option value="Nike">Nike</option>
                            <option value="Adidas">Adidas</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Yeezy">Yeezy</option>
                            <option value="New Balance">New Balance</option>
                            <option value="Asics">Asics</option>
                            <option value="Converse">Converse</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>
                            CONDITION <span style={reqStar}>*</span>
                        </label>
                        <select value={condition} onChange={e => setCondition(e.target.value)} style={selectStyle}>
                            <option value="New">New / Deadstock</option>
                            <option value="Used">Used / Worn</option>
                        </select>
                    </div>
                </div>

                {/* --- SIZE & PRICE --- */}
                <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>
                            SIZE (EU) <span style={reqStar}>*</span>
                        </label>
                        <select value={size} onChange={e => setSize(e.target.value)} style={selectStyle} required>
                            <option value="">Select Size</option>
                            {SIZE_OPTIONS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>
                            PRICE <span style={reqStar}>*</span>
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select 
                                value={currency} 
                                onChange={e => setCurrency(e.target.value)} 
                                style={{ ...selectStyle, width: '80px', fontWeight: 'bold' }}
                            >
                                <option value="EUR">€ EUR</option>
                                <option value="USD">$ USD</option>
                                <option value="GBP">£ GBP</option>
                            </select>
                            
                            <input 
                                type="number" 
                                value={price} 
                                onChange={e => setPrice(e.target.value)} 
                                style={inputStyle} 
                                placeholder="0.00"
                                required 
                            />
                        </div>
                    </div>
                </div>

                {/* --- DESCRIPTION (Optional) --- */}
                <div style={groupStyle}>
                    <label style={labelStyle}>
                        DESCRIPTION <span style={{fontSize:'0.7rem', color:'#aaa', fontWeight:'normal'}}>(OPTIONAL)</span>
                    </label>
                    <textarea 
                        rows="3" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        style={textareaStyle} 
                        placeholder="Details about the item..." 
                    />
                </div>

                {/* --- CONTACT (Phone Dropdown) --- */}
                <div style={groupStyle}>
                    <label style={labelStyle}>
                        CONTACT NUMBER <span style={reqStar}>*</span>
                    </label>
                    {/* Custom container for styling overrides */}
                    <div className="custom-phone-input">
                        <PhoneInput
                            country={'hr'} // Default Croatia
                            value={contact}
                            onChange={phone => setContact(phone)}
                            inputProps={{
                                required: true,
                            }}
                        />
                    </div>
                </div>

                <div style={{ margin: '40px 0', borderTop: '1px solid #eee' }}></div>

                {/* --- IMAGES --- */}
                <div style={groupStyle}>
                    <label style={labelStyle}>
                        MAIN COVER PHOTO <span style={reqStar}>*</span>
                    </label>
                    <label style={uploadBtn}>
                        {coverImage ? `SELECTED: ${coverImage.name}` : '+ UPLOAD COVER IMAGE'}
                        <input type="file" onChange={e => setCoverImage(e.target.files[0])} style={{display:'none'}} accept="image/*" required />
                    </label>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>
                        GALLERY PHOTOS <span style={{fontSize:'0.7rem', color:'#aaa', fontWeight:'normal'}}>(OPTIONAL)</span>
                    </label>
                    <label style={uploadBtn}>
                        {gallery.length > 0 ? `SELECTED ${gallery.length} FILES` : '+ UPLOAD GALLERY IMAGES'}
                        <input type="file" onChange={e => setGallery(e.target.files)} style={{display:'none'}} accept="image/*" multiple />
                    </label>
                </div>

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'PUBLISHING...' : 'PUBLISH LISTING'}
                </button>
            </form>

            {/* --- GLOBAL STYLES & PHONE INPUT OVERRIDES --- */}
            <style>{`
                body { font-family: 'Lato', sans-serif; }
                input:focus, select:focus, textarea:focus {
                    border-bottom: 1px solid #000 !important;
                }

                /* Override Phone Input Library to match Minimal Theme */
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
            `}</style>
        </div>
    );
};

// --- STYLES ---

const containerStyle = {
    maxWidth: '800px',
    margin: '60px auto',
    padding: '40px',
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
    marginBottom: '30px',
    textAlign: 'left'
};

const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    color: '#999',
    letterSpacing: '1px',
    marginBottom: '8px',
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
    backgroundColor: 'transparent',
    color: '#333'
};

const selectStyle = {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
    padding: '10px 0',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    fontFamily: '"Lato", sans-serif',
    backgroundColor: 'transparent',
    color: '#333',
    cursor: 'pointer'
};

const textareaStyle = {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
    padding: '10px 0',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: '"Lato", sans-serif',
    backgroundColor: 'transparent',
    resize: 'none',
    color: '#333'
};

const uploadBtn = {
    display: 'block',
    width: '100%',
    padding: '15px',
    border: '1px dashed #ccc',
    textAlign: 'center',
    cursor: 'pointer',
    fontFamily: '"Lato", sans-serif',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#333',
    backgroundColor: '#f9f9f9',
    transition: 'background 0.2s'
};

const buttonStyle = {
    width: '100%',
    padding: '18px',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '2px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'opacity 0.2s'
};

const errorStyle = {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '15px',
    fontSize: '0.9rem',
    marginBottom: '30px',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    border: '1px solid #ef9a9a'
};

export default PublishShoe;