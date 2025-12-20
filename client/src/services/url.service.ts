// src/services/url.service.ts
import apiClient from './apiClient';
import type { ShortenRequest, ShortenResponse } from '../types/url.types';

export const UrlService = {
  /**
   * Sends POST request to shorten a URL
   */
  shorten: async (data: ShortenRequest): Promise<ShortenResponse> => {
    const response = await apiClient.post<ShortenResponse>('/api/shorten', data);
    return response.data;
  },

  /**
   * (Optional) Fetch analytics if you implement that endpoint later
   */
  getStats: async (shortCode: string) => {
    const response = await apiClient.get(`/api/analytics/${shortCode}`);
    return response.data;
  }
};