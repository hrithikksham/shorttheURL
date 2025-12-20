import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar'; // We will create a simple one below

function App() {
  return (
    <BrowserRouter>
      {/* Navbar is outside Routes so it shows on every page */}
      <Navbar />
      
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Analytics Page (e.g., http://localhost:5173/stats/abc12) */}
        <Route path="/stats/:shortCode" element={<Dashboard />} />
        
        {/* Redirect unknown routes back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;