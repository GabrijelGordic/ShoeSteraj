import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const ShoeDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Gallery State
  const [mainImage, setMainImage] = useState('');
  const [allImages, setAllImages] = useState([]);

  // Wishlist State
  const [isLiked, setIsLiked] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    // 1. Fetch Shoe Details
    api.get(`/api/shoes/${id}/`)
      .then(res => {
        setShoe(res.data);
        
        // 2. Setup Gallery: Combine Main Image + Extra Images
        const images = [res.data.image]; // Start with cover image
        if (res.data.images && Array.isArray(res.data.images)) {
            // Add gallery images (using the serializer field 'images')
            images.push(...res.data.images.map(imgObj => imgObj.image));
        }
        setAllImages(images);
        setMainImage(res.data.image);
        
        // 3. Setup Heart Status (Backend sends 'is_liked')
        setIsLiked(res.data.is_liked);
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleWishlistToggle = async () => {
      if (!user) {
          navigate('/login');
          return;
      }
      if (wishlistLoading) return;

      // Optimistic Update: Switch color immediately for better UX
      const previousState = isLiked;
      setIsLiked(!isLiked);
      setWishlistLoading(true);

      try {
          await api.post(`/api/shoes/${id}/toggle_wishlist/`);
          setWishlistLoading(false);
      } catch (err) {
          console.error(err);
          setIsLiked(previousState); // Revert if API fails
          setWishlistLoading(false);
      }
  };

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
        
        {/* --- LEFT: IMAGES --- */}
        <div style={imageSection}>
            <div style={mainImageContainer}>
                <img src={mainImage} alt={shoe.title} style={mainImgStyle} />
                
                {/* HEART ICON (Hidden if user is the seller) */}
                {user && user.username !== shoe.seller_username && (
                    <button onClick={handleWishlistToggle} style={heartBtnStyle} title="Add to Wishlist">
                        <svg 
                            width="24" height="24" viewBox="0 0 24 24" 
                            fill={isLiked ? "#d32f2f" : "none"} 
                            stroke={isLiked ? "#d32f2f" : "#111"} 
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                )}
            </div>
            
            {/* THUMBNAILS (Only if > 1 image) */}
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

        {/* --- RIGHT: DETAILS --- */}
        <div style={detailsSection}>
            
            <div style={headerBlock}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                    <h2 style={brandStyle}>{shoe.brand}</h2>
                    {/* VIEW COUNTER */}
                    <div style={viewCountStyle}>
                        👁 {shoe.views} <span style={{fontSize:'0.7rem', fontWeight:'400'}}>VIEWS</span>
                    </div>
                </div>
                
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
                    <div style={{fontSize:'1.2rem'}}>★ {shoe.seller_rating > 0 ? shoe.seller_rating : '-'}</div>
                </div>
            </div>

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

const imageSection = { flex: '1.5', padding: '40px', borderRight: '1px solid #eee', minWidth: '300px' };
const mainImageContainer = { 
    width: '100%', 
    aspectRatio: '1/1', 
    backgroundColor: '#fff', 
    marginBottom: '20px', 
    display:'flex', 
    alignItems:'center', 
    justifyContent:'center',
    overflow: 'hidden',
    position: 'relative' // Needed for Heart Icon
};
const mainImgStyle = { width: '100%', height: '100%', objectFit: 'contain', padding: '20px' };

const heartBtnStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const thumbnailGrid = { display: 'flex', gap: '10px', overflowX: 'auto' };
const thumbContainer = { width: '80px', height: '80px', cursor: 'pointer', padding: '5px', backgroundColor:'#fff' };
const thumbImgStyle = { width: '100%', height: '100%', objectFit: 'contain' };

const detailsSection = { flex: '1', padding: '50px', display:'flex', flexDirection:'column', minWidth: '300px' };

const headerBlock = { marginBottom: '20px' };
const brandStyle = { fontFamily: 'Lato', fontSize: '1rem', color: '#888', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom:'5px' };
const titleStyle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '3rem', margin: '0 0 15px 0', lineHeight: '0.9' };
const priceBlock = { fontSize: '2rem', fontFamily: 'Lato', fontWeight: '900', color: '#111' };

const viewCountStyle = { 
    fontFamily: 'Lato', 
    fontSize: '0.9rem', 
    color: '#666', 
    fontWeight: 'bold', 
    border: '1px solid #ccc', 
    padding: '5px 10px', 
    borderRadius: '20px',
    height: 'fit-content'
};

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