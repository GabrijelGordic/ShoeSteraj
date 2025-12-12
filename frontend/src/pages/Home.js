import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [shoes, setShoes] = useState([]);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchShoes = () => {
    let query = '/api/shoes/?';
    if (search) query += `search=${search}&`;
    if (brandFilter) query += `brand=${brandFilter}&`;

    api.get(query)
      .then(res => {
        setShoes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchShoes();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchShoes();
  };

  return (
    <div style={{ backgroundColor: '#FCFCFC', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* --- HEADER SECTION --- */}
      <div style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <h1 style={{ 
            fontFamily: '"Playfair Display", serif', 
            fontSize: '3.5rem', 
            margin: '0 0 20px 0', 
            color: '#111' 
        }}>
            Curated Collection
        </h1>
        <p style={{ fontFamily: '"Lato", sans-serif', color: '#666', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>
            Discover exclusive footwear from verified sellers. <br/>Authentic style, curated for you.
        </p>

        {/* --- FILTER BAR --- */}
        <div style={filterBarStyles}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={minimalInput}
                />
                <select 
                    value={brandFilter} 
                    onChange={(e) => setBrandFilter(e.target.value)}
                    style={minimalSelect}
                >
                    <option value="">All Designers</option>
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Yeezy">Yeezy</option>
                    <option value="New Balance">New Balance</option>
                </select>
                <button type="submit" style={minimalButton}>Filter</button>
            </form>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        {loading ? (
            <p style={{textAlign:'center', fontFamily:'Lato'}}>Loading collection...</p>
        ) : (
            <div style={gridStyle}>
                {shoes.length > 0 ? shoes.map((shoe, index) => (
                    <div key={shoe.id} className="product-card" style={{animationDelay: `${index * 0.1}s`}}>
                        
                        <Link to={`/shoes/${shoe.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                            {/* Image Container */}
                            <div style={imageContainerStyle}>
                                {/* FIXED: Added className="product-image" directly here */}
                                <img 
                                    src={shoe.image} 
                                    alt={shoe.title} 
                                    style={imageStyle} 
                                    className="product-image" 
                                />
                            </div>
                            
                            {/* Product Details */}
                            <div style={{ padding: '20px 0', textAlign: 'center' }}>
                                <p style={brandStyle}>{shoe.brand}</p>
                                <h3 style={titleStyle}>{shoe.title}</h3>
                                <p style={priceStyle}>${shoe.price}</p>
                                
                                <p style={sellerStyle}>
                                    Sold by {shoe.seller_username}
                                </p>
                            </div>
                        </Link>
                    </div>
                )) : (
                    <p style={{gridColumn: '1/-1', textAlign:'center', color:'#888'}}>No results found.</p>
                )}
            </div>
        )}
      </div>

      {/* --- CSS ANIMATIONS & HOVER EFFECTS --- */}
      <style>{`
        body { font-family: 'Lato', sans-serif; }
        
        /* Fade In Animation */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .product-card {
            opacity: 0;
            animation: fadeInUp 0.8s ease-out forwards;
            transition: transform 0.4s ease;
            cursor: pointer;
        }

        /* --- THE HOVER EFFECT --- */
        /* When hovering the card, target the image inside */
        .product-card:hover .product-image {
            transform: scale(1.05); /* Slight enlargement */
        }
      `}</style>
    </div>
  );
};

// --- STYLES ---

const filterBarStyles = {
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
    padding: '20px 0',
    maxWidth: '800px',
    margin: '0 auto'
};

const minimalInput = {
    border: 'none',
    borderBottom: '1px solid #ccc',
    padding: '10px',
    width: '200px',
    outline: 'none',
    fontFamily: '"Lato", sans-serif',
    fontSize: '0.9rem',
    backgroundColor: 'transparent'
};

const minimalSelect = {
    border: 'none',
    borderBottom: '1px solid #ccc',
    padding: '10px',
    width: '150px',
    outline: 'none',
    fontFamily: '"Lato", sans-serif',
    fontSize: '0.9rem',
    backgroundColor: 'transparent',
    cursor: 'pointer'
};

const minimalButton = {
    background: '#111',
    color: '#fff',
    border: 'none',
    padding: '10px 25px',
    fontFamily: '"Lato", sans-serif',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    cursor: 'pointer'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '60px 40px',
};

const imageContainerStyle = {
    overflow: 'hidden', // Key logic: Hides the parts of the image that grow outside the box
    backgroundColor: '#fff',
    aspectRatio: '1 / 1.2', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease', // Makes the zoom smooth
};

const brandStyle = {
    margin: '0 0 5px',
    color: '#999',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '700'
};

const titleStyle = {
    margin: '0 0 10px',
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.4rem',
    fontWeight: '400',
    color: '#111'
};

const priceStyle = {
    margin: '0',
    fontFamily: '"Lato", sans-serif',
    fontSize: '1rem',
    fontWeight: '300',
    color: '#333'
};

const sellerStyle = {
    margin: '15px 0 0',
    fontSize: '0.8rem',
    color: '#aaa',
    fontStyle: 'italic'
};

export default Home;