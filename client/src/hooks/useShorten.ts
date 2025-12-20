// src/hooks/useShorten.ts
import { useState } from 'react';
import { UrlService } from '../services/url.service';
import axios from 'axios';

export const useShorten = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const shortenUrl = async (longUrl: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await UrlService.shorten({ longUrl });
      setResult(data.shortUrl);
      return data;
    } catch (err: any) {
      // Extract nice error message from Backend response
      const message = axios.isAxiosError(err) && err.response?.data?.error
        ? err.response.data.error 
        : 'Failed to shorten URL';
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { shortenUrl, result, loading, error };
};