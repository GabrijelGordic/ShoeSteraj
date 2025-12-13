import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom'; 

const MyListings = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation(); 
    
    const [shoes, setShoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || '');

    // --- MODAL STATE ---
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    useEffect(() => {
        if (user) {
            api.get(`/api/shoes/?seller__username=${user.username}&page_size=100`)
                .then(res => {
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

    // Clear message on update
    useEffect(() => {
        if (location.state?.successMessage) {
            setSuccessMsg(location.state.successMessage);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // --- HANDLERS ---

    // 1. Open the custom modal
    const openDeleteModal = (id) => {
        setDeleteModal({ show: true, id: id });
    };

    // 2. Close without doing anything
    const closeDeleteModal = () => {
        setDeleteModal({ show: false, id: null });
    };

    // 3. Actually Delete (Called from Modal)
    const confirmDelete = async () => {
        const id = deleteModal.id;
        try {
            await api.delete(`/api/shoes/${id}/`);
            setShoes(shoes.filter(shoe => shoe.id !== id));
            setSuccessMsg("Listing deleted successfully.");
            window.scrollTo(0, 0);
        } catch (error) {
            alert("Failed to delete. Please try again.");
        } finally {
            closeDeleteModal();
        }
    };

    if (!user) return <div style={centerMsg}>Please login to view your listings.</div>;
    if (loading) return <div style={centerMsg}>Loading your collection...</div>;

    return (
        <div style={containerStyle}>
            
            {/* --- HEADER --- */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={headingStyle}>My Collection</h1>
                <p style={subHeadingStyle}>Manage your active listings.</p>
            </div>

            {/* --- SUCCESS MESSAGE --- */}
            {successMsg && (
                <div style={successStyle}>
                    {successMsg}
                </div>
            )}

            {/* --- LISTINGS --- */}
            {shoes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <p style={{ fontFamily: 'Lato', color: '#666', marginBottom: '20px' }}>You haven't listed any kicks yet.</p>
                    <Link to="/sell" style={startSellingBtn}>START SELLING</Link>
                </div>
            ) : (
                <div style={{ borderTop: '1px solid #eee' }}>
                    {shoes.map(shoe => (
                        <div key={shoe.id} className="listing-row">
                            <img src={shoe.image} alt={shoe.title} className="listing-image" />
                            <div style={{ flex: 1, padding: '0 20px' }}>
                                <h3 style={titleStyle}>{shoe.title}</h3>
                                <p style={metaStyle}>{shoe.brand} | Size {shoe.size}</p>
                                <p style={priceStyle}>
                                    {shoe.currency === 'USD' ? '$' : shoe.currency === 'GBP' ? '£' : '€'}
                                    {shoe.price}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <Link to={`/shoes/${shoe.id}`} className="action-link view-link">VIEW</Link>
                                {/* Trigger the Modal instead of window.confirm */}
                                <button 
                                    onClick={() => openDeleteModal(shoe.id)} 
                                    className="action-btn delete-btn"
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- CUSTOM MODAL OVERLAY --- */}
            {deleteModal.show && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <h2 style={modalHeading}>Confirm Removal</h2>
                        <p style={modalText}>
                            Are you sure you want to delete this listing?<br/>
                            This action cannot be undone.
                        </p>
                        <div style={modalActions}>
                            <button onClick={closeDeleteModal} style={modalCancelBtn}>
                                KEEP IT
                            </button>
                            <button onClick={confirmDelete} style={modalConfirmBtn}>
                                YES, DELETE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CSS STYLES --- */}
            <style>{`
                .listing-row { display: flex; align-items: center; padding: 20px 0; border-bottom: 1px solid #eee; transition: background-color 0.2s ease; }
                .listing-row:hover { background-color: #fcfcfc; }
                .listing-image { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; background-color: #f0f0f0; }
                .action-link, .action-btn { font-family: 'Lato', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-decoration: none; cursor: pointer; transition: all 0.2s; border: none; background: none; }
                .view-link { color: #111; border: 1px solid #ccc; padding: 8px 15px; }
                .view-link:hover { border-color: #000; background-color: #000; color: #fff; }
                .delete-btn { color: #999; padding: 8px 15px; }
                .delete-btn:hover { color: #d32f2f; background-color: #ffebee; border-radius: 4px; }
            `}</style>
        </div>
    );
};

// --- JS STYLES ---

const containerStyle = { maxWidth: '900px', margin: '60px auto', padding: '0 20px' };
const centerMsg = { textAlign: 'center', marginTop: '100px', fontFamily: 'Lato', color: '#888' };
const headingStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 10px 0', color: '#111', fontWeight: '400' };
const subHeadingStyle = { fontFamily: '"Lato", sans-serif', color: '#888', fontSize: '0.9rem', margin: 0 };

const successStyle = { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '15px', marginBottom: '30px', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid #c8e6c9', textAlign: 'center', fontFamily: 'Lato', maxWidth: '600px', margin: '0 auto 30px' };

const titleStyle = { fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', margin: '0 0 5px 0', color: '#111' };
const metaStyle = { fontFamily: '"Lato", sans-serif', fontSize: '0.85rem', color: '#888', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' };
const priceStyle = { fontFamily: '"Lato", sans-serif', fontSize: '1rem', color: '#2e7d32', margin: 0, fontWeight: '700' };
const startSellingBtn = { display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '12px 25px', textDecoration: 'none', fontFamily: 'Lato', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px', borderRadius: '4px' };

// --- MODAL STYLES ---
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark dimming
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(3px)' // Optional blur effect
};

const modalBoxStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '0px', // Sharp corners for luxury feel
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    border: '1px solid #f0f0f0'
};

const modalHeading = {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.8rem',
    margin: '0 0 15px 0',
    color: '#111'
};

const modalText = {
    fontFamily: '"Lato", sans-serif',
    fontSize: '0.95rem',
    color: '#666',
    margin: '0 0 30px 0',
    lineHeight: '1.6'
};

const modalActions = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px'
};

const modalCancelBtn = {
    padding: '12px 25px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    color: '#333',
    fontFamily: '"Lato", sans-serif',
    fontWeight: '700',
    letterSpacing: '1px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const modalConfirmBtn = {
    padding: '12px 25px',
    backgroundColor: '#111',
    border: '1px solid #111',
    color: '#fff',
    fontFamily: '"Lato", sans-serif',
    fontWeight: '700',
    letterSpacing: '1px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
};

export default MyListings;