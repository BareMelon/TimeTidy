import { useState } from 'react'
import { Save, Settings, MapPin, Clock, DollarSign, Bell, Shield, Globe } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/components/Toast'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsSchema = z.object({
  // Company Settings
  companyName: z.string().min(1, 'Company name is required'),
  timeZone: z.string(),
  currency: z.string(),
  
  // Work Settings
  defaultShiftDuration: z.number().min(1).max(24),
  overtimeThreshold: z.number().min(1).max(80),
  breakDuration: z.number().min(0).max(120),
  
  // Geofencing
  geofencingEnabled: z.boolean(),
  defaultGeofenceRadius: z.number().min(10).max(1000),
  
  // Notifications
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  notifyOnLateCheckIn: z.boolean(),
  notifyOnMissedCheckOut: z.boolean(),
  
  // Payroll
  payPeriod: z.enum(['weekly', 'biweekly', 'monthly']),
  overtimeRate: z.number().min(1).max(3),
  taxRate: z.number().min(0).max(50),
  
  // Security
  passwordExpiry: z.number().min(0).max(365),
  twoFactorAuth: z.boolean(),
  sessionTimeout: z.number().min(15).max(480),
})

type SettingsForm = z.infer<typeof settingsSchema>

interface AdminSettingsProps {
  className?: string
}

export default function AdminSettings({ className = '' }: AdminSettingsProps) {
  const { success, error } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('company')
  const { settings, updateSettings, resetSettings } = useSettingsStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  })

  const onSubmit = async (data: SettingsForm) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save settings to store (which persists to localStorage)
      updateSettings(data)
      
      success('Settings have been saved and will take effect immediately!')
    } catch (err) {
      error('Failed to save settings. Please try again.')
    }
    
    setIsLoading(false)
  }

  const handleReset = () => {
    resetSettings()
    reset(settings)
    success('Settings have been reset to defaults!')
  }

  const sections = [
    { id: 'company', name: 'Company', icon: Globe },
    { id: 'work', name: 'Work Hours', icon: Clock },
    { id: 'location', name: 'Locations', icon: MapPin },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payroll', name: 'Payroll', icon: DollarSign },
    { id: 'security', name: 'Security', icon: Shield },
  ]

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Settings className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {section.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Company Settings */}
              {activeSection === 'company' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        {...register('companyName')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time Zone
                      </label>
                      <select
                        {...register('timeZone')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Europe/Copenhagen">Europe/Copenhagen</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        {...register('currency')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="DKK">DKK (Danish Kroner)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="GBP">GBP (British Pound)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Work Hours Settings */}
              {activeSection === 'work' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Work Hours Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Shift Duration (hours)
                      </label>
                      <input
                        {...register('defaultShiftDuration', { valueAsNumber: true })}
                        type="number"
                        min="1"
                        max="24"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overtime Threshold (hours/week)
                      </label>
                      <input
                        {...register('overtimeThreshold', { valueAsNumber: true })}
                        type="number"
                        min="1"
                        max="80"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Break Duration (minutes)
                      </label>
                      <input
                        {...register('breakDuration', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        max="120"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Location Settings */}
              {activeSection === 'location' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Location & Geofencing</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        {...register('geofencingEnabled')}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Enable geofencing for check-ins
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Geofence Radius (meters)
                      </label>
                      <input
                        {...register('defaultGeofenceRadius', { valueAsNumber: true })}
                        type="number"
                        min="10"
                        max="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: 50-200m for most businesses
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Methods</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              {...register('emailNotifications')}
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">Email notifications</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              {...register('smsNotifications')}
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">SMS notifications</label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Alert Types</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              {...register('notifyOnLateCheckIn')}
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">Late check-in alerts</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              {...register('notifyOnMissedCheckOut')}
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">Missed check-out alerts</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payroll Settings */}
              {activeSection === 'payroll' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Payroll Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pay Period
                      </label>
                      <select
                        {...register('payPeriod')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Overtime Rate Multiplier
                      </label>
                      <input
                        {...register('overtimeRate', { valueAsNumber: true })}
                        type="number"
                        step="0.1"
                        min="1"
                        max="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Tax Rate (%)
                      </label>
                      <input
                        {...register('taxRate', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        max="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Security & Access</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password Expiry (days, 0 = never)
                        </label>
                        <input
                          {...register('passwordExpiry', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          max="365"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Session Timeout (minutes)
                        </label>
                        <input
                          {...register('sessionTimeout', { valueAsNumber: true })}
                          type="number"
                          min="15"
                          max="480"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          {...register('twoFactorAuth')}
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Enable two-factor authentication
                        </label>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-xs text-yellow-800">
                          <strong>Note:</strong> Security changes will affect all users and may require re-authentication.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Reset to Defaults
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 