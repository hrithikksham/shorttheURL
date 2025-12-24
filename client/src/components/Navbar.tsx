import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link2, BarChart2, Github, Menu, X, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 1. Floating Island Container */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto md:min-w-[500px] max-w-2xl transition-all duration-300 ease-out`}>
        
        {/* The Glassy Pill */}
        <div className={`
          relative flex items-center justify-between pl-4 pr-4 h-14 md:h-16
          rounded-full border border-white/10 shadow-2xl shadow-black/50
          backdrop-blur-xl bg-[#050505]/60 supports-[backdrop-filter]:bg-[#050505]/40
          transition-all duration-300
          ${isOpen ? 'bg-[#050505]/90' : ''}
        `}>

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group mr-8">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm md:text-base tracking-tight text-white/90 group-hover:text-white transition-colors">
              Shortly
            </span>
          </Link>

          {/* Desktop Links (Center Aligned) */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            <Link 
              to="/" 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Shorten
            </Link>
            <Link 
              to="/analytics" 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isActive('/analytics') 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Analytics
            </Link>
          </div>

          {/* Right Action / Mobile Toggle */}
          <div className="flex items-center gap-3 md:ml-8">
            <a 
              href="https://github.com/hrithikksham" 
              target="_blank" 
              rel="noreferrer"
              className="hidden md:flex p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <Github className="w-5 h-5" />
            </a>

            {/* Mobile Hamburger (Apple Style Button) */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-white active:scale-95 transition-all bg-white/5 rounded-full border border-white/5"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 2. Mobile Menu Dropdown (Floating Bubble) */}
        <div className={`
          absolute top-full left-0 right-0 mt-2 p-2 mx-2
          bg-[#111]/90 backdrop-blur-2xl border border-white/10 rounded-3xl
          shadow-2xl overflow-hidden origin-top transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-4 invisible'}
        `}>
          <div className="flex flex-col gap-1">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                isActive('/') ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>

            <Link 
              to="/analytics" 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                isActive('/analytics') ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span className="text-sm font-medium">Analytics</span>
            </Link>

            <a 
              href="https://github.com/hrithikksham"
              target="_blank"
              className="flex items-center gap-3 p-3 rounded-2xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm font-medium">Star on GitHub</span>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;