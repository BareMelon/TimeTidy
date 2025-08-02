import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { authenticateUser } from '@/lib/mock-data'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
  resetPassword: (newPassword: string) => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true })
        
        // Mock authentication logic
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Authenticate user with specific credentials
        const user = authenticateUser(username, password)
        
        if (user) {
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          })
          return true
        }
        
        set({ isLoading: false })
        return false
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },

      updateUser: (updatedUser: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ 
            user: { ...user, ...updatedUser } 
          })
        }
      },

      resetPassword: async () => {
        set({ isLoading: true })
        
        // Mock password reset
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { user } = get()
        if (user) {
          set({
            user: { ...user, mustResetPassword: false },
            isLoading: false
          })
          return true
        }
        
        set({ isLoading: false })
        return false
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
) 