import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Wishlist = () => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only the shoes the user has liked
    api.get('/api/shoes/favorites/')
      .then(res => {
        setShoes(res.data.results || res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getCurrencySymbol = (code) => {
    if (code === 'USD') return '$';
    if (code === 'GBP') return '£';
    return '€';
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'80vh', backgroundColor:'#fff' }}>
        <p style={{fontFamily: 'Lato', fontWeight:'bold', fontSize:'1.2rem'}}>LOADING FAVORITES...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '60px 40px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={titleStyle}>MY WISHLIST</h1>
        <p style={subtitleStyle}>YOUR SAVED COLLECTION.</p>
      </div>

      {shoes.length === 0 ? (
        <div style={emptyStateContainer}>
            <h3 style={emptyTitle}>NO FAVORITES YET.</h3>
            <p style={{ fontFamily: 'Lato', color:'#888', marginBottom:'20px' }}>Start browsing to add items to your list.</p>
            <Link to="/" style={shopBtn}>BROWSE KICKS</Link>
        </div>
      ) : (
        <div style={gridStyle}>
          {shoes.map((shoe, index) => (
            <div key={shoe.id} className="product-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <Link to={`/shoes/${shoe.id}`} style={{ textDecoration:'none' }}>
                    
                    <div style={imageContainerStyle}>
                        <img 
                            src={shoe.image} 
                            alt={shoe.title} 
                            className="product-image"
                            style={imageStyle} 
                        />
                    </div>
                    
                    <div style={{ padding: '15px 0', textAlign: 'center' }}>
                        <p style={brandStyle}>{shoe.brand}</p>
                        <h3 style={cardTitleStyle}>{shoe.title}</h3>
                        <p style={priceStyle}>{getCurrencySymbol(shoe.currency)}{shoe.price}</p>
                        {/* Optional: Add a "Remove" button logic later if needed */}
                    </div>

                </Link>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        body { font-family: 'Lato', sans-serif; }

        /* PRODUCT CARD ANIMATIONS (Matches Home.js) */
        .product-card { 
            opacity: 0; 
            animation: fadeInUp 0.5s ease-out forwards; 
            cursor: pointer; 
        }
        
        /* HOVER ZOOM EFFECT */
        .product-image { transition: transform 0.5s ease; }
        .product-card:hover .product-image { transform: scale(1.1); }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

// --- STYLES ---

const titleStyle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '4rem', margin: '0 0 5px 0', color: '#111', lineHeight: '0.9', letterSpacing: '2px' };
const subtitleStyle = { fontFamily: '"Lato", sans-serif', color: '#b75784', fontSize: '0.9rem', margin: 0, letterSpacing: '2px', fontWeight: '700', textTransform: 'uppercase' };

// Grid & Cards
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '50px 40px', maxWidth: '1400px', margin: '0 auto' };

const imageContainerStyle = { overflow: 'hidden', backgroundColor: '#fff', aspectRatio: '1 / 1.1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #b75784' };
const imageStyle = { width: '100%', height: '100%', objectFit: 'contain', padding: '20px' };

const brandStyle = { margin: '0 0 5px', color: '#b75784', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' };
const cardTitleStyle = { margin: '0 0 10px', fontFamily: '"Lato", sans-serif', fontSize: '1.2rem', fontWeight: '900', color: '#111' };
const priceStyle = { margin: '0', fontFamily: '"Lato", sans-serif', fontSize: '1rem', fontWeight: 'bold', color: '#333' };

// Empty State
const emptyStateContainer = { textAlign: 'center', padding: '100px 0' };
const emptyTitle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '3rem', margin: '0 0 10px 0', color: '#111' };
const shopBtn = { display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '15px 40px', textDecoration: 'none', fontFamily: 'Lato', fontWeight: '900', letterSpacing: '2px', fontSize: '0.9rem', textTransform: 'uppercase' };

export default Wishlist;