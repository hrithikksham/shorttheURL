import React, { useState } from 'react';
import { Link2, ArrowRight, Copy, Check, Zap, Shield, BarChart3, Loader2 } from 'lucide-react';
import apiClient from '../services/apiClient';

const Home = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await apiClient.post('/api/shorten', { originalUrl: url });
      // Construct full URL (use VITE_API_URL or fallback)
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      // Remove trailing slash if present in base, then append shortCode
      const cleanBase = baseUrl.replace(/\/$/, ''); 
      setShortUrl(`${cleanBase}/${res.data.shortCode}`);
    } catch (err) {
      setError('Failed to shorten link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-blue-500/30">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none opacity-30" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          v1.0 Now Live
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
          Shorten links, <br className="hidden md:block" /> 
          <span className="text-white">expand reach.</span>
        </h1>

        <p className="text-base md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
          A powerful URL shortener built for modern creators. 
          Track clicks, analyze locations, and optimize your sharing workflow.
        </p>

        {/* Input Box - Responsive Layout */}
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex flex-col sm:flex-row items-center gap-2 bg-[#0A0A0A] p-2 rounded-2xl border border-white/10 shadow-2xl">
              <div className="pl-4 text-zinc-500 hidden sm:block">
                <Link2 className="w-5 h-5" />
              </div>
              <input 
                type="url" 
                placeholder="Paste your long link here..." 
                className="w-full bg-transparent border-none text-white px-4 py-3 sm:py-4 focus:ring-0 placeholder-zinc-600 text-base"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 sm:py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Shorten <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && <p className="text-red-400 text-sm mt-3 text-left pl-2">{error}</p>}

          {/* Result Card */}
          {shortUrl && (
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
              <span className="text-blue-400 font-medium truncate max-w-full sm:max-w-xs">{shortUrl}</span>
              <button 
                onClick={copyToClipboard}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Features Grid - 1 col Mobile, 3 col Desktop */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl text-left">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Redirects happen in milliseconds using Redis caching." },
            { icon: Shield, title: "Secure & Reliable", desc: "Built with PostgreSQL and heavily tested for uptime." },
            { icon: BarChart3, title: "Deep Analytics", desc: "Track clicks, browsers, and device types in real-time." }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4 text-zinc-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;