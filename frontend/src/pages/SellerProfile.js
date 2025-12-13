import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom'; // Added useLocation
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const SellerProfile = () => {
    const { username } = useParams();
    const { user } = useContext(AuthContext); 
    const location = useLocation(); // Hook to get navigation state
    
    const [profile, setProfile] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    // Grab success message if we were redirected here (e.g. from Edit Profile)
    const successMsg = location.state?.successMessage;

    const fetchProfile = () => {
        api.get(`/api/profiles/${username}/`)
            .then(res => {
                setProfile(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching profile", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line
    }, [username]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/reviews/', {
                seller: profile.user_id, 
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            setMessage('Review submitted successfully!');
            setReviewForm({ rating: 5, comment: '' }); 
            fetchProfile(); 
        } catch (error) {
            if (error.response && error.response.data.non_field_errors) {
                setMessage(error.response.data.non_field_errors[0]);
            } else {
                setMessage('Failed to submit review.');
            }
        }
    };

    if (loading) return <div style={centerMsg}>Loading Profile...</div>;
    if (!profile) return <div style={centerMsg}>User not found.</div>;

    return (
        <div style={containerStyle}>
            
            {/* --- SUCCESS MESSAGE (From Edit Profile) --- */}
            {successMsg && (
                <div style={successStyle}>
                    {successMsg}
                </div>
            )}

            {/* --- HEADER --- */}
            <div style={headerSection}>
                <img 
                    src={profile.avatar} 
                    alt={profile.username} 
                    style={avatarStyle}
                />
                <div style={{ textAlign: 'center' }}>
                    <h1 style={usernameStyle}>{profile.username}</h1>
                    <p style={locationStyle}>{profile.location || "Location hidden"}</p>
                    <div style={ratingBadge}>
                        ★ {profile.seller_rating} <span style={{ opacity: 0.6, fontWeight: 'normal' }}>({profile.review_count} REVIEWS)</span>
                    </div>
                </div>
            </div>

            <hr style={divider} />

            {/* --- REVIEW FORM --- */}
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={sectionTitle}>LEAVE A REVIEW</h3>
                
                {message && <div style={msgStyle}>{message}</div>}

                {user && user.username !== profile.username ? (
                    <form onSubmit={handleSubmitReview}>
                        <div style={groupStyle}>
                            <label style={labelStyle}>RATING</label>
                            <select 
                                value={reviewForm.rating} 
                                onChange={e => setReviewForm({...reviewForm, rating: e.target.value})}
                                style={selectStyle}
                            >
                                <option value="5">★★★★★ (Excellent)</option>
                                <option value="4">★★★★☆ (Good)</option>
                                <option value="3">★★★☆☆ (Average)</option>
                                <option value="2">★★☆☆☆ (Poor)</option>
                                <option value="1">★☆☆☆☆ (Terrible)</option>
                            </select>
                        </div>

                        <div style={groupStyle}>
                            <label style={labelStyle}>COMMENT</label>
                            <textarea 
                                placeholder="Describe your experience..." 
                                value={reviewForm.comment}
                                onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                                style={textareaStyle}
                                rows="3"
                                required
                            />
                        </div>

                        <button type="submit" style={buttonStyle}>
                            SUBMIT REVIEW
                        </button>
                    </form>
                ) : (
                    <div style={disabledBox}>
                        {user ? "You cannot review yourself." : <><Link to="/login" style={{color:'#000', fontWeight:'bold'}}>Login</Link> to leave a review.</>}
                    </div>
                )}
            </div>

            <hr style={divider} />

            {/* --- PAST REVIEWS --- */}
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 style={sectionTitle}>RECENT FEEDBACK</h3>
                
                {profile.reviews_list && profile.reviews_list.length > 0 ? (
                    <div>
                        {profile.reviews_list.map((rev, index) => (
                            <div key={index} style={reviewItem}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={reviewerName}>{rev.reviewer_username}</span>
                                    <span style={starsStyle}>{'★'.repeat(rev.rating)}</span>
                                </div>
                                <p style={commentStyle}>"{rev.comment}"</p>
                                <small style={dateStyle}>{new Date(rev.created_at).toLocaleDateString()}</small>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#999', textAlign: 'center', fontStyle: 'italic' }}>No reviews yet.</p>
                )}
            </div>

            <style>{`
                body { font-family: 'Lato', sans-serif; }
                textarea:focus, select:focus { border-bottom: 1px solid #000 !important; }
            `}</style>
        </div>
    );
};

// --- STYLES ---

const containerStyle = { maxWidth: '1000px', margin: '60px auto', padding: '0 20px' };
const centerMsg = { textAlign: 'center', marginTop: '100px', fontFamily: 'Lato', color: '#888' };

// NEW SUCCESS STYLE
const successStyle = {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '15px',
    marginBottom: '40px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    border: '1px solid #c8e6c9',
    textAlign: 'center',
    fontFamily: 'Lato',
    maxWidth: '600px',
    margin: '0 auto 40px'
};

const headerSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' };
const avatarStyle = { width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' };
const usernameStyle = { fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: '0 0 5px 0', color: '#111' };
const locationStyle = { fontFamily: '"Lato", sans-serif', color: '#999', fontSize: '0.9rem', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '1px' };
const ratingBadge = { fontFamily: '"Lato", sans-serif', fontWeight: 'bold', fontSize: '1.2rem', color: '#111' };
const divider = { border: 'none', borderTop: '1px solid #eee', margin: '50px 0' };
const sectionTitle = { fontFamily: '"Lato", sans-serif', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', color: '#999', textTransform: 'uppercase', textAlign: 'center', marginBottom: '40px' };
const groupStyle = { marginBottom: '30px' };
const labelStyle = { display: 'block', fontSize: '0.75rem', color: '#111', letterSpacing: '1px', marginBottom: '10px', fontWeight: '700' };
const selectStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', color: '#333', cursor: 'pointer' };
const textareaStyle = { width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '1rem', outline: 'none', fontFamily: '"Lato", sans-serif', backgroundColor: 'transparent', resize: 'none', color: '#333' };
const buttonStyle = { width: '100%', padding: '18px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer', marginTop: '10px', transition: 'opacity 0.2s' };
const msgStyle = { textAlign: 'center', padding: '15px', backgroundColor: '#f9f9f9', marginBottom: '20px', fontFamily: 'Lato', fontSize: '0.9rem' };
const disabledBox = { textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', color: '#888', fontFamily: 'Lato', fontStyle: 'italic' };
const reviewItem = { marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid #f5f5f5' };
const reviewerName = { fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: '#111' };
const starsStyle = { color: '#111', letterSpacing: '2px', fontSize: '0.9rem' };
const commentStyle = { fontFamily: '"Lato", sans-serif', fontSize: '1rem', color: '#555', lineHeight: '1.6', margin: '10px 0' };
const dateStyle = { fontFamily: '"Lato", sans-serif', fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase' };

export default SellerProfile;