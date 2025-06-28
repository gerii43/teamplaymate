import { createClient } from '@supabase/supabase-js'

// For demo purposes, we'll use a mock setup
// In production, you would use your actual Supabase credentials
const supabaseUrl = 'https://demo.supabase.co'
const supabaseAnonKey = 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock authentication for demo
export const mockAuth = {
  signUp: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { 
      data: { user: { id: '1', email } }, 
      error: null 
    }
  },
  signIn: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { 
      data: { user: { id: '1', email } }, 
      error: null 
    }
  },
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { error: null }
  }
}