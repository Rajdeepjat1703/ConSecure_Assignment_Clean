import axios from 'axios';
import { Threat, ThreatStats, ThreatsResponse, ThreatFilters } from '../types/threat';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const threatApi = {
  // Get all threats with pagination and filtering
  getThreats: async (filters: ThreatFilters = {}): Promise<ThreatsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.category && Array.isArray(filters.category) && filters.category.length > 0) params.append('category', filters.category.join(','));
    if (filters.search) params.append('search', filters.search);
    
    const response = await api.get(`/threats?${params.toString()}`);
    return response.data;
  },

  // Get a single threat by ID
  getThreatById: async (id: number): Promise<Threat> => {
    const response = await api.get(`/threats/${id}`);
    return response.data;
  },

  // Get threat statistics
  getThreatStats: async (): Promise<ThreatStats> => {
    const response = await api.get('/threats/stats');
    return response.data;
  },

  // Get all categories
  getAllCategories: async (): Promise<string[]> => {
    const response = await api.get('/threats/categories');
    return response.data;
  },
};

export default api; 