import React, { useEffect, useState } from 'react';
import api from './api/axios'; // Import our bridge

function App() {
  const [shoes, setShoes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Try to fetch shoes from the Backend
    api.get('/api/shoes/')
      .then(response => {
        console.log("Data received:", response.data);
        setShoes(response.data);
      })
      .catch(err => {
        console.error("Error:", err);
        setError('Failed to connect to Django. Is it running?');
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Connection Test</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <h2>Shoes from Database:</h2>
      {shoes.length === 0 ? <p>No shoes found (or loading...)</p> : (
        <ul>
          {shoes.map(shoe => (
            <li key={shoe.id}>
              {shoe.title} - ${shoe.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;