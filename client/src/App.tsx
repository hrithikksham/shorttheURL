import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AnalyticsSearch from './pages/AnalyticsSearch'; // Import the new page

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* New Route for the Search Page */}
        <Route path="/analytics" element={<AnalyticsSearch />} />
        
        {/* Existing Route for the actual Stats Dashboard */}
        <Route path="/stats/:shortCode" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;