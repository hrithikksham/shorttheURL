import React, { useState } from 'react';
import { useShorten } from '../hooks/useShorten';
import { Clipboard, ArrowRight, Loader2, Link as LinkIcon } from 'lucide-react';

const Home = () => {
  const [url, setUrl] = useState('');
  const { shortenUrl, result, loading, error } = useShorten();
  const [copied, setCopied] = useState(false);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    await shortenUrl(url);
    setCopied(false); // Reset copy status on new request
  };

  // Handle Copy to Clipboard
  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Header / Branding */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
            <LinkIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">URL Shortener</h1>
        <p className="text-gray-500">Paste your long link and make it short.</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Destination URL
            </label>
            <div className="relative">
              <input
                type="url"
                id="url"
                required
                placeholder="https://example.com/very-long-url..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !url}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Shortening...
              </>
            ) : (
              <>
                Shorten Now <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Success Result Area */}
        {result && !loading && (
          <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-green-800 mb-2 font-medium">Success! Here is your short link:</p>
            
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white border border-green-200 text-gray-800 px-3 py-2 rounded-md font-mono text-sm truncate">
                {result}
              </div>
              
              <button
                onClick={handleCopy}
                className={`p-2 rounded-md transition-colors ${
                  copied 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                title="Copy to clipboard"
              >
                {copied ? (
                  <span className="text-xs font-bold px-1">Copied!</span>
                ) : (
                  <Clipboard className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-sm text-gray-400">
        Built with React, Tailwind & Node.js
      </div>
    </div>
  );
};

export default Home;