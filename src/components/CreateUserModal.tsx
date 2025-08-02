import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, User, UserPlus, Copy, Check } from 'lucide-react'
import { UserRole } from '@/types'
import { createTempUser, createEmployee, validateEmployeeData, generateTempUsername, generateTempPassword } from '@/utils/userGeneration'
import { useToast } from '@/components/Toast'
import { useLanguageStore } from '@/stores/languageStore'

const createUserSchema = z.object({
  userType: z.enum(['temporary', 'permanent']),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['employee', 'manager', 'admin']),
  hourlyRate: z.number().min(0).max(1000),
}).refine((data) => {
  if (data.userType === 'permanent' && (!data.email || data.email.trim() === '')) {
    return false
  }
  return true
}, {
  message: "Email is required for permanent employees",
  path: ["email"],
})

type CreateUserForm = z.infer<typeof createUserSchema>

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: (user: any) => void
}

export default function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const { success } = useToast()
  const { t } = useLanguageStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string
    password: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      userType: 'temporary',
      role: 'employee',
      hourlyRate: 16.00,
    },
  })

  const userType = watch('userType')

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const onSubmit = async (data: CreateUserForm) => {
    setIsSubmitting(true)

    try {
      let newUser
      let tempPassword = ''

      if (data.userType === 'temporary') {
        // Create temporary user
        const userData = createTempUser({
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          hourlyRate: data.hourlyRate,
        })
        
        newUser = {
          id: Date.now().toString(),
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        tempPassword = generateTempPassword()
      } else {
        // Create permanent employee
        if (!data.email) {
          alert('Email is required for permanent employees')
          setIsSubmitting(false)
          return
        }

        const validation = validateEmployeeData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          hourlyRate: data.hourlyRate,
        })

        if (!validation.isValid) {
          alert('Validation errors:\n' + validation.errors.join('\n'))
          setIsSubmitting(false)
          return
        }

        const userData = createEmployee(
          data.firstName,
          data.lastName,
          data.email,
          data.role,
          data.hourlyRate
        )

        newUser = {
          id: Date.now().toString(),
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        tempPassword = 'welcome123' // Default password for new employees
      }

      // Store user credentials for display
      setGeneratedCredentials({
        username: newUser.username,
        password: tempPassword,
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      onUserCreated(newUser)
    } catch (error) {
      alert('Failed to create user. Please try again.')
    }

    setIsSubmitting(false)
  }

  const handleClose = () => {
    reset()
    setGeneratedCredentials(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {!generatedCredentials ? (
          // User Creation Form
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('userType')}
                      type="radio"
                      value="temporary"
                      className="mr-2"
                    />
                    <UserPlus className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="text-sm">{t('users.temporary')}</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('userType')}
                      type="radio"
                      value="permanent"
                      className="mr-2"
                    />
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm">{t('users.permanent')}</span>
                  </label>
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  {...register('firstName')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  {...register('lastName')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              {/* Email - Required for permanent employees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email {userType === 'permanent' && <span className="text-red-500">*</span>}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate (DKK)
                </label>
                <input
                  {...register('hourlyRate', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter hourly rate"
                />
                {errors.hourlyRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.hourlyRate.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // User Created Success
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-green-600">User Created Successfully!</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">
                  {generatedCredentials.username}
                </h3>
                <p className="text-sm text-green-600">
                  {generatedCredentials.password}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Login Credentials:</h4>
                
                {/* Username */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Username:</label>
                    <p className="text-sm text-gray-900">{generatedCredentials.username}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedCredentials.username, 'username')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {copiedField === 'username' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Password:</label>
                    <p className="text-sm text-gray-900">{generatedCredentials.password}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedCredentials.password, 'password')}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {copiedField === 'password' ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> The user will be required to change their password on first login.
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 