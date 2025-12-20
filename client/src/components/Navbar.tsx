import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:opacity-80 transition">
        <Link2 className="w-6 h-6" />
        <span>Short.ly</span>
      </Link>
      
      <div className="flex gap-4">
        {/* Temporary link just for testing routing */}
        <Link to="/stats/test" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition">
          View Demo Stats
        </Link>
        <a 
          href="https://github.com/hrithiksham" 
          target="_blank" 
          rel="noreferrer"
          className="text-sm font-medium text-gray-900 hover:underline"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
};

export default Navbar;