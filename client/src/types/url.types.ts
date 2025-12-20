
// What we send to Backend
export interface ShortenRequest {
  longUrl: string;
  customAlias?: string;
}

// What Backend sends back
export interface ShortenResponse {
  shortUrl: string;
  shortCode?: string;
}

// Error shape
export interface ApiError {
  error: string;
  statusCode?: number;
}