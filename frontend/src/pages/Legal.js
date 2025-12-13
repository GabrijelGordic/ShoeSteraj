import React from 'react';

const Legal = () => {
    return (
        <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Lato' }}>
            <h1 style={{ fontFamily: 'Playfair Display' }}>Legal Information</h1>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            <hr />
            
            <h3>Terms of Service</h3>
            <p>By using Shoe Steraj, you agree to facilitate transactions lawfully. We are a venue for connecting buyers and sellers.</p>

            <h3>Privacy Policy</h3>
            <p>We collect standard user data (email, username) to provide marketplace services. We do not sell your data to third parties.</p>

            <h3>Cookie Policy</h3>
            <p>We use local storage tokens to manage your login session. We do not use tracking cookies for advertising.</p>
        </div>
    );
};
export default Legal;