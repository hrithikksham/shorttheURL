import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link2, BarChart2, Github, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
          <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors border border-white/5">
            <Link2 className="w-5 h-5 text-blue-500" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Shortly</span>
        </Link>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Shorten
          </Link>
          <Link 
            to="/analytics" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/analytics') ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <BarChart2 className="w-4 h-4" />
            Analytics
          </Link>
          <a 
            href="https://github.com/hrithikksham" 
            target="_blank" 
            rel="noreferrer"
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

        {/* Mobile Menu Button (Visible only on Mobile) */}
        <button 
          className="md:hidden p-2 text-zinc-400 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#050505] border-b border-white/5 p-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className={`p-3 rounded-xl text-sm font-medium ${isActive('/') ? 'bg-white/10 text-white' : 'text-zinc-400'}`}
          >
            Shorten URL
          </Link>
          <Link 
            to="/analytics" 
            onClick={() => setIsOpen(false)}
            className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${isActive('/analytics') ? 'bg-white/10 text-white' : 'text-zinc-400'}`}
          >
            <BarChart2 className="w-4 h-4" />
            Analytics Dashboard
          </Link>
          <a 
            href="https://github.com/hrithikksham/shorttheurl" 
            target="_blank"
            className="p-3 rounded-xl flex items-center gap-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <Github className="w-4 h-4" />
            GitHub Profile
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;