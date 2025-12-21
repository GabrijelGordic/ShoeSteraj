import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Sell = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Store array of file objects and preview URLs
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '', brand: '', model: '', size: '', condition: '',
    price: '', currency: 'EUR', description: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]); // Append new files

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Remove a specific image from the list
  const removeImage = (index) => {
      setFiles(files.filter((_, i) => i !== index));
      setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    // Append multiple images. 
    // NOTE: Your backend must be set up to handle 'uploaded_images' list
    files.forEach(file => {
        data.append('uploaded_images', file); 
    });

    try {
      await api.post('/api/shoes/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/'); 
    } catch (err) {
      console.error(err);
      alert('Failed to create listing.');
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={streetwearCard}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={headingStyle}>Sell Your Kicks</h1>
            <p style={subHeadingStyle}>ADD UP TO 5 PHOTOS.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {/* ... (Keep your existing Input Fields for Title, Brand, etc. here) ... */}
            
            {/* --- REUSE YOUR EXISTING INPUTS FROM PREVIOUS STEP HERE --- */}
            {/* just copy the "SECTION 1" and "SECTION 2" form groups from previous code */}
             <div style={rowStyle}>
                <div style={groupStyle}>
                    <label style={labelStyle}>AD TITLE:</label>
                    <input type="text" name="title" placeholder="E.G. JORDAN 1 CHICAGO" onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={groupStyle}>
                    <label style={labelStyle}>BRAND:</label>
                    <div style={selectWrapper}>
                        <select name="brand" onChange={handleChange} required style={selectStyle}>
                            <option value="">SELECT BRAND</option>
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
                </div>
            </div>

             <div style={rowStyle}>
                <div style={groupStyle}>
                    <label style={labelStyle}>SIZE (EU):</label>
                    <input type="number" step="0.5" name="size" placeholder="42.5" onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={groupStyle}>
                    <label style={labelStyle}>CONDITION:</label>
                    <div style={selectWrapper}>
                        <select name="condition" onChange={handleChange} required style={selectStyle}>
                            <option value="">SELECT CONDITION</option>
                            <option value="New">New / Deadstock</option>
                            <option value="Used">Used / Worn</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={rowStyle}>
                <div style={{...groupStyle, flex: 2}}>
                    <label style={labelStyle}>PRICE:</label>
                    <input type="number" name="price" placeholder="0.00" onChange={handleChange} required style={inputStyle} />
                </div>
                <div style={{...groupStyle, flex: 1}}>
                    <label style={labelStyle}>CURRENCY:</label>
                    <div style={selectWrapper}>
                        <select name="currency" onChange={handleChange} style={selectStyle}>
                            <option value="EUR">EUR (€)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* --- NEW MULTI-IMAGE UPLOAD SECTION --- */}
            <div style={{ marginBottom: '30px' }}>
                <label style={labelStyle}>PHOTOS ({files.length}):</label>
                
                {/* Upload Box */}
                <div style={fileUploadWrapper}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple // ALLOW MULTIPLE
                        onChange={handleImageChange} 
                        style={fileInput} 
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" style={fileLabel}>
                        <div style={{textAlign:'center'}}>
                            <span style={{fontSize:'2rem', display:'block', marginBottom:'5px'}}>📷</span>
                            <span style={{fontFamily:'Lato', color:'#666', fontWeight:'bold', fontSize:'0.8rem'}}>ADD PHOTOS</span>
                        </div>
                    </label>
                </div>

                {/* Previews Grid */}
                {previews.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', overflowX:'auto', paddingBottom:'10px' }}>
                        {previews.map((src, idx) => (
                            <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                                <img src={src} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <button 
                                    type="button" 
                                    onClick={() => removeImage(idx)}
                                    style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center' }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={groupStyle}>
                <label style={labelStyle}>DESCRIPTION:</label>
                <textarea name="description" rows="4" placeholder="DETAILS..." onChange={handleChange} style={textareaStyle}></textarea>
            </div>

            <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? 'POSTING...' : 'PUBLISH LISTING'}
            </button>

        </form>
      </div>
      <style>{`body { background-color: #ffffffff; font-family: 'Lato', sans-serif; } input:focus, select:focus, textarea:focus { border-bottom: 2px solid #111 !important; }`}</style>
    </div>
  );
};

// ... Reuse styles from previous Sell.js ...
const pageWrapper = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' };
const streetwearCard = { backgroundColor: '#ffffffff', border: '2px solid #b75784', boxShadow: '8px 8px 0px rgba(0,0,0,0.15)', padding: '40px', width: '100%', maxWidth: '650px' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 5px 0', color: '#b75784', fontStyle: 'italic' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.9rem', margin: 0, letterSpacing: '2px', fontWeight: '700' };
const rowStyle = { display: 'flex', gap: '20px', marginBottom: '10px' };
const groupStyle = { display: 'flex', flexDirection: 'column', flex: 1, marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '0.9rem', color: '#111', letterSpacing: '1px', marginBottom: '8px', fontWeight: '900', fontFamily: 'Lato' };
const inputStyle = { width: '100%', border: 'none', borderBottom: '1px solid #999', padding: '12px 0', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', fontWeight: 'bold', color: '#111' };
const selectWrapper = { position: 'relative', width: '100%' };
const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center', backgroundSize: '16px' };
const textareaStyle = { ...inputStyle, resize: 'vertical', border: '1px solid #999', padding: '10px', backgroundColor: 'rgba(255,255,255,0.5)' };
const fileUploadWrapper = { position: 'relative', height: '100px', border: '2px dashed #999', backgroundColor: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const fileInput = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 };
const fileLabel = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 };
const buttonStyle = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: '2px solid #111', fontSize: '1rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', marginTop: '10px' };

export default Sell;