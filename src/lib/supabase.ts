import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock authentication for demo when Supabase is not properly configured
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