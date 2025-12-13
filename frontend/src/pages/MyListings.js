import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyListings = () => {
    const { user } = useContext(AuthContext);
    const [shoes, setShoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // FIX: Added page_size=100 to get all listings
            // The API response changed structure, so we need to check for 'results'
            api.get(`/api/shoes/?seller__username=${user.username}&page_size=100`)
                .then(res => {
                    // FIX: Check if pagination is active (res.data.results) or not (res.data)
                    const shoeData = res.data.results ? res.data.results : res.data;
                    setShoes(shoeData);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching listings:", err);
                    setLoading(false);
                });
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this listing?")) {
            try {
                await api.delete(`/api/shoes/${id}/`);
                setShoes(shoes.filter(shoe => shoe.id !== id));
            } catch (error) {
                alert("Failed to delete. Please try again.");
            }
        }
    };

    if (!user) return <div style={centerMsg}>Please login to view your listings.</div>;
    if (loading) return <div style={centerMsg}>Loading your collection...</div>;

    return (
        <div style={containerStyle}>
            
            {/* --- HEADER --- */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={headingStyle}>My Collection</h1>
                <p style={subHeadingStyle}>Manage your active listings.</p>
            </div>

            {/* --- LISTINGS --- */}
            {shoes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <p style={{ fontFamily: 'Lato', color: '#666', marginBottom: '20px' }}>You haven't listed any kicks yet.</p>
                    <Link to="/sell" style={startSellingBtn}>START SELLING</Link>
                </div>
            ) : (
                <div style={{ borderTop: '1px solid #eee' }}>
                    {shoes.map(shoe => (
                        <div key={shoe.id} className="listing-row">
                            
                            {/* 1. Image */}
                            <img src={shoe.image} alt={shoe.title} className="listing-image" />
                            
                            {/* 2. Details */}
                            <div style={{ flex: 1, padding: '0 20px' }}>
                                <h3 style={titleStyle}>{shoe.title}</h3>
                                <p style={metaStyle}>{shoe.brand} | Size {shoe.size}</p>
                                <p style={priceStyle}>
                                    {/* Helper to show correct currency symbol */}
                                    {shoe.currency === 'USD' ? '$' : shoe.currency === 'GBP' ? '£' : '€'}
                                    {shoe.price}
                                </p>
                            </div>

                            {/* 3. Actions */}
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <Link to={`/shoes/${shoe.id}`} className="action-link view-link">
                                    VIEW
                                </Link>
                                <button 
                                    onClick={() => handleDelete(shoe.id)} 
                                    className="action-btn delete-btn"
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- CSS STYLES --- */}
            <style>{`
                /* Row Animation & Hover */
                .listing-row {
                    display: flex;
                    align-items: center;
                    padding: 20px 0;
                    border-bottom: 1px solid #eee;
                    transition: background-color 0.2s ease;
                }
                .listing-row:hover {
                    background-color: #fcfcfc;
                }

                /* Image Styling */
                .listing-image {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 4px; /* Slight rounding */
                    background-color: #f0f0f0;
                }

                /* Buttons */
                .action-link, .action-btn {
                    font-family: 'Lato', sans-serif;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    background: none;
                }

                .view-link {
                    color: #111;
                    border: 1px solid #ccc;
                    padding: 8px 15px;
                }
                .view-link:hover {
                    border-color: #000;
                    background-color: #000;
                    color: #fff;
                }

                .delete-btn {
                    color: #999;
                    padding: 8px 15px;
                }
                .delete-btn:hover {
                    color: #d32f2f; /* Red on hover */
                    background-color: #ffebee;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

// --- JS STYLES ---

const containerStyle = {
    maxWidth: '900px',
    margin: '60px auto',
    padding: '0 20px',
};

const centerMsg = {
    textAlign: 'center',
    marginTop: '100px',
    fontFamily: 'Lato',
    color: '#888'
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

const titleStyle = {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.2rem',
    margin: '0 0 5px 0',
    color: '#111'
};

const metaStyle = {
    fontFamily: '"Lato", sans-serif',
    fontSize: '0.85rem',
    color: '#888',
    margin: '0 0 5px 0',
    textTransform: 'uppercase',
    letterSpacing: '1px'
};

const priceStyle = {
    fontFamily: '"Lato", sans-serif',
    fontSize: '1rem',
    color: '#2e7d32', // Green
    margin: 0,
    fontWeight: '700'
};

const startSellingBtn = {
    display: 'inline-block',
    backgroundColor: '#111',
    color: '#fff',
    padding: '12px 25px',
    textDecoration: 'none',
    fontFamily: 'Lato',
    fontWeight: '700',
    fontSize: '0.8rem',
    letterSpacing: '1px',
    borderRadius: '4px'
};

export default MyListings;