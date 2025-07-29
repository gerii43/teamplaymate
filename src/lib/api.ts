import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('statsor_user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    Promise.resolve().then(() => fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())),
  
  login: (data: { email: string; password: string }) =>
    Promise.resolve().then(() => fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())),
  
  googleAuth: () => {
    const googleClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      throw new Error('Google OAuth not configured');
    }
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `access_type=offline`;
    window.location.href = googleAuthUrl;
  },
  
  verifyGoogleToken: (token: string) =>
    Promise.resolve().then(() => fetch('/api/auth/google/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    }).then(res => res.json())),
  
  verifyEmail: (token: string) =>
    Promise.resolve().then(() => fetch(`/api/auth/verify-email?token=${token}`).then(res => res.json())),
  
  updateSportPreference: (sport: 'soccer' | 'futsal') =>
    Promise.resolve().then(() => fetch('/api/auth/sport-preference', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({ sport })
    }).then(res => res.json())),
  
  logout: () => Promise.resolve().then(() => fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    }
  }).then(res => res.json()))
};

// Teams API
export const teamsAPI = {
  getTeams: () => api.get('/teams'),
  createTeam: (data: any) => api.post('/teams', data),
  updateTeam: (id: string, data: any) => api.put(`/teams/${id}`, data),
  deleteTeam: (id: string) => api.delete(`/teams/${id}`)
};

// Players API
export const playersAPI = {
  getPlayers: (teamId?: string) => api.get(`/players${teamId ? `?teamId=${teamId}` : ''}`),
  createPlayer: (data: any) => api.post('/players', data),
  updatePlayer: (id: string, data: any) => api.put(`/players/${id}`, data),
  deletePlayer: (id: string) => api.delete(`/players/${id}`),
  uploadPhoto: (playerId: string, formData: FormData) =>
    api.post(`/players/${playerId}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

// Matches API
export const matchesAPI = {
  getMatches: () => api.get('/matches'),
  createMatch: (data: any) => api.post('/matches', data),
  updateMatch: (id: string, data: any) => api.put(`/matches/${id}`, data),
  deleteMatch: (id: string) => api.delete(`/matches/${id}`),
  addMatchEvent: (matchId: string, event: any) => api.post(`/matches/${matchId}/events`, event),
  addMatchNote: (matchId: string, note: any) => api.post(`/matches/${matchId}/notes`, note),
  getMatchNotes: (matchId: string) => api.get(`/matches/${matchId}/notes`)
};

// Analytics API
export const analyticsAPI = {
  getTeamAnalytics: (teamId: string, filters?: any) =>
    api.post(`/analytics/team/${teamId}`, { filters }),
  
  getPlayerAnalytics: (playerId: string, filters?: any) =>
    api.post(`/analytics/player/${playerId}`, { filters }),
  
  getRealtimeAnalytics: (matchId: string) =>
    api.get(`/analytics/realtime/${matchId}`)
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message: string, context?: any) =>
    api.post('/chatbot/message', { message, context }),
  
  getChatHistory: (limit?: number) =>
    api.get(`/chatbot/history${limit ? `?limit=${limit}` : ''}`),
  
  clearHistory: () => api.delete('/chatbot/history')
};

// Email API
export const emailAPI = {
  sendFeedback: (data: {
    name: string;
    email: string;
    message: string;
    category: string;
    rating?: number;
  }) => api.post('/email/feedback', data),
  
  subscribeNewsletter: (email: string, language?: string) =>
    api.post('/email/newsletter', { email, language })
};

export default api;