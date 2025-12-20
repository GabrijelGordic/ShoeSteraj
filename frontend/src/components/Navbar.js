import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import AuthContext from '../context/AuthContext';
import logo from '../assets/šuzeraj_logo.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${searchTerm}`);
  };

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
    <nav style={{ ...styles.nav, ...getScrollStyles(scrolled) }}>
      
      {/* LOGO */}
      <Link to="/" style={styles.logoLink}>
          <img 
              src={logo} 
              alt="ShoeSteraj Logo" 
              className="logo-img"
              style={{ height: '90px', objectFit: 'contain'}} 
          />
      </Link>

      {/* SEARCH */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <div style={styles.inputWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b75784" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '15px'}}>
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

      {/* LINKS */}
      <div style={styles.links}>
        <Link to="/" className="nav-item">SHOP</Link>
        
        {user ? (
            <>
                <Link to="/sell" className="nav-item nav-sell">SELL</Link>
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button onClick={() => setShowDropdown(!showDropdown)} style={styles.userIconBtn}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>
                    {showDropdown && (
                        <div style={styles.dropdownMenu}>
                            <div style={styles.userInfo}>
                                <span style={{fontSize:'0.8rem', color:'#ffffffff'}}>Signed in as</span><br/>
                                <strong style={{color:'#b75784'}}>{user.username}</strong>
                            </div>
                            <Link to="/mylistings" className="menu-item" onClick={() => setShowDropdown(false)}>My Kicks</Link>
                            <Link to={`/seller/${user.username}`} className="menu-item" onClick={() => setShowDropdown(false)}>Public Profile</Link>
                            <Link to="/profile/edit" className="menu-item" onClick={() => setShowDropdown(false)}>Settings</Link>
                            <Link to="/wishlist" className="menu-item" onClick={() => setShowDropdown(false)}>My Wishlist</Link>
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

      <style>{`
        .nav-item { font-family: 'Lato', sans-serif; color: #ffffffff; text-decoration: none; font-size: 0.9rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 10px 15px; transition: color 0.2s ease; }
        .nav-item:hover { color: #b75784; }
        .nav-sell { border: 1px solid #b75784; padding: 8px 20px; margin-right: 15px; border-radius: 4px; }
        .nav-sell:hover { background-color: #b75784; color: #fff; }
        
        /* LOGO ANIMATION & CURSOR FIX */
        .logo-img { 
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: pointer; /* Force pointer on image */
        }
        .logo-img:hover { transform: scale(1.08) rotate(-3deg); }

        .menu-item { display: block; padding: 10px 15px; font-family: 'Lato', sans-serif; font-size: 0.9rem; color: white; text-decoration: none; cursor: pointer; transition: background 0.2s; border: none; background: none; width: 100%; text-align: left; box-sizing: border-box; }
        .menu-item:hover { background-color: #f5f5f5; }
        .logout-btn { color: #d32f2f; }
        .logout-btn:hover { background-color: #ffebee; }
      `}</style>
    </nav>
  );
};

// --- DYNAMIC SCROLL STYLES ---
const getScrollStyles = (scrolled) => {
    if (scrolled) {
        return {
            backgroundColor: 'rgba(22, 21, 21, 0.5)', 
            backdropFilter: 'blur(12px)',
            height: '90px',
            borderBottom: 'none',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        };
    } else {
        return {
            backgroundColor: 'rgba(22, 21, 21, 1)',
            height: '110px',
            borderBottom: 'none',
            backdropFilter: 'none',
            boxShadow: 'none',
        };
    }
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', padding: '0 40px', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, transition: 'all 0.4s ease' },
  
  // FIX: Added cursor pointer explicitly to the link container
  logoLink: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
  searchForm: { flex: 1, maxWidth: '500px', margin: '0 40px' },
  inputWrapper: { display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: '30px', padding: '5px' },
  searchInput: { flex: 1, padding: '12px', fontSize: '1rem', border: 'none', backgroundColor: 'transparent', outline: 'none', fontFamily: 'Lato' },
  links: { display: 'flex', alignItems: 'center'},
  userIconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b75784', transition: 'background 0.2s' },
  dropdownMenu: { position: 'absolute', top: '120%', right: 0, width: '200px', backgroundColor: 'rgb(22, 21, 21)', border: '1px solid #000000ff', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', padding: '10px 0', zIndex: 1001 },
  userInfo: { padding: '10px 15px', borderBottom: '1px solid #b75784', fontFamily: 'Lato' },
  divider: { height: '1px', backgroundColor: '#b75784', margin: '5px 0' }
};

export default Navbar;