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
    <div style={{...styles.container, display:'flex', justifyContent:'center', alignItems:'center'}}>
        <p style={{fontFamily: 'Lato', fontWeight:'bold', fontSize:'1.2rem'}}>CHECKING FAVORITES...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Wishlist</h1>
        <p style={styles.subtitle}>SAVED FOR LATER.</p>
      </div>

      {shoes.length === 0 ? (
        <div style={styles.emptyState}>
            <h3 style={{fontFamily: '"Bebas Neue", sans-serif', fontSize:'2.5rem', marginBottom:'20px'}}>
                NO FAVORITES YET.
            </h3>
            <Link to="/" style={styles.shopBtn}>BROWSE KICKS</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {shoes.map((shoe) => (
            <Link to={`/shoes/${shoe.id}`} key={shoe.id} style={{textDecoration:'none'}}>
                <div style={styles.card}>
                    <div style={styles.imageContainer}>
                        <img src={shoe.image} alt={shoe.title} style={styles.image} />
                    </div>
                    <div style={styles.info}>
                        <p style={styles.brand}>{shoe.brand}</p>
                        <h3 style={styles.cardTitle}>{shoe.title}</h3>
                        <p style={styles.price}>{getCurrencySymbol(shoe.currency)}{shoe.price}</p>
                    </div>
                </div>
            </Link>
          ))}
        </div>
      )}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); body { font-family: 'Lato', sans-serif; }`}</style>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { padding: '60px 40px', backgroundColor: '#b1b1b1ff', minHeight: '100vh' },
  header: { textAlign: 'center', marginBottom: '60px' },
  title: { fontFamily: '"Bebas Neue", sans-serif', fontSize: '4rem', margin: '0 0 10px 0', color: '#111', lineHeight: '0.9' },
  subtitle: { fontFamily: 'Lato', color: 'rgba(194, 84, 141)', fontSize: '1rem', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '50px 40px' },
  card: { backgroundColor: 'transparent', cursor: 'pointer', transition: 'transform 0.2s' },
  imageContainer: { overflow: 'hidden', backgroundColor: '#fff', aspectRatio: '1 / 1.1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' },
  image: { width: '100%', height: '100%', objectFit: 'contain', padding: '10px' },
  info: { textAlign: 'center' },
  brand: { margin: '0 0 5px', color: '#555', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', fontFamily: 'Lato' },
  cardTitle: { margin: '0 0 10px', fontFamily: '"Lato", sans-serif', fontSize: '1.2rem', fontWeight: '900', color: '#111', textTransform: 'uppercase' },
  price: { margin: '0 0 15px 0', fontFamily: '"Lato", sans-serif', fontSize: '1.1rem', fontWeight: 'bold', color: '#333' },
  emptyState: { textAlign: 'center', padding: '100px 0' },
  shopBtn: { display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '15px 35px', textDecoration: 'none', fontFamily: 'Lato', fontWeight: '900', letterSpacing: '2px' }
};

export default Wishlist;