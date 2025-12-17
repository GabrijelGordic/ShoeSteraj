import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import AuthContext from '../context/AuthContext';
import logo from '../assets/ŠuzerajLogoBlackBox.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Removed page_size from here, let Home.js handle the default
    navigate(`/?search=${searchTerm}`);
  };

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <nav style={styles.nav}>
      
      {/* --- 1. LOGO --- */}
      <Link to="/" style={styles.logoLink}>
          <img 
              src={logo} 
              alt="ShoeSteraj Logo" 
              style={{ height: '90px', objectFit: 'contain' }} 
          />
      </Link>

      {/* --- 2. SEARCH BAR (Cleaner) --- */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <div style={styles.inputWrapper}>
            {/* Search Icon SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '15px'}}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
                type="text" 
                placeholder="Search for kicks..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />
        </div>
      </form>

      {/* --- 3. LINKS & ACTIONS --- */}
      <div style={styles.links}>
        <Link to="/" className="nav-item">SHOP</Link>
        
        {user ? (
            <>
                <Link to="/sell" className="nav-item nav-sell">SELL</Link>
                
                {/* USER DROPDOWN */}
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)} 
                        style={styles.userIconBtn}
                    >
                        {/* User Icon SVG */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>

                    {/* The Dropdown Menu */}
                    {showDropdown && (
                        <div style={styles.dropdownMenu}>
                            <div style={styles.userInfo}>
                                <span style={{fontSize:'0.8rem', color:'#999'}}>Signed in as</span>
                                <br/>
                                <strong>{user.username}</strong>
                            </div>
                            <div style={styles.divider}></div>
                            <Link to="/mylistings" className="menu-item" onClick={() => setShowDropdown(false)}>My Kicks</Link>
                            <Link to={`/seller/${user.username}`} className="menu-item" onClick={() => setShowDropdown(false)}>Public Profile</Link>
                            <Link to="/profile/edit" className="menu-item" onClick={() => setShowDropdown(false)}>Settings</Link>
                            <div style={styles.divider}></div>
                            <button onClick={handleLogout} className="menu-item logout-btn">Log Out</button>
                        </div>
                    )}
                </div>
            </>
        ) : (
            <>
                <Link to="/login" className="nav-item">LOGIN</Link>
                <Link to="/register" className="nav-item">JOIN</Link>
            </>
        )}
      </div>

      {/* --- CSS --- */}
      <style>{`
        .nav-item {
            font-family: 'Lato', sans-serif;
            color: #333;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 10px 15px;
            transition: color 0.2s ease;
        }
        .nav-item:hover { color: #000; }
        
        .nav-sell { 
            border: 1px solid #000; 
            padding: 8px 20px; 
            margin-right: 15px; 
            border-radius: 4px;
        }
        .nav-sell:hover { background-color: #000; color: #fff; }

        /* Dropdown Items */
        .menu-item {
            display: block;
            padding: 10px 15px;
            font-family: 'Lato', sans-serif;
            font-size: 0.9rem;
            color: #333;
            text-decoration: none;
            cursor: pointer;
            transition: background 0.2s;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            box-sizing: border-box;
        }
        .menu-item:hover { background-color: #f5f5f5; }
        .logout-btn { color: #d32f2f; }
        .logout-btn:hover { background-color: #ffebee; }
      `}</style>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 40px', 
    height: '110px', // Fixed height for consistency
    backgroundColor: '#b1b1b1ff',
    alignItems: 'center',
    borderBottom: '2px solid grey',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logoLink: { display: 'flex', alignItems: 'center' },
  
  // Cleaner Search
  searchForm: {
      flex: 1,
      maxWidth: '500px', 
      margin: '0 40px',  
  },
  inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f5f5f5', // Light grey background like Nike/Apple
      borderRadius: '30px', // Rounded pill shape
      padding: '5px',
  },
  searchInput: {
      flex: 1,
      padding: '12px', 
      fontSize: '1rem',
      border: 'none',
      backgroundColor: 'transparent',
      outline: 'none',
      fontFamily: 'Lato',
  },

  links: { display: 'flex', alignItems: 'center' },

  // User Icon Button
  userIconBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#333',
      transition: 'background 0.2s',
  },

  // The Dropdown Box
  dropdownMenu: {
      position: 'absolute',
      top: '120%',
      right: 0,
      width: '200px',
      backgroundColor: '#fff',
      border: '1px solid #eee',
      borderRadius: '8px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      padding: '10px 0',
      zIndex: 1001,
  },
  userInfo: {
      padding: '10px 15px',
      borderBottom: '1px solid #eee',
      fontFamily: 'Lato',
  },
  divider: {
      height: '1px',
      backgroundColor: '#eee',
      margin: '5px 0',
  }
};

export default Navbar;