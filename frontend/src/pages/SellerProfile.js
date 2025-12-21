import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const SellerProfile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext); 
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/profiles/${username}/`)
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, [username]);

  const getAvatarContent = () => {
      if (!profile) return null;
      const isDefault = profile.avatar && profile.avatar.includes('default.jpg');
      if (profile.avatar && !isDefault) {
          return <img src={profile.avatar} alt={profile.username} style={avatarImgStyle} />;
      }
      return (
          <div style={avatarPlaceholderStyle}>
              {profile.username.charAt(0).toUpperCase()}
          </div>
      );
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'80vh' }}>LOADING...</div>;
  if (!profile) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'80vh' }}>USER NOT FOUND.</div>;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '60px 20px' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={headerStyle}>
            <div style={{ marginRight: '30px' }}>{getAvatarContent()}</div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={usernameStyle}>{profile.username}</h1>
                        <div style={metaRow}>
                            {profile.location && <span style={locationStyle}>📍 {profile.location}</span>}
                            {profile.is_verified && <span style={verifiedBadge}>VERIFIED SELLER</span>}
                        </div>
                    </div>
                    
                    {/* EDIT BUTTON */}
                    {user && user.username === profile.username && (
                        <Link to="/edit-profile" style={editBtnStyle}>EDIT PROFILE</Link>
                    )}
                </div>
                {profile.bio && <p style={bioStyle}>"{profile.bio}"</p>}
                
                <div style={statsRow}>
                    <div style={statItem}>
                        <span style={statValue}>★ {profile.seller_rating || 0}</span>
                        <span style={statLabel}>RATING</span>
                    </div>
                    <div style={statItem}>
                        <span style={statValue}>{profile.review_count || 0}</span>
                        <span style={statLabel}>REVIEWS</span>
                    </div>
                </div>
            </div>
        </div>

        <div style={divider}></div>

        {/* --- REVIEWS SECTION --- */}
        <h2 style={sectionTitle}>REVIEWS ({profile.review_count || 0})</h2>

        {profile.reviews_list && profile.reviews_list.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {profile.reviews_list.map((review, index) => (
                    <div key={index} style={reviewCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <strong style={{ fontSize: '1rem' }}>@{review.reviewer_username}</strong>
                            <span style={{ color: '#888', fontSize: '0.8rem' }}>
                                {new Date(review.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div style={{ marginBottom: '5px', color: '#ffb400' }}>
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <p style={{ margin: 0, color: '#555', fontStyle: 'italic' }}>
                            "{review.comment}"
                        </p>
                    </div>
                ))}
            </div>
        ) : (
            <p style={{ fontStyle:'italic', color:'#888' }}>No reviews yet.</p>
        )}

      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        body { font-family: 'Lato', sans-serif; }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const headerStyle = { display: 'flex', alignItems: 'center', marginBottom: '40px' };
const avatarImgStyle = { width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #b75784', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' };
const avatarPlaceholderStyle = { width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#b75784', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', fontWeight: 'bold', border: '4px solid #fff', fontFamily: '"Bebas Neue", sans-serif', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' };
const usernameStyle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '3rem', margin: '0 0 5px 0', lineHeight: '0.9', color: '#111' };
const metaRow = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' };
const locationStyle = { fontSize: '0.9rem', color: '#666', fontWeight: 'bold' };
const verifiedBadge = { backgroundColor: '#e0f2f1', color: '#00695c', fontSize: '0.7rem', padding: '4px 8px', fontWeight: 'bold', letterSpacing: '1px' };
const bioStyle = { fontStyle: 'italic', color: '#555', marginBottom: '20px', borderLeft: '3px solid #eee', paddingLeft: '15px' };
const statsRow = { display: 'flex', gap: '40px' };
const statItem = { display: 'flex', flexDirection: 'column' };
const statValue = { fontSize: '1.5rem', fontWeight: '900', color: '#111' };
const statLabel = { fontSize: '0.75rem', color: '#888', fontWeight: 'bold', letterSpacing: '1px' };
const editBtnStyle = { textDecoration: 'none', backgroundColor: '#f5f5f5', color: '#111', padding: '10px 20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', transition: 'background 0.2s' };
const divider = { height: '1px', backgroundColor: '#eee', margin: '40px 0' };
const sectionTitle = { fontFamily: '"Bebas Neue", sans-serif', fontSize: '2rem', marginBottom: '20px' };

const reviewCard = {
    backgroundColor: '#fafafa',
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '4px'
};

export default SellerProfile;