import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const ShoeDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // For Gallery
  const [mainImage, setMainImage] = useState('');
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    api.get(`/api/shoes/${id}/`)
      .then(res => {
        setShoe(res.data);
        // Setup images: Main image + any extra images from backend
        const images = [res.data.image];
        if (res.data.images && Array.isArray(res.data.images)) {
            images.push(...res.data.images.map(imgObj => imgObj.image));
        }
        setAllImages(images);
        setMainImage(res.data.image);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const getCurrencySymbol = (code) => {
    if (code === 'USD') return '$';
    if (code === 'GBP') return '£';
    return '€';
  };

  if (loading) return <div style={centerMsg}>OPENING VAULT...</div>;
  if (!shoe) return <div style={centerMsg}>ITEM NOT FOUND.</div>;

  return (
    <div style={containerStyle}>
      <div style={contentWrapper}>
        
        {/* --- LEFT COLUMN: IMAGES --- */}
        <div style={imageSection}>
            <div style={mainImageContainer}>
                <img src={mainImage} alt={shoe.title} style={mainImgStyle} />
            </div>
            
            {/* THUMBNAILS (Only show if > 1 image) */}
            {allImages.length > 1 && (
                <div style={thumbnailGrid}>
                    {allImages.map((img, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setMainImage(img)}
                            style={{
                                ...thumbContainer,
                                border: mainImage === img ? '2px solid #111' : '1px solid #ccc'
                            }}
                        >
                            <img src={img} alt="thumb" style={thumbImgStyle} />
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* --- RIGHT COLUMN: DETAILS --- */}
        <div style={detailsSection}>
            
            <div style={headerBlock}>
                <h2 style={brandStyle}>{shoe.brand}</h2>
                <h1 style={titleStyle}>{shoe.title}</h1>
                <div style={priceBlock}>
                    {getCurrencySymbol(shoe.currency)}{shoe.price}
                </div>
            </div>

            <div style={divider}></div>

            <div style={infoGrid}>
                <div style={infoItem}>
                    <span style={labelStyle}>SIZE</span>
                    <span style={valueStyle}>EU {shoe.size}</span>
                </div>
                <div style={infoItem}>
                    <span style={labelStyle}>CONDITION</span>
                    <span style={valueStyle}>{shoe.condition}</span>
                </div>
            </div>

            <div style={descriptionBox}>
                <span style={labelStyle}>DESCRIPTION</span>
                <p style={descText}>{shoe.description || "No description provided."}</p>
            </div>

            <div style={sellerCard}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <div>
                        <span style={{fontSize:'0.7rem', color:'#888', fontWeight:'bold'}}>SOLD BY</span>
                        <Link to={`/seller/${shoe.seller_username}`} style={sellerLink}>
                            @{shoe.seller_username}
                        </Link>
                    </div>
                    {/* Placeholder for Seller Rating if available */}
                    <div style={{fontSize:'1.2rem'}}>★</div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            {user && user.username === shoe.seller_username ? (
                <div style={ownItemBox}>This is your listing.</div>
            ) : (
                <button style={buyBtn}>
                    CONTACT SELLER / BUY
                </button>
            )}

        </div>
      </div>
      <style>{`
        body { background-color: #b1b1b1ff; font-family: 'Lato', sans-serif; }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '40px 20px', minHeight: '100vh', display:'flex', justifyContent:'center' };
const centerMsg = { textAlign: 'center', marginTop: '100px', fontFamily: 'Lato', fontWeight:'bold', fontSize:'1.5rem' };

const contentWrapper = { 
    display: 'flex', 
    flexWrap: 'wrap', 
    maxWidth: '1100px', 
    width: '100%', 
    backgroundColor: '#FCFCFC', 
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    borderRadius: '4px',
    overflow: 'hidden'
};

// IMAGES
const imageSection = { flex: '1.5', padding: '40px', borderRight: '1px solid #eee', minWidth: '300px' };
const mainImageContainer = { 
    width: '100%', 
    aspectRatio: '1/1', // Square box
    backgroundColor: '#fff', 
    marginBottom: '20px', 
    display:'flex', 
    alignItems:'center', 
    justifyContent:'center',
    overflow: 'hidden'
};
const mainImgStyle = { 
    width: '100%', 
    height: '100%', 
    objectFit: 'contain', // FIX: Prevents zooming/cropping
    padding: '20px'      // Breathing room
};

const thumbnailGrid = { display: 'flex', gap: '10px', overflowX: 'auto' };
const thumbContainer = { width: '80px', height: '80px', cursor: 'pointer', padding: '5px', backgroundColor:'#fff' };
const thumbImgStyle = { width: '100%', height: '100%', objectFit: 'contain' };

// DETAILS
const detailsSection = { flex: '1', padding: '50px', display:'flex', flexDirection:'column', minWidth: '300px' };

const headerBlock = { marginBottom: '20px' };
const brandStyle = { fontFamily: 'Lato', fontSize: '1rem', color: '#888', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom:'5px' };
const titleStyle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '3rem', margin: '0 0 15px 0', lineHeight: '0.9' };
const priceBlock = { fontSize: '2rem', fontFamily: 'Lato', fontWeight: '900', color: '#111' };

const divider = { height: '1px', backgroundColor: '#eee', margin: '20px 0' };

const infoGrid = { display: 'flex', gap: '40px', marginBottom: '30px' };
const infoItem = { display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '0.7rem', color: '#999', fontWeight: '900', letterSpacing: '1px', marginBottom: '5px' };
const valueStyle = { fontSize: '1.2rem', fontFamily: 'Lato', fontWeight: 'bold' };

const descriptionBox = { marginBottom: '30px' };
const descText = { fontFamily: 'Lato', lineHeight: '1.6', color: '#555', marginTop:'5px' };

const sellerCard = { padding: '15px', border: '1px solid #eee', backgroundColor: '#f9f9f9', marginBottom: '30px', borderRadius:'4px' };
const sellerLink = { display:'block', fontSize: '1.2rem', fontFamily: '"Bebas Neue", sans-serif', textDecoration:'none', color:'#111', letterSpacing:'1px' };

const buyBtn = { width: '100%', padding: '20px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', textTransform: 'uppercase', marginTop: 'auto' };
const ownItemBox = { width: '100%', padding: '20px', backgroundColor: '#eee', color: '#555', textAlign: 'center', fontWeight: 'bold', fontFamily: 'Lato' };

export default ShoeDetail;