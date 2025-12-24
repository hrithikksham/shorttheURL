import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Search, ArrowRight } from 'lucide-react';

const AnalyticsSearch = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    const cleanInput = input.trim().replace(/\/$/, '');
    const code = cleanInput.split('/').pop();
    if (code) navigate(`/stats/${code}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 text-center">
        
        <div className="mb-8 flex justify-center">
            <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
                <BarChart2 className="w-8 h-8" />
            </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Track Your Link</h1>
        <p className="text-zinc-400 text-base md:text-lg mb-10">
          Paste your short URL to see real-time clicks and data.
        </p>

        <div className="glass-panel p-2 rounded-2xl flex items-center shadow-2xl shadow-black/50 w-full">
          <div className="pl-4 text-zinc-500 hidden sm:block">
            <Search className="w-5 h-5" />
          </div>
          <form onSubmit={handleSearch} className="flex-1 flex gap-2 sm:gap-0">
            <input 
              type="text" 
              placeholder="Enter your short URL here" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder-zinc-600 text-base"
            />
            <button 
              type="submit"
              className="m-1 px-4 sm:px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <span>View</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsSearch;