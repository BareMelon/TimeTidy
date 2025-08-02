import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AppSettings {
  // Company Settings
  companyName: string
  timeZone: string
  currency: string
  
  // Work Settings
  defaultShiftDuration: number
  overtimeThreshold: number
  breakDuration: number
  
  // Geofencing
  geofencingEnabled: boolean
  defaultGeofenceRadius: number
  
  // Notifications
  emailNotifications: boolean
  smsNotifications: boolean
  notifyOnLateCheckIn: boolean
  notifyOnMissedCheckOut: boolean
  
  // Payroll
  payPeriod: 'weekly' | 'biweekly' | 'monthly'
  overtimeRate: number
  taxRate: number
  
  // Security
  passwordExpiry: number
  twoFactorAuth: boolean
  sessionTimeout: number
}

interface SettingsStore {
  settings: AppSettings
  updateSettings: (newSettings: Partial<AppSettings>) => void
  resetSettings: () => void
}

const defaultSettings: AppSettings = {
  // Company defaults
  companyName: 'TimeTidy Company',
  timeZone: 'Europe/Copenhagen',
  currency: 'DKK',
  
  // Work defaults
  defaultShiftDuration: 8,
  overtimeThreshold: 40,
  breakDuration: 30,
  
  // Geofencing defaults
  geofencingEnabled: true,
  defaultGeofenceRadius: 100,
  
  // Notification defaults
  emailNotifications: true,
  smsNotifications: false,
  notifyOnLateCheckIn: true,
  notifyOnMissedCheckOut: true,
  
  // Payroll defaults
  payPeriod: 'monthly',
  overtimeRate: 1.5,
  taxRate: 20,
  
  // Security defaults
  passwordExpiry: 90,
  twoFactorAuth: false,
  sessionTimeout: 120,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      
      resetSettings: () =>
        set({ settings: defaultSettings }),
    }),
    {
      name: 'timetidy-settings',
    }
  )
) 