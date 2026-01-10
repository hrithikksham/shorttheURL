import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import apiClient from './services/apiClient';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AnalyticsSearch from './pages/AnalyticsSearch'; // Import the new page

function App() {

    useEffect(() => {
    const wakeUpServer = async () => {
      try {
        console.log('Pinging server to wake it up...');
        await apiClient.get('/health');
        console.log('Server is awake and ready!');
      } catch (error) {
        console.log('Server wake-up signal sent.');
      }
    };

    wakeUpServer();
  }, []);

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