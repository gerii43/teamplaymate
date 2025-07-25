import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '@/lib/api'

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
  sport?: 'soccer' | 'futsal'
  sportSelected?: boolean
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
  updateSportPreference: (sport: 'soccer' | 'futsal') => Promise<any>
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
      const response = await authAPI.register({
        email,
        password,
        name: additionalData?.name || email.split('@')[0]
      })
      
      if (response.data.success) {
        const { user, token } = response.data.data
        setUser(user)
        setIsNewUser(true)
        setHasCompletedOnboarding(false)
        localStorage.setItem('auth_token', token)
        localStorage.setItem('statsor_user', JSON.stringify(user))
        localStorage.removeItem('statsor_onboarding_completed')
        return { data: { user }, error: null }
      }
      return { data: null, error: response.data.message }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      
      if (response.data.success) {
        const { user, token } = response.data.data
        setUser(user)
        setIsNewUser(false)
        const onboardingStatus = localStorage.getItem('statsor_onboarding_completed')
        setHasCompletedOnboarding(onboardingStatus === 'true')
        localStorage.setItem('auth_token', token)
        localStorage.setItem('statsor_user', JSON.stringify(user))
        return { data: { user }, error: null }
      }
      return { data: null, error: response.data.message }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      authAPI.googleAuth()
      return { data: null, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authAPI.logout()
      setUser(null)
      setIsNewUser(false)
      setHasCompletedOnboarding(false)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('statsor_user')
      return { error: null }
    } finally {
      setLoading(false)
    }
  }

  const updateSportPreference = async (sport: 'soccer' | 'futsal') => {
    try {
      const response = await authAPI.updateSportPreference(sport)
      if (response.data.success) {
        const updatedUser = { ...user, sport, sportSelected: true }
        setUser(updatedUser)
        localStorage.setItem('statsor_user', JSON.stringify(updatedUser))
        return { data: { user: updatedUser }, error: null }
      }
      return { data: null, error: response.data.message }
    } catch (error: any) {
      return { data: null, error: error.message }
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
    updateSportPreference,
    completeOnboarding,
    skipOnboarding,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}