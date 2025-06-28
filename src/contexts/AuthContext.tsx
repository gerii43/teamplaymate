import React, { createContext, useContext, useEffect, useState } from 'react'
import { mockAuth } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  name: string
  picture?: string
  given_name?: string
  family_name?: string
  locale?: string
  verified_email?: boolean
  created_at?: string
  location?: string
  provider: 'google' | 'email'
}

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  isNewUser: boolean
  hasCompletedOnboarding: boolean
  signUp: (email: string, password: string, additionalData?: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<any>
  completeOnboarding: () => void
  skipOnboarding: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mock Google Sign-In response with comprehensive user data
const mockGoogleSignIn = async (): Promise<UserProfile> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const mockGoogleUser: UserProfile = {
    id: 'google_' + Math.random().toString(36).substr(2, 9),
    email: 'coach@example.com',
    name: 'Carlos Rodriguez',
    given_name: 'Carlos',
    family_name: 'Rodriguez',
    picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    locale: 'es',
    verified_email: true,
    created_at: new Date().toISOString(),
    location: 'Madrid, Spain',
    provider: 'google'
  }
  
  return mockGoogleUser
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('statsor_user')
    const onboardingStatus = localStorage.getItem('statsor_onboarding_completed')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setHasCompletedOnboarding(onboardingStatus === 'true')
    }
  }, [])

  const signUp = async (email: string, password: string, additionalData?: any) => {
    setLoading(true)
    try {
      const result = await mockAuth.signUp(email, password)
      if (result.data?.user) {
        const userProfile: UserProfile = {
          id: result.data.user.id,
          email: result.data.user.email,
          name: additionalData?.name || email.split('@')[0],
          provider: 'email',
          created_at: new Date().toISOString(),
          verified_email: true,
          location: additionalData?.location,
          ...additionalData
        }
        
        setUser(userProfile)
        setIsNewUser(true)
        setHasCompletedOnboarding(false)
        localStorage.setItem('statsor_user', JSON.stringify(userProfile))
        localStorage.removeItem('statsor_onboarding_completed')
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await mockAuth.signIn(email, password)
      if (result.data?.user) {
        const userProfile: UserProfile = {
          id: result.data.user.id,
          email: result.data.user.email,
          name: email.split('@')[0],
          provider: 'email',
          created_at: new Date().toISOString(),
          verified_email: true
        }
        
        setUser(userProfile)
        setIsNewUser(false)
        const onboardingStatus = localStorage.getItem('statsor_onboarding_completed')
        setHasCompletedOnboarding(onboardingStatus === 'true')
        localStorage.setItem('statsor_user', JSON.stringify(userProfile))
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const userProfile = await mockGoogleSignIn()
      
      // Check if this is a returning user
      const existingUsers = JSON.parse(localStorage.getItem('statsor_google_users') || '[]')
      const existingUser = existingUsers.find((u: UserProfile) => u.email === userProfile.email)
      
      if (!existingUser) {
        // New Google user
        existingUsers.push(userProfile)
        localStorage.setItem('statsor_google_users', JSON.stringify(existingUsers))
        setIsNewUser(true)
        setHasCompletedOnboarding(false)
        localStorage.removeItem('statsor_onboarding_completed')
      } else {
        // Returning Google user
        setIsNewUser(false)
        const onboardingStatus = localStorage.getItem('statsor_onboarding_completed')
        setHasCompletedOnboarding(onboardingStatus === 'true')
      }
      
      setUser(userProfile)
      localStorage.setItem('statsor_user', JSON.stringify(userProfile))
      
      return { data: { user: userProfile }, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await mockAuth.signOut()
      setUser(null)
      setIsNewUser(false)
      setHasCompletedOnboarding(false)
      localStorage.removeItem('statsor_user')
      return { error: null }
    } finally {
      setLoading(false)
    }
  }

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true)
    setIsNewUser(false)
    localStorage.setItem('statsor_onboarding_completed', 'true')
  }

  const skipOnboarding = () => {
    setHasCompletedOnboarding(true)
    setIsNewUser(false)
    localStorage.setItem('statsor_onboarding_completed', 'true')
  }

  const value = {
    user,
    loading,
    isNewUser,
    hasCompletedOnboarding,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    completeOnboarding,
    skipOnboarding,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}