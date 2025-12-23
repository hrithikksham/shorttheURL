import React, { useState } from 'react';
import { useShorten } from '../hooks/useShorten';
import { Clipboard, ArrowRight, Loader2, Sparkles, Check } from 'lucide-react';

const Home = () => {
  const [url, setUrl] = useState('');
  const { shortenUrl, result, loading, error } = useShorten();
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    await shortenUrl(url);
    setCopied(false);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide uppercase">
            <Sparkles className="w-3 h-3" />
            Professional Url Shortener
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tight">
            Make it short.
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
            Transform long, ugly links into secure, trackable short URLs with a single click.
          </p>
        </div>

        {/* Glass Card */}
        <div className="w-full glass-panel p-8 rounded-3xl shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium text-zinc-300 ml-1">
                Destination URL
              </label>
              <div className="relative group">
                <input
                  type="url"
                  id="url"
                  required
                  placeholder="https://example.com/very-long-url..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full glass-input px-5 py-4 rounded-2xl text-white placeholder-zinc-600 text-lg focus:ring-0"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full relative group overflow-hidden rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Shorten Link</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Result */}
          {result && !loading && (
            <div className="mt-8 pt-8 border-t border-white/10 animate-[fadeIn_0.5s_ease-out]">
              <p className="text-zinc-400 text-sm mb-3 ml-1">Your shortened link is ready:</p>
              
              <div className="flex items-center gap-3 p-2 bg-zinc-900/50 border border-white/5 rounded-2xl pr-2">
                <div className="flex-1 px-4 font-mono text-blue-400 text-sm truncate">
                  {result}
                </div>
                
                <button
                  onClick={handleCopy}
                  className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium text-sm ${
                    copied 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;