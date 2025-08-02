import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CheckIn } from '@/types'
import { validateCheckInLocation } from '@/utils/geofencing'
import { getLocationById } from '@/lib/mock-data'

interface CheckInState {
  // Current check-in state
  currentCheckIn: CheckIn | null
  isCheckedIn: boolean
  
  // Actions
  checkIn: (locationId: string, shiftId?: string) => Promise<CheckIn>
  checkOut: () => Promise<CheckIn | null>
  setCurrentCheckIn: (checkIn: CheckIn | null) => void
  
  // Helpers
  getCurrentHours: () => number
  getTodaysHours: () => number
}

export const useCheckInStore = create<CheckInState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentCheckIn: null,
      isCheckedIn: false,

      // Actions
      checkIn: async (locationId: string, shiftId?: string) => {
        // Get current user from auth (in real app, this would come from the auth store)
        const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}')
        const currentUserId = authStore?.state?.user?.id || '2'
        
        // Get location details
        const location = getLocationById(locationId)
        if (!location) {
          throw new Error('Invalid location')
        }

        // Validate geofencing if enabled
        const geofenceCheck = await validateCheckInLocation(location)
        if (!geofenceCheck.allowed) {
          throw new Error(geofenceCheck.error || 'Location validation failed')
        }
        
        // Use actual geolocation or mock coordinates
        let coordinates = { latitude: 55.6761, longitude: 12.5683 }
        try {
          // In a real app, you might want to get actual coordinates here
          // For demo, we'll use mock coordinates with slight variation
          coordinates = {
            latitude: 55.6761 + (Math.random() - 0.5) * 0.001,
            longitude: 12.5683 + (Math.random() - 0.5) * 0.001,
          }
        } catch (error) {
          console.warn('Could not get location:', error)
        }
        
        const newCheckIn: CheckIn = {
          id: Date.now().toString(),
          userId: currentUserId,
          shiftId,
          locationId,
          checkInTime: new Date(),
          checkOutTime: undefined,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          notes: undefined,
          breakDuration: 0,
          overtimeMinutes: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set({
          currentCheckIn: newCheckIn,
          isCheckedIn: true,
        })

        return newCheckIn
      },

      checkOut: async () => {
        const { currentCheckIn } = get()
        
        if (!currentCheckIn) {
          return null
        }

        const updatedCheckIn: CheckIn = {
          ...currentCheckIn,
          checkOutTime: new Date(),
          updatedAt: new Date(),
        }

        // Calculate overtime if applicable
        const hoursWorked = get().getCurrentHours()
        if (hoursWorked > 8) {
          updatedCheckIn.overtimeMinutes = Math.round((hoursWorked - 8) * 60)
        }

        set({
          currentCheckIn: null,
          isCheckedIn: false,
        })

        return updatedCheckIn
      },

      setCurrentCheckIn: (checkIn: CheckIn | null) => {
        set({
          currentCheckIn: checkIn,
          isCheckedIn: checkIn !== null && !checkIn.checkOutTime,
        })
      },

      // Helper functions
      getCurrentHours: () => {
        const { currentCheckIn } = get()
        if (!currentCheckIn || !currentCheckIn.checkInTime) {
          return 0
        }

        const now = new Date()
        const checkInTime = new Date(currentCheckIn.checkInTime)
        const diffMs = now.getTime() - checkInTime.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)
        
        return Math.max(0, diffHours)
      },

      getTodaysHours: () => {
        const { currentCheckIn } = get()
        if (!currentCheckIn) {
          return 0
        }

        // In a real app, you'd sum up all check-ins for today
        // For now, just return current session hours
        return get().getCurrentHours()
      },
    }),
    {
      name: 'checkin-storage',
      partialize: (state) => ({
        currentCheckIn: state.currentCheckIn,
        isCheckedIn: state.isCheckedIn,
      }),
    }
  )
) 