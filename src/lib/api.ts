import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  googleAuth: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },
  
  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`),
  
  updateSportPreference: (sport: 'soccer' | 'futsal') =>
    api.post('/auth/sport-preference', { sport }),
  
  logout: () => api.post('/auth/logout')
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