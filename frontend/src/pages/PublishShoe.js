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
    const [condition, setCondition] = useState('New'); // Added Condition
    const [description, setDescription] = useState(''); // Added Description
    const [contact, setContact] = useState(''); // Added Contact Info
    
    const [coverImage, setCoverImage] = useState(null); // Main Image
    const [gallery, setGallery] = useState([]); // Array of extra images
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        data.append('title', title);
        data.append('brand', brand);
        data.append('size', size);
        data.append('price', price);
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

        // Append multiple gallery images with the SAME key 'gallery_images'
        // This allows Django's request.FILES.getlist() to find them
        for (let i = 0; i < gallery.length; i++) {
            data.append('gallery_images', gallery[i]);
        }

        try {
            await api.post('/api/shoes/', data);
            alert('Shoe Published Successfully!');
            navigate('/'); 
        } catch (err) {
            console.error(err);
            setError('Failed to publish. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sell Your Kicks</h2>
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={groupStyle}>
                    <label>Title:</label>
                    <input type="text" placeholder="e.g. Jordan 1 High Chicago" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} required />
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{...groupStyle, flex: 1}}>
                        <label>Brand:</label>
                        <select value={brand} onChange={e => setBrand(e.target.value)} style={inputStyle} required>
                            <option value="">Select Brand</option>
                            <option value="Nike">Nike</option>
                            <option value="Adidas">Adidas</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Yeezy">Yeezy</option>
                            <option value="New Balance">New Balance</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div style={{...groupStyle, flex: 1}}>
                        <label>Condition:</label>
                        <select value={condition} onChange={e => setCondition(e.target.value)} style={inputStyle}>
                            <option value="New">New / Deadstock</option>
                            <option value="Used">Used / Worn</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={groupStyle}>
                        <label>Size (EU):</label>
                        <input type="number" step="0.5" value={size} onChange={e => setSize(e.target.value)} style={inputStyle} required />
                    </div>
                    <div style={groupStyle}>
                        <label>Price (€):</label>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} required />
                    </div>
                </div>

                <div style={groupStyle}>
                    <label>Description:</label>
                    <textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} placeholder="Tell us about the shoe..." />
                </div>

                <div style={groupStyle}>
                    <label>Contact Info (Phone/Email):</label>
                    <input type="text" value={contact} onChange={e => setContact(e.target.value)} style={inputStyle} placeholder="How should buyers contact you?" />
                </div>

                <hr style={{ margin: '20px 0' }} />

                {/* --- IMAGE UPLOAD SECTION --- */}
                <div style={groupStyle}>
                    <label style={{ fontWeight: 'bold' }}>1. Main Cover Photo (Required)</label>
                    <input type="file" onChange={e => setCoverImage(e.target.files[0])} style={fileStyle} accept="image/*" required />
                </div>

                <div style={groupStyle}>
                    <label style={{ fontWeight: 'bold' }}>2. Gallery Photos (Optional)</label>
                    <p style={{fontSize: '0.8rem', color: '#666', marginTop: '0'}}>Select multiple photos to create a gallery.</p>
                    {/* 'multiple' attribute allows selecting many files */}
                    <input type="file" onChange={e => setGallery(e.target.files)} style={fileStyle} accept="image/*" multiple />
                </div>

                <button type="submit" style={btnStyle} disabled={loading}>
                    {loading ? 'Publishing...' : 'Publish Listing'}
                </button>
            </form>
        </div>
    );
};

// Styles
const groupStyle = { marginBottom: '15px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px', boxSizing: 'border-box' };
const fileStyle = { marginTop: '5px', padding: '10px', background: '#f9f9f9', width: '100%', border: '1px dashed #ccc' };
const btnStyle = { width: '100%', padding: '15px', background: '#222', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '5px', marginTop: '10px' };

export default PublishShoe;