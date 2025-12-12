import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const ShoeDetail = () => {
    const { id } = useParams(); // Get the ID from the URL (e.g. /shoes/5)
    const { user } = useContext(AuthContext); // Check if user is logged in
    
    const [shoe, setShoe] = useState(null);
    const [mainImage, setMainImage] = useState(''); // To swap gallery images
    const [showContact, setShowContact] = useState(false);

    useEffect(() => {
        // Fetch the shoe data
        api.get(`/api/shoes/${id}/`)
            .then(res => {
                setShoe(res.data);
                // Set the default cover image as the main image to start
                setMainImage(res.data.image); 
            })
            .catch(err => console.error("Error fetching shoe:", err));
    }, [id]);

    if (!shoe) return <div style={{padding:'50px', textAlign:'center'}}>Loading Shoe Details...</div>;

    return (
        <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '20px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>← Back to Feed</Link>
            
            <div style={containerStyle}>
                
                {/* --- LEFT COLUMN: IMAGE GALLERY --- */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    {/* Main Big Image */}
                    <div style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                        <img 
                            src={mainImage} 
                            alt={shoe.title} 
                            style={{ width: '100%', height: '400px', objectFit: 'cover' }} 
                        />
                    </div>
                    
                    {/* Thumbnail Grid */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {/* Always show the cover image as the first thumbnail */}
                        <img 
                            src={shoe.image} 
                            alt="Cover"
                            onClick={() => setMainImage(shoe.image)}
                            style={{
                                ...thumbStyle, 
                                border: mainImage === shoe.image ? '2px solid blue' : '1px solid #ddd'
                            }}
                        />
                        {/* Show extra gallery images if they exist */}
                        {shoe.gallery && shoe.gallery.map(img => (
                            <img 
                                key={img.id}
                                src={img.image} 
                                alt="Gallery"
                                onClick={() => setMainImage(img.image)}
                                style={{
                                    ...thumbStyle, 
                                    border: mainImage === img.image ? '2px solid blue' : '1px solid #ddd'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* --- RIGHT COLUMN: INFO & SELLER --- */}
                <div style={{ flex: 1, paddingLeft: '40px', minWidth: '300px' }}>
                    
                    {/* Title & Brand */}
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '5px' }}>{shoe.title}</h1>
                    <h2 style={{ color: '#555', marginTop: '0' }}>{shoe.brand}</h2>
                    
                    {/* Specs Grid */}
                    <div style={specGrid}>
                        <div style={specItem}>
                            <span style={labelStyle}>Size</span>
                            <span style={valueStyle}>{shoe.size}</span>
                        </div>
                        <div style={specItem}>
                            <span style={labelStyle}>Condition</span>
                            <span style={valueStyle}>{shoe.condition}</span>
                        </div>
                    </div>

                    {/* Price */}
                    <h2 style={{ color: '#2e7d32', fontSize: '2rem', margin: '20px 0' }}>
                        ${shoe.price}
                    </h2>

                    {/* Description */}
                    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h4 style={{marginTop:0}}>Description</h4>
                        <p style={{ lineHeight: '1.6', color: '#444' }}>
                            {shoe.description || "No description provided."}
                        </p>
                    </div>

                    {/* SELLER SECTION */}
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div>
                                <span style={{ color: '#888' }}>Seller: </span>
                                {/* Link to the Seller Profile Page */}
                                <Link to={`/seller/${shoe.seller_username}`} style={{ fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none', color: '#007bff' }}>
                                    {shoe.seller_username}
                                </Link>
                            </div>
                            
                            {/* Star Rating Badge */}
                            <div style={{ background: '#fff8e1', padding: '5px 10px', borderRadius: '20px', fontWeight: 'bold', color: '#ff8f00' }}>
                                ★ {shoe.seller_rating}
                            </div>
                        </div>

                        {/* Contact Logic */}
                        {!showContact ? (
                            <button 
                                onClick={() => user ? setShowContact(true) : alert("Please Login to see contact info")}
                                style={contactBtnStyle}
                            >
                                Contact Seller
                            </button>
                        ) : (
                            <div style={{ padding: '15px', background: '#e8f5e9', border: '1px solid green', borderRadius: '5px', textAlign: 'center' }}>
                                <strong>Contact {shoe.seller_username}:</strong>
                                <br/>
                                <span style={{ fontSize: '1.2rem' }}>
                                    {shoe.contact_info || "Contact info hidden by seller"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CSS Styles ---
const containerStyle = { display: 'flex', marginTop: '20px', flexWrap: 'wrap' };
const thumbStyle = { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', cursor: 'pointer' };
const specGrid = { display: 'flex', gap: '40px', marginTop: '20px' };
const specItem = { display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '0.9rem', color: '#888', textTransform: 'uppercase' };
const valueStyle = { fontSize: '1.5rem', fontWeight: 'bold' };
const contactBtnStyle = { width: '100%', padding: '15px', backgroundColor: '#111', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1.1rem', borderRadius: '8px', fontWeight: 'bold' };

export default ShoeDetail;