import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- CONTEXT (Global State) ---
import { AuthProvider } from './context/AuthContext';
import Wishlist from './pages/Wishlist';
// --- COMPONENTS (Layouts) ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- PAGES: AUTHENTICATION ---
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';

// --- PAGES: MARKETPLACE (Public) ---
import Home from './pages/Home';
import ShoeDetail from './pages/ShoeDetail';
import SellerProfile from './pages/SellerProfile';

// --- PAGES: USER DASHBOARD (Private) ---
import PublishShoe from './pages/PublishShoe';
import MyListings from './pages/MyListings';
import EditProfile from './pages/EditProfile';

// --- PAGES: SYSTEM / LEGAL ---
import Legal from './pages/Legal';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1 }}>
                <Routes>
                    {/* 1. MARKETPLACE ROUTES */}
                    <Route path="/" element={<Home />} />
                    <Route path="/shoes/:id" element={<ShoeDetail />} />
                    <Route path="/seller/:username" element={<SellerProfile />} />

                    {/* 2. AUTHENTICATION ROUTES */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/password-reset/confirm/:uid/:token" element={<ResetPasswordConfirm />} />
                    <Route path="/wishlist" element={<Wishlist />} />

                    {/* 3. USER DASHBOARD ROUTES */}
                    <Route path="/sell" element={<PublishShoe />} />
                    <Route path="/mylistings" element={<MyListings />} />
                    
                    {/* --- FIX: Changed path from '/profile/edit' to '/edit-profile' --- */}
                    <Route path="/edit-profile" element={<EditProfile />} />

                    {/* 4. SYSTEM ROUTES */}
                    <Route path="/legal" element={<Legal />} />
                </Routes>
            </div>
            <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;