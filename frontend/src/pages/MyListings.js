import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyListings = () => {
    const { user } = useContext(AuthContext);
    const [shoes, setShoes] = useState([]);

    useEffect(() => {
        if (user) {
            // Fetch only shoes belonging to the current user
            api.get(`/api/shoes/?seller__username=${user.username}`)
                .then(res => setShoes(res.data))
                .catch(err => console.error("Error fetching listings:", err));
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                await api.delete(`/api/shoes/${id}/`);
                // Remove the deleted shoe from the state (UI)
                setShoes(shoes.filter(shoe => shoe.id !== id));
            } catch (error) {
                alert("Failed to delete. You might not be the owner.");
            }
        }
    };

    if (!user) return <div>Please login.</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px' }}>My Listings</h1>
            
            {shoes.length === 0 ? (
                <p>You haven't listed any shoes yet. <Link to="/sell">Sell one now!</Link></p>
            ) : (
                <div style={listStyle}>
                    {shoes.map(shoe => (
                        <div key={shoe.id} style={itemStyle}>
                            <img src={shoe.image} alt={shoe.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                            
                            <div style={{ flex: 1, marginLeft: '20px' }}>
                                <h3 style={{ margin: '0' }}>{shoe.title}</h3>
                                <p style={{ margin: '5px 0', color: '#666' }}>${shoe.price} | {shoe.brand}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link to={`/shoes/${shoe.id}`}>
                                    <button style={viewBtnStyle}>View</button>
                                </Link>
                                <button 
                                    onClick={() => handleDelete(shoe.id)} 
                                    style={deleteBtnStyle}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Styles
const listStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const itemStyle = { 
    display: 'flex', alignItems: 'center', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fff' 
};
const viewBtnStyle = { padding: '8px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const deleteBtnStyle = { padding: '8px 15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default MyListings;