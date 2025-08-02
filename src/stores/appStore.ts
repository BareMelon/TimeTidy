import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // UI State
  darkMode: boolean
  language: 'en' | 'da'
  sidebarOpen: boolean
  
  // Notification State
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    duration?: number
  }>
  
  // Actions
  toggleDarkMode: () => void
  setLanguage: (language: 'en' | 'da') => void
  toggleSidebar: () => void
  addNotification: (notification: Omit<AppState['notifications'][0], 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      darkMode: false,
      language: 'en',
      sidebarOpen: false,
      notifications: [],

      // Actions
      toggleDarkMode: () => {
        set(state => ({ darkMode: !state.darkMode }))
        
        // Apply dark mode to document
        const { darkMode } = get()
        if (darkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      setLanguage: (language: 'en' | 'da') => {
        set({ language })
      },

      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }))
      },

      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9)
        set(state => ({
          notifications: [...state.notifications, { ...notification, id }]
        }))

        // Auto-remove notification after duration
        const duration = notification.duration || 5000
        setTimeout(() => {
          get().removeNotification(id)
        }, duration)
      },

      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        language: state.language,
      }),
    }
  )
) 