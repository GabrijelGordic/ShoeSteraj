import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PublishShoe from './pages/PublishShoe';
import SellerProfile from './pages/SellerProfile';
import EditProfile from './pages/EditProfile';
import MyListings from './pages/MyListings';
import ShoeDetail from './pages/ShoeDetail'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sell" element={<PublishShoe />} />
          <Route path="/seller/:username" element={<SellerProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/mylistings" element={<MyListings />} />
        <Route path="/shoes/:id" element={<ShoeDetail />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;