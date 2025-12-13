import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PublishShoe = () => {
    const navigate = useNavigate();
    
    // Form States
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [size, setSize] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('EUR'); // Default to Euro
    const [condition, setCondition] = useState('New');
    const [description, setDescription] = useState('');
    const [contact, setContact] = useState('');
    
    const [coverImage, setCoverImage] = useState(null);
    const [gallery, setGallery] = useState([]);
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Generate Size Options (35 - 48 in 0.5 increments)
    const SIZE_OPTIONS = [];
    for (let i = 35; i <= 49.5; i += 0.5) {
        SIZE_OPTIONS.push(i);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const data = new FormData();
        data.append('title', title);
        data.append('brand', brand);
        data.append('size', size);
        data.append('price', price);
        data.append('currency', currency); // Send Currency
        data.append('condition', condition);
        data.append('description', description);
        data.append('contact_info', contact);

        if (coverImage) {
            data.append('image', coverImage);
        } else {
            setError("Please select a main cover image.");
            setLoading(false);
            return;
        }

        for (let i = 0; i < gallery.length; i++) {
            data.append('gallery_images', gallery[i]);
        }

        try {
            await api.post('/api/shoes/', data);
            alert('Listing Published Successfully!');
            navigate('/'); 
        } catch (err) {
            console.error(err);
            setError('Failed to publish. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            
            {/* --- HEADER --- */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={headingStyle}>List a Product</h1>
                <p style={subHeadingStyle}>Share your collection with the world.</p>
            </div>

            {error && <div style={errorStyle}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                
                {/* --- TITLE --- */}
                <div style={groupStyle}>
                    <label style={labelStyle}>PRODUCT TITLE</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Air Jordan 1 High Chicago" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        style={inputStyle} 
                        required 
                    />
                </div>

                {/* --- BRAND & CONDITION (Row) --- */}
                <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>BRAND</label>
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
                        <label style={labelStyle}>CONDITION</label>
                        <select value={condition} onChange={e => setCondition(e.target.value)} style={selectStyle}>
                            <option value="New">New / Deadstock</option>
                            <option value="Used">Used / Worn</option>
                        </select>
                    </div>
                </div>

                {/* --- SIZE & PRICE (Row) --- */}
                <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
                    
                    {/* SIZE SELECTOR */}
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>SIZE (EU)</label>
                        <select value={size} onChange={e => setSize(e.target.value)} style={selectStyle} required>
                            <option value="">Select Size</option>
                            {SIZE_OPTIONS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* PRICE & CURRENCY INPUT */}
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>PRICE</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* Currency Dropdown */}
                            <select 
                                value={currency} 
                                onChange={e => setCurrency(e.target.value)} 
                                style={{ ...selectStyle, width: '80px', fontWeight: 'bold' }}
                            >
                                <option value="EUR">€ EUR</option>
                                <option value="USD">$ USD</option>
                                <option value="GBP">£ GBP</option>
                            </select>
                            
                            {/* Amount Input */}
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

                {/* --- DESCRIPTION --- */}
                <div style={groupStyle}>
                    <label style={labelStyle}>DESCRIPTION</label>
                    <textarea 
                        rows="3" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        style={textareaStyle} 
                        placeholder="Details about the item..." 
                    />
                </div>

                {/* --- CONTACT --- */}
                <div style={groupStyle}>
                    <label style={labelStyle}>CONTACT PREFERENCE</label>
                    <input 
                        type="text" 
                        value={contact} 
                        onChange={e => setContact(e.target.value)} 
                        style={inputStyle} 
                        placeholder="Phone number or Email" 
                    />
                </div>

                <div style={{ margin: '40px 0', borderTop: '1px solid #eee' }}></div>

                {/* --- IMAGES --- */}
                <div style={groupStyle}>
                    <label style={labelStyle}>MAIN COVER PHOTO</label>
                    <label style={uploadBtn}>
                        {coverImage ? `SELECTED: ${coverImage.name}` : '+ UPLOAD COVER IMAGE'}
                        <input type="file" onChange={e => setCoverImage(e.target.files[0])} style={{display:'none'}} accept="image/*" required />
                    </label>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>GALLERY PHOTOS (OPTIONAL)</label>
                    <label style={uploadBtn}>
                        {gallery.length > 0 ? `SELECTED ${gallery.length} FILES` : '+ UPLOAD GALLERY IMAGES'}
                        <input type="file" onChange={e => setGallery(e.target.files)} style={{display:'none'}} accept="image/*" multiple />
                    </label>
                </div>

                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? 'PUBLISHING...' : 'PUBLISH LISTING'}
                </button>
            </form>

            {/* --- GLOBAL STYLES --- */}
            <style>{`
                body { font-family: 'Lato', sans-serif; }
                input:focus, select:focus, textarea:focus {
                    border-bottom: 1px solid #000 !important;
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
    padding: '10px',
    fontSize: '0.9rem',
    marginBottom: '30px',
    borderRadius: '4px',
    textAlign: 'center'
};

export default PublishShoe;