import React, { useState} from 'react';
import { Link2, ArrowRight, Copy, Check, Zap, Shield, BarChart3, AlertCircle } from 'lucide-react';
import apiClient from '../services/apiClient';

const Home = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setStatus('loading');
    setErrorMsg('');
    setShortUrl('');

    try {
      // 1. Make the Request
      console.log("Sending request to:", '/api/shorten', { originalUrl: url });
      const res = await apiClient.post('/api/shorten', { originalUrl: url });
      console.log("Server Response:", res.data);

      // 2. Extract the Code (Handle different backend variable names)
      const code = res.data.shortCode || res.data.code || res.data.id;
      if (!code) throw new Error('Server returned valid response but missing ID/ShortCode.');

      // 3. Construct Final URL
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const cleanBase = baseUrl.replace(/\/$/, ''); // Remove trailing slash if present
      const fullLink = `${cleanBase}/${code}`;

      // 4. Success Animation Delay (for effect)
      setTimeout(() => {
        setShortUrl(fullLink);
        setStatus('success');
      }, 500);

    } catch (err: any) {
      console.error("Shorten Error:", err);
      setStatus('error');
      
      // Better Error Message Extraction
      const msg = err.response?.data?.error 
        || err.message 
        || "Connection failed. Check if Backend is running.";
      setErrorMsg(msg);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setStatus('idle');
    setUrl('');
    setShortUrl('');
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden relative selection:bg-indigo-500/30 font-sans">
      
      {/* --- Dynamic Background --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-6 pt-40 pb-20 relative z-10 flex flex-col items-center text-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-indigo-400 mb-8 backdrop-blur-md shadow-lg shadow-indigo-500/10 hover:scale-105 transition-transform cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          V.1.0.0
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
            Make it 
          </span><span> </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Short !
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed font-light">
          Transform long, ugly links into powerful marketing assets. 
          Track, analyze, and optimize in real-time.
        </p>

        {/* --- THE CRAZY COMPONENT --- */}
        <div className="w-full max-w-xl relative group perspective-1000">
          
          {/* Glowing Aura */}
          <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl transition-opacity duration-500 ${status === 'idle' ? 'opacity-20 group-hover:opacity-40' : 'opacity-60'}`}></div>

          <div className="relative bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-2xl overflow-hidden min-h-[72px] flex flex-col justify-center transition-all duration-500">
            
            {/* Loading Scanner Beam */}
            {status === 'loading' && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-shimmer z-20"></div>
            )}

            {/* STATE 1: INPUT FORM */}
            {status !== 'success' && (
              <form onSubmit={handleSubmit} className={`flex items-center p-2 transition-all duration-300 ${status === 'loading' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="pl-4 text-zinc-500">
                  <Link2 className={`w-5 h-5 transition-colors ${url ? 'text-indigo-400' : ''}`} />
                </div>
                
                <input 
                  type="url" 
                  placeholder="Paste your long URL here..." 
                  className="w-full bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder-zinc-600 text-lg font-medium"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={status === 'loading'}
                  autoFocus
                />

                <button 
                  type="submit" 
                  disabled={!url || status === 'loading'}
                  className="hidden sm:flex px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold transition-all items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  {status === 'loading' ? 'Shortening...' : <><span className="hidden md:inline">Shorten</span> <ArrowRight className="w-4 h-4" /></>}
                </button>
                
                {/* Mobile Button (Icon Only) */}
                <button 
                  type="submit"
                  disabled={!url || status === 'loading'} 
                  className="sm:hidden p-3 bg-white text-black rounded-xl"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* STATE 2: SUCCESS RESULT (Morphs in) */}
            {status === 'success' && (
              <div className="flex items-center justify-between p-2 animate-in fade-in zoom-in duration-300">
                 <div className="pl-4 pr-2 flex-1 min-w-0">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Your Short Link</p>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400 font-mono text-lg truncate">{shortUrl}</span>
                    </div>
                 </div>

                 <div className="flex gap-2">
                   <button 
                    onClick={copyToClipboard}
                    className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${copied ? 'bg-green-500 text-black' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                   >
                     {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                     {copied ? 'Copied!' : 'Copy'}
                   </button>
                   
                   <button 
                    onClick={resetForm}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Shorten another"
                   >
                     <Zap className="w-4 h-4" />
                   </button>
                 </div>
              </div>
            )}
            
          </div>

          {/* Error Message Toast */}
          {status === 'error' && (
             <div className="absolute -bottom-16 left-0 right-0 flex justify-center animate-in slide-in-from-top-2 fade-in">
               <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl backdrop-blur-md">
                 <AlertCircle className="w-4 h-4" />
                 <span className="text-sm font-medium">{errorMsg}</span>
               </div>
             </div>
          )}
          
        </div>

        {/* --- FEATURES GRID --- */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl text-left">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Global edge network ensures your redirects are instant, anywhere in the world." },
            { icon: Shield, title: "Enterprise Secure", desc: "Bank-grade encryption with PostgreSQL storage and automated backups." },
            { icon: BarChart3, title: "Deep Analytics", desc: "Visualize traffic with our beautiful, real-time data dashboard." }
          ].map((feature, idx) => (
            <div key={idx} className="group p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-400">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-base text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Tailwind Config for the shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;