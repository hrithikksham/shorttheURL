import { Link, useLocation } from 'react-router-dom';
import { Link2, BarChart2, Github } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="glass-panel rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl shadow-black/50">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
            <Link2 className="w-5 h-5 text-blue-500" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">Short.ly</span>
        </Link>
        
        {/* Divider */}
        <div className="h-4 w-[1px] bg-white/10"></div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Create
          </Link>
          
          {/* We point to a demo stat for the link, or just disable if no ID */}
          <Link 
            to="/analytics" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              location.pathname.includes('/analytics') ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              >
                <BarChart2 className="w-4 h-4" />
                Analytics
              </Link>
        </div>

        {/* GitHub Icon */}
        <a 
          href="https://github.com/hrithikksham/shorttheURL" 
          target="_blank" 
          rel="noreferrer"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>

      </nav>
    </div>
  );
};

export default Navbar;