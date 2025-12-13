import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta'; // <--- ADDED IMPORT

const Home = () => {
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FILTER STATES ---
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  // --- PAGINATION STATES ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const SIZE_OPTIONS = [];
  for (let i = 35; i <= 49.5; i += 0.5) {
      SIZE_OPTIONS.push(i);
  }

  const getCurrencySymbol = (code) => {
      if (code === 'USD') return '$';
      if (code === 'GBP') return '£';
      return '€';
  };

  const fetchShoes = () => {
    setLoading(true);
    let query = `/api/shoes/?page=${page}&page_size=${pageSize}`;
    
    if (search) query += `&search=${search}`;
    if (brand) query += `&brand=${brand}`;
    if (size) query += `&size=${size}`;
    if (condition) query += `&condition=${condition}`;
    if (minPrice) query += `&min_price=${minPrice}`;
    if (maxPrice) query += `&max_price=${maxPrice}`;
    if (currencyFilter) query += `&currency=${currencyFilter}`;
    if (ordering) query += `&ordering=${ordering}`;

    api.get(query)
      .then(res => {
        setShoes(res.data.results);
        setTotalPages(Math.ceil(res.data.count / pageSize));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    setPage(1); 
    fetchShoes();
    // eslint-disable-next-line
  }, [brand, size, condition, ordering, minPrice, maxPrice, currencyFilter, pageSize]); 

  useEffect(() => {
    fetchShoes();
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchShoes();
  };

  const clearFilters = () => {
    setBrand('');
    setSize('');
    setCondition('');
    setMinPrice('');
    setMaxPrice('');
    setCurrencyFilter('');
    setOrdering('-created_at');
    setSearch('');
  };

  return (
    <div style={{ backgroundColor: '#FCFCFC', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* --- SEO META --- */}
      <Meta /> 

      {/* --- HEADER --- */}
      <div style={heroHeaderStyle}>
        <h1 style={headingStyle}>Curated Collection</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <input 
                type="text" 
                placeholder="Search by keyword..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={searchInputStyle}
            />
            <button type="submit" style={searchBtnStyle}>SEARCH</button>
            
            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} style={headerSelectStyle}>
                <option value="12">12 per page</option>
                <option value="24">24 per page</option>
                <option value="48">48 per page</option>
            </select>
        </form>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div style={mainContainerStyle}>
        
        {/* --- LEFT SIDEBAR --- */}
        <div style={sidebarStyle}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
                <h3 style={filterTitle}>FILTERS</h3>
                <button onClick={clearFilters} style={clearBtn}>Clear All</button>
            </div>

            <div style={filterGroup}>
                <label style={labelStyle}>SORT BY</label>
                <select value={ordering} onChange={e => setOrdering(e.target.value)} style={selectStyle}>
                    <option value="-created_at">Newest First</option>
                    <option value="created_at">Oldest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                </select>
            </div>

            <div style={filterGroup}>
                <label style={labelStyle}>PRICE RANGE</label>
                <div style={{display: 'flex', gap: '10px', marginBottom:'10px'}}>
                    <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={smallInput} />
                    <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={smallInput} />
                </div>
                <select value={currencyFilter} onChange={e => setCurrencyFilter(e.target.value)} style={selectStyle}>
                    <option value="">Any Currency</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                </select>
            </div>

            <div style={filterGroup}>
                <label style={labelStyle}>BRAND</label>
                <select value={brand} onChange={e => setBrand(e.target.value)} style={selectStyle}>
                    <option value="">All Brands</option>
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Yeezy">Yeezy</option>
                    <option value="New Balance">New Balance</option>
                    <option value="Asics">Asics</option>
                    <option value="Converse">Converse</option>
                </select>
            </div>

            <div style={filterGroup}>
                <label style={labelStyle}>SIZE (EU)</label>
                <select value={size} onChange={e => setSize(e.target.value)} style={selectStyle}>
                    <option value="">Any Size</option>
                    {SIZE_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

             <div style={filterGroup}>
                <label style={labelStyle}>CONDITION</label>
                <select value={condition} onChange={e => setCondition(e.target.value)} style={selectStyle}>
                    <option value="">Any Condition</option>
                    <option value="New">New / Deadstock</option>
                    <option value="Used">Used / Worn</option>
                </select>
            </div>
        </div>

        {/* --- RIGHT CONTENT --- */}
        <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Lato', color: '#888', fontSize: '0.9rem' }}>
                    Showing {shoes.length} results
                </span>
            </div>

            {loading ? (
                <p style={{textAlign:'center', padding:'50px'}}>Updating results...</p>
            ) : (
                <div style={gridStyle}>
                    {shoes.length > 0 ? shoes.map((shoe, index) => (
                        <div key={shoe.id} className="product-card" style={{animationDelay: `${index * 0.05}s`}}>
                            <Link to={`/shoes/${shoe.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                                <div style={imageContainerStyle}>
                                    <img src={shoe.image} alt={shoe.title} style={imageStyle} className="product-image" />
                                </div>
                                <div style={{ padding: '15px 0', textAlign: 'center' }}>
                                    <p style={brandStyle}>{shoe.brand}</p>
                                    <h3 style={titleStyle}>{shoe.title}</h3>
                                    <p style={priceStyle}>
                                        {getCurrencySymbol(shoe.currency)}{shoe.price}
                                    </p>
                                    <p style={sellerStyle}>
                                        Sold by {shoe.seller_username}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    )) : (
                        <div style={{textAlign:'center', padding:'50px', gridColumn: '1/-1'}}>
                            <h3 style={{fontFamily: 'Playfair Display'}}>No shoes match your filters.</h3>
                            <button onClick={clearFilters} style={{background:'none', border:'none', textDecoration:'underline', cursor:'pointer', color:'blue'}}>
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '60px 0' }}>
                    <button disabled={page === 1} onClick={() => {setPage(page - 1); window.scrollTo(0,0)}} style={pageBtn}>PREV</button>
                    <span style={{alignSelf:'center', fontFamily:'Lato'}}>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => {setPage(page + 1); window.scrollTo(0,0)}} style={pageBtn}>NEXT</button>
                </div>
            )}
        </div>
      </div>

      <style>{`
        body { font-family: 'Lato', sans-serif; }
        .product-card { opacity: 0; animation: fadeInUp 0.5s ease-out forwards; cursor: pointer; }
        .product-card:hover .product-image { transform: scale(1.05); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const heroHeaderStyle = { textAlign: 'center', padding: '40px 20px', borderBottom: '1px solid #eee', backgroundColor: '#fff', marginBottom: '40px' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '3rem', margin: 0, color: '#111' };
const searchInputStyle = { border: '1px solid #ccc', padding: '12px', width: '300px', borderRadius: '4px 0 0 4px', outline: 'none', fontFamily:'Lato' };
const searchBtnStyle = { background: '#111', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '0 4px 4px 0', cursor: 'pointer', fontFamily:'Lato', fontWeight:'bold' };
const headerSelectStyle = { marginLeft: '10px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Lato', cursor: 'pointer' };

const mainContainerStyle = { width: '100%', padding: '0 40px', boxSizing: 'border-box', display: 'flex', gap: '200px', alignItems: 'flex-start' };
const sidebarStyle = { width: '250px', minWidth: '250px', position: 'sticky', top: '100px' };

const filterTitle = { fontFamily: 'Lato', fontSize: '1.2rem', margin: 0, fontWeight: '900' };
const clearBtn = { background: 'none', border: 'none', color: '#999', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' };
const filterGroup = { marginBottom: '30px' };
const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' };
const selectStyle = { width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', fontFamily: 'Lato', backgroundColor: 'transparent' };
const smallInput = { width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', fontFamily: 'Lato' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '50px 40px' };
const imageContainerStyle = { overflow: 'hidden', backgroundColor: '#fff', aspectRatio: '1 / 1.1', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const imageStyle = { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' };

const brandStyle = { margin: '0 0 5px', color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' };
const titleStyle = { margin: '0 0 10px', fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', fontWeight: '400', color: '#111' };
const priceStyle = { margin: '0', fontFamily: '"Lato", sans-serif', fontSize: '1rem', fontWeight: 'bold', color: '#333' };
const sellerStyle = { margin: '15px 0 0', fontSize: '0.8rem', color: '#aaa', fontStyle: 'italic' };

const pageBtn = { padding: '10px 20px', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' };

export default Home;