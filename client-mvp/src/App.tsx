import { useState } from 'react';
import axios from 'axios';
import './App.css'; // Standard Vite CSS is fine

// ⚠️ CHANGE THIS to match your Backend URL
const API_BASE_URL = 'http://localhost:3000'; 

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    if (!longUrl) return;
    
    setLoading(true);
    setError('');
    setShortUrl(null);

    try {
      // Hitting the Backend API
      const response = await axios.post(`${API_BASE_URL}/api/shorten`, {
        longUrl: longUrl,
        // userId: 'test-user' // Optional: Hardcode if your backend requires auth for now
      });

      // Assuming backend returns { shortCode: "abc", shortUrl: "http://..." }
      setShortUrl(response.data.shortUrl); 
    } catch (err) {
      console.error(err);
      setError('Failed to shorten URL. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h1>🔗 Internal URL Shortener</h1>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '2rem 0' }}>
        <input 
          type="url" 
          placeholder="Paste long URL here..." 
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={{ padding: '10px', width: '70%', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleShorten} 
          disabled={loading}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shortUrl && (
        <div style={{ padding: '20px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
          <p>Success! Here is your short URL:</p>
          <a href={shortUrl} target="_blank" rel="noreferrer" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {shortUrl}
          </a>
          <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
            (Click to test the redirect)
          </p>
        </div>
      )}
    </div>
  );
}

export default App;