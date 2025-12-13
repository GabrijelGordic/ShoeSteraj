import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const ShoeDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    
    const [shoe, setShoe] = useState(null);
    const [mainImage, setMainImage] = useState(''); 
    const [showContact, setShowContact] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/shoes/${id}/`)
            .then(res => {
                setShoe(res.data);
                setMainImage(res.data.image); 
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching shoe:", err);
                setLoading(false);
            });
    }, [id]);

    const getCurrencySymbol = (code) => {
        if (code === 'USD') return '$';
        if (code === 'GBP') return '£';
        return '€';
    };

    const generateWhatsAppLink = (contactInfo, shoeTitle) => {
        // Extract only numbers
        const cleanNumber = contactInfo ? contactInfo.replace(/\D/g, '') : '';
        const text = `Hi, I am interested in your listing for "${shoeTitle}" on Šuzeraj. Is it still available?`;
        const encodedText = encodeURIComponent(text);
        return `https://wa.me/${cleanNumber}?text=${encodedText}`;
    };

    if (loading) return <div style={centerMsg}>Loading details...</div>;
    if (!shoe) return <div style={centerMsg}>Shoe not found.</div>;

    const currencySymbol = getCurrencySymbol(shoe.currency);

    return (
        <div style={pageWrapper}>
            
            <div style={{ marginBottom: '40px' }}>
                <Link to="/" style={backLink}>&larr; BACK TO SHOP</Link>
            </div>
            
            <div style={containerStyle}>
                
                {/* LEFT: IMAGERY */}
                <div style={imageSection}>
                    <div style={mainImageContainer}>
                        <img src={mainImage} alt={shoe.title} style={mainImgStyle} />
                    </div>
                    <div style={thumbnailRow}>
                        <img 
                            src={shoe.image} alt="Cover" onClick={() => setMainImage(shoe.image)}
                            style={{...thumbStyle, opacity: mainImage === shoe.image ? 1 : 0.5, border: mainImage === shoe.image ? '1px solid #000' : '1px solid #ddd'}}
                        />
                        {shoe.gallery && shoe.gallery.map(img => (
                            <img 
                                key={img.id} src={img.image} alt="Gallery" onClick={() => setMainImage(img.image)}
                                style={{...thumbStyle, opacity: mainImage === img.image ? 1 : 0.5, border: mainImage === img.image ? '1px solid #000' : '1px solid #ddd'}}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT: DETAILS */}
                <div style={detailsSection}>
                    <h2 style={brandStyle}>{shoe.brand}</h2>
                    <h1 style={titleStyle}>{shoe.title}</h1>
                    <p style={priceStyle}>{currencySymbol}{shoe.price}</p>

                    <div style={divider}></div>

                    <div style={specGrid}>
                        <div style={specItem}><span style={labelStyle}>SIZE (EU)</span><span style={valueStyle}>{shoe.size}</span></div>
                        <div style={specItem}><span style={labelStyle}>CONDITION</span><span style={valueStyle}>{shoe.condition}</span></div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <h4 style={labelStyle}>DESCRIPTION</h4>
                        <p style={descStyle}>{shoe.description || "No description provided."}</p>
                    </div>

                    <div style={divider}></div>

                    <div style={sellerContainer}>
                        <span style={labelStyle}>SOLD BY</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                            <Link to={`/seller/${shoe.seller_username}`} style={sellerLink}>{shoe.seller_username}</Link>
                            <span style={ratingBadge}>★ {shoe.seller_rating > 0 ? shoe.seller_rating : 'New'}</span>
                        </div>
                    </div>

                    {/* --- ACTION BUTTONS --- */}
                    {!showContact ? (
                        <button 
                            onClick={() => user ? setShowContact(true) : alert("Please Login to view contact details.")}
                            style={contactBtn}
                        >
                            CONTACT SELLER
                        </button>
                    ) : (
                        <div style={contactReveal}>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', marginBottom: '15px' }}>
                                Contact Options
                            </p>
                            
                            {/* RAW INFO Display */}
                            <p style={{ margin: '0 0 15px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                {shoe.contact_info}
                            </p>

                            {/* WhatsApp Button Only */}
                            <a 
                                href={generateWhatsAppLink(shoe.contact_info, shoe.title)}
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={whatsappBtn}
                            >
                                Chat on WhatsApp
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---
const pageWrapper = { maxWidth: '1200px', margin: '0 auto', padding: '60px 40px', minHeight: '80vh' };
const centerMsg = { textAlign: 'center', marginTop: '100px', fontFamily: 'Lato', color: '#888' };
const backLink = { textDecoration: 'none', color: '#999', fontFamily: 'Lato', fontSize: '0.75rem', letterSpacing: '2px', fontWeight: '700' };
const containerStyle = { display: 'flex', flexWrap: 'wrap', gap: '80px' };
const imageSection = { flex: '1.2', minWidth: '350px' };
const mainImageContainer = { backgroundColor: '#f9f9f9', marginBottom: '20px', border: '1px solid #eee' };
const mainImgStyle = { width: '100%', height: 'auto', display: 'block', objectFit: 'cover', aspectRatio: '1/1' };
const thumbnailRow = { display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' };
const thumbStyle = { width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', transition: 'opacity 0.2s' };
const detailsSection = { flex: '1', minWidth: '300px', paddingTop: '10px' };
const brandStyle = { fontFamily: 'Lato', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#666', margin: '0 0 10px 0' };
const titleStyle = { fontFamily: '"Playfair Display", serif', fontSize: '3rem', lineHeight: '1.1', margin: '0 0 20px 0', color: '#111', fontWeight: '400' };
const priceStyle = { fontFamily: 'Lato', fontSize: '1.5rem', fontWeight: '300', color: '#111', margin: '0 0 30px 0' };
const divider = { height: '1px', backgroundColor: '#eee', margin: '30px 0' };
const specGrid = { display: 'flex', gap: '50px' };
const specItem = { display: 'flex', flexDirection: 'column' };
const labelStyle = { fontFamily: 'Lato', fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: '#999', marginBottom: '8px', textTransform: 'uppercase' };
const valueStyle = { fontFamily: 'Lato', fontSize: '1.2rem', fontWeight: '400', color: '#111' };
const descStyle = { fontFamily: 'Lato', fontSize: '0.95rem', lineHeight: '1.6', color: '#555', margin: 0 };
const sellerContainer = { marginBottom: '30px' };
const sellerLink = { textDecoration: 'none', fontFamily: 'Lato', fontSize: '1rem', fontWeight: '700', color: '#111', borderBottom: '1px solid #111' };
const ratingBadge = { marginLeft: '10px', backgroundColor: '#111', color: '#fff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '2px', fontFamily: 'Lato' };

const contactBtn = { width: '100%', padding: '20px', backgroundColor: '#111', color: '#fff', border: 'none', fontFamily: 'Lato', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: '700', cursor: 'pointer' };

const contactReveal = { width: '100%', padding: '20px', border: '1px solid #eee', textAlign: 'center', backgroundColor: '#fcfcfc', borderRadius: '8px' };

const whatsappBtn = {
    display: 'block',
    width: '100%',
    padding: '15px',
    backgroundColor: '#25D366', // WhatsApp Green
    color: '#fff',
    textDecoration: 'none',
    fontFamily: 'Lato',
    fontWeight: 'bold',
    borderRadius: '4px',
    boxSizing: 'border-box',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.9rem'
};

export default ShoeDetail;