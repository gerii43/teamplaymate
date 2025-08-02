import axios from 'axios';
import { toast } from 'sonner';

// API Configuration for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006';

export const api = {
  baseURL: API_BASE_URL,
  
  // Auth endpoints
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
    google: `${API_BASE_URL}/api/auth/google`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    me: `${API_BASE_URL}/api/auth/me`,
  },

  // Teams endpoints
  teams: {
    list: `${API_BASE_URL}/api/teams`,
    create: `${API_BASE_URL}/api/teams`,
    get: (id: string) => `${API_BASE_URL}/api/teams/${id}`,
    update: (id: string) => `${API_BASE_URL}/api/teams/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/teams/${id}`,
    players: (id: string) => `${API_BASE_URL}/api/teams/${id}/players`,
  },

  // Players endpoints
  players: {
    list: `${API_BASE_URL}/api/players`,
    create: `${API_BASE_URL}/api/players`,
    get: (id: string) => `${API_BASE_URL}/api/players/${id}`,
    update: (id: string) => `${API_BASE_URL}/api/players/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/players/${id}`,
    stats: (id: string) => `${API_BASE_URL}/api/players/${id}/stats`,
  },

  // Matches endpoints
  matches: {
    list: `${API_BASE_URL}/api/matches`,
    create: `${API_BASE_URL}/api/matches`,
    get: (id: string) => `${API_BASE_URL}/api/matches/${id}`,
    update: (id: string) => `${API_BASE_URL}/api/matches/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/matches/${id}`,
    stats: (id: string) => `${API_BASE_URL}/api/matches/${id}/stats`,
    events: (id: string) => `${API_BASE_URL}/api/matches/${id}/events`,
  },

  // Chatbot endpoints
  chatbot: {
    chat: `${API_BASE_URL}/api/chatbot/chat`,
    history: `${API_BASE_URL}/api/chatbot/history`,
    suggestions: `${API_BASE_URL}/api/chatbot/suggestions`,
    clear: `${API_BASE_URL}/api/chatbot/clear`,
  },

  // Analytics endpoints
  analytics: {
    dashboard: `${API_BASE_URL}/api/analytics/dashboard`,
    team: (id: string) => `${API_BASE_URL}/api/analytics/team/${id}`,
    player: (id: string) => `${API_BASE_URL}/api/analytics/player/${id}`,
    matches: `${API_BASE_URL}/api/analytics/matches`,
    export: `${API_BASE_URL}/api/analytics/export`,
  },

  // Upload endpoints
  upload: {
    image: `${API_BASE_URL}/api/upload/image`,
    document: `${API_BASE_URL}/api/upload/document`,
    delete: (id: string) => `${API_BASE_URL}/api/upload/${id}`,
  },

  // Subscription endpoints
  subscription: {
    plans: `${API_BASE_URL}/api/subscriptions/plans`,
    create: `${API_BASE_URL}/api/subscriptions/create`,
    current: `${API_BASE_URL}/api/subscriptions/current`,
    cancel: `${API_BASE_URL}/api/subscriptions/cancel`,
    upgrade: `${API_BASE_URL}/api/subscriptions/upgrade`,
  },

  // Health check
  health: `${API_BASE_URL}/api/health`,
};

// Mock Auth API functions for local development
export const authAPI = {
  register: async (data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user
    const mockUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      name: data.name || data.email.split('@')[0],
      picture: null,
      provider: 'email' as const,
      created_at: new Date().toISOString(),
      location: data.location || '',
      sport: undefined,
      sportSelected: false
    };
    
    const mockToken = `mock_token_${Date.now()}`;
    
    return {
      data: {
        success: true,
        data: {
          user: mockUser,
          token: mockToken
        },
        message: 'Registration successful'
      }
    };
  },
  
  login: async (data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('statsor_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.email === data.email) {
        const mockToken = `mock_token_${Date.now()}`;
        return {
          data: {
            success: true,
            data: {
              user: user,
              token: mockToken
            },
            message: 'Login successful'
          }
        };
      }
    }
    
    // Create new user if not found
    const mockUser = {
      id: `user_${Date.now()}`,
      email: data.email,
      name: data.email.split('@')[0],
      picture: null,
      provider: 'email' as const,
      created_at: new Date().toISOString(),
      location: '',
      sport: undefined,
      sportSelected: false
    };
    
    const mockToken = `mock_token_${Date.now()}`;
    
    return {
      data: {
        success: true,
        data: {
          user: mockUser,
          token: mockToken
        },
        message: 'Login successful'
      }
    };
  },
  
  verifyGoogleToken: async (token: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock Google user
    const mockUser = {
      id: `google_user_${Date.now()}`,
      email: 'user@gmail.com',
      name: 'Google User',
      picture: 'https://via.placeholder.com/150',
      provider: 'google' as const,
      created_at: new Date().toISOString(),
      location: '',
      sport: undefined,
      sportSelected: false
    };
    
    const mockToken = `mock_google_token_${Date.now()}`;
    
    return {
      data: {
        success: true,
        data: {
          user: mockUser,
          token: mockToken
        },
        message: 'Google authentication successful'
      }
    };
  },
  
  updateSportPreference: async (sport: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update user in localStorage
    const savedUser = localStorage.getItem('statsor_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      user.sport = sport;
      user.sportSelected = true;
      localStorage.setItem('statsor_user', JSON.stringify(user));
    }
    
    return {
      data: {
        success: true,
        data: { sport },
        message: 'Sport preference updated successfully'
      }
    };
  }
};

export default api;