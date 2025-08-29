import { ApiResponse } from '../types';

// Minimal API client used by the app
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: globalThis.RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: globalThis.RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} on ${endpoint}`);
    }
    return response.json();
  }

  // Voices
  async getVoices(): Promise<ApiResponse> {
    return this.request('/voices');
  }
}

export default new ApiService();
