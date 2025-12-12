import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={styles.nav}>
      
      {/* --- LOGO SECTION --- */}
      <div style={styles.logoContainer}>
        <Link to="/" style={styles.logoLink}>
            <span style={{ fontWeight: '900' }}>SHOE</span>
            <span style={{ fontWeight: '400' }}>STERAJ</span>
        </Link>
      </div>

      {/* --- LINKS SECTION --- */}
      <div style={styles.links}>
        <Link to="/" className="nav-item">SHOP</Link>
        
        {user ? (
            <>
                <Link to="/sell" className="nav-item nav-sell">SELL</Link>
                <Link to="/mylistings" className="nav-item">MY KICKS</Link>
                <Link to="/profile/edit" className="nav-item">SETTINGS</Link>
                <button onClick={logout} className="nav-item nav-logout">LOGOUT</button>
            </>
        ) : (
            <>
                <Link to="/login" className="nav-item">LOGIN</Link>
                <Link to="/register" className="nav-item">JOIN</Link>
            </>
        )}
      </div>

      {/* --- CSS FOR HOVER EFFECTS --- */}
      <style>{`
        /* Base Link Style */
        .nav-item {
            font-family: 'Lato', sans-serif;
            color: #333;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 10px 16px; /* Space for the background color */
            border-radius: 4px; /* Soft corners */
            transition: all 0.2s ease;
            background-color: transparent;
            border: none;
            cursor: pointer;
        }

        /* 1. Standard Hover: Light Darkening */
        .nav-item:hover {
            background-color: #f0f0f0; /* Light Grey Wash */
            color: #000;
        }

        /* 2. Sell Button Special Style */
        .nav-sell {
            border: 1px solid #000;
            margin-right: 5px;
        }
        /* Sell Hover: Invert to Black */
        .nav-sell:hover {
            background-color: #000;
            color: #fff;
        }

        /* 3. Logout Special Style */
        .nav-logout {
            color: #666;
        }
        /* Logout Hover: Warning Red Background */
        .nav-logout:hover {
            background-color: #ffebee;
            color: #d32f2f;
        }
      `}</style>
    </nav>
  );
};

// --- STATIC STYLES (Layout Only) ---
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px 40px',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logoLink: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '2rem',
    color: '#000',
    textDecoration: 'none',
    letterSpacing: '0px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center'
  },
  links: {
    display: 'flex',
    gap: '10px', // Reduced gap because padding adds space now
    alignItems: 'center',
  }
};

export default Navbar;