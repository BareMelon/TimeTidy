import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar, Clock, User, MapPin, Plus } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { mockUsers, mockLocations, isUserAvailableForShift } from '@/lib/mock-data'
import { useToast } from '@/components/Toast'
import { Shift } from '@/types'

const createShiftSchema = z.object({
  userId: z.string().min(1, 'Please select an employee'),
  locationId: z.string().min(1, 'Please select a location'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  role: z.string().min(1, 'Role is required'),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringDays: z.array(z.number()).optional(),
  recurringEndDate: z.string().optional(),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime
  }
  return true
}, {
  message: "End time must be after start time",
  path: ["endTime"],
})

type CreateShiftForm = z.infer<typeof createShiftSchema>

interface CreateShiftModalProps {
  isOpen: boolean
  onClose: () => void
  onShiftCreated?: (shift: any) => void
  editingShift?: Shift | null
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

const COMMON_ROLES = [
  'Cashier',
  'Sales Associate', 
  'Manager',
  'Supervisor',
  'Stock Clerk',
  'Customer Service',
  'Security',
  'Maintenance',
]

export default function CreateShiftModal({ isOpen, onClose, onShiftCreated, editingShift }: CreateShiftModalProps) {
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateShiftForm>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: {
      userId: editingShift?.userId || '',
      locationId: editingShift?.locationId || '',
      date: editingShift ? format(editingShift.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      startTime: editingShift?.startTime || '09:00',
      endTime: editingShift?.endTime || '17:00',
      role: editingShift?.role || '',
      notes: editingShift?.notes || '',
      isRecurring: false,
      recurringDays: [],
      recurringEndDate: '',
    },
  })

  const isRecurring = watch('isRecurring')
  const selectedDays = watch('recurringDays') || []
  const selectedUserId = watch('userId')
  const selectedDate = watch('date')
  
  // Check if selected user is on time off
  const userAvailability = selectedUserId && selectedDate 
    ? isUserAvailableForShift(selectedUserId, new Date(selectedDate))
    : { available: true, warning: null }

  const onSubmit = async (data: CreateShiftForm) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const user = mockUsers.find(u => u.id === data.userId)
      const location = mockLocations.find(l => l.id === data.locationId)
      
      if (editingShift) {
        // Update existing shift
        const updatedShift = {
          ...editingShift,
          userId: data.userId,
          locationId: data.locationId,
          date: new Date(data.date),
          startTime: data.startTime,
          endTime: data.endTime,
          role: data.role,
          notes: data.notes || '',
          updatedAt: new Date(),
        }
        
        onShiftCreated?.(updatedShift)
        success(`Shift updated for ${user?.firstName} ${user?.lastName} at ${location?.name}`)
      } else if (data.isRecurring && data.recurringDays && data.recurringDays.length > 0) {
        // Create multiple shifts for recurring schedule
        const shifts = []
        const startDate = new Date(data.date)
        const endDate = data.recurringEndDate ? new Date(data.recurringEndDate) : addDays(startDate, 30)
        
        let currentDate = new Date(startDate)
        while (currentDate <= endDate) {
          if (data.recurringDays.includes(currentDate.getDay())) {
            shifts.push({
              id: `${Date.now()}-${Math.random()}`,
              userId: data.userId,
              locationId: data.locationId,
              date: new Date(currentDate),
              startTime: data.startTime,
              endTime: data.endTime,
              role: data.role,
              status: 'scheduled',
              notes: data.notes || '',
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          }
          currentDate = addDays(currentDate, 1)
        }
        
        onShiftCreated?.(shifts)
        success(`Created ${shifts.length} shifts for ${user?.firstName} ${user?.lastName}`)
      } else {
        // Create single shift
        const shift = {
          id: Date.now().toString(),
          userId: data.userId,
          locationId: data.locationId,
          date: new Date(data.date),
          startTime: data.startTime,
          endTime: data.endTime,
          role: data.role,
          status: 'scheduled',
          notes: data.notes || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        onShiftCreated?.(shift)
        success(`Shift created for ${user?.firstName} ${user?.lastName} at ${location?.name}`)
      }
      
      reset()
      onClose()
    } catch (err) {
      error(editingShift ? 'Update Failed' : 'Creation Failed', 'Failed to process shift. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleDayToggle = (dayValue: number) => {
    const newDays = selectedDays.includes(dayValue)
      ? selectedDays.filter(d => d !== dayValue)
      : [...selectedDays, dayValue]
    setValue('recurringDays', newDays)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <Plus className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">
              {editingShift ? 'Edit Shift' : 'Create New Shift'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Employee and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Employee
                </label>
                <select
                  {...register('userId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select employee...</option>
                  {mockUsers.filter(u => u.role !== 'admin').map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.role})
                    </option>
                  ))}
                </select>
                {errors.userId && (
                  <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
                )}
                {!userAvailability.available && userAvailability.warning && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800 font-medium">⚠️ Time Off Warning</p>
                    <p className="text-sm text-yellow-700">{userAvailability.warning}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <select
                  {...register('locationId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select location...</option>
                  {mockLocations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.address}
                    </option>
                  ))}
                </select>
                {errors.locationId && (
                  <p className="mt-1 text-sm text-red-600">{errors.locationId.message}</p>
                )}
              </div>
            </div>

            {/* Date and Times */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <input
                  {...register('date')}
                  type="date"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Start Time
                </label>
                <input
                  {...register('startTime')}
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  End Time
                </label>
                <input
                  {...register('endTime')}
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role/Position
              </label>
              <input
                {...register('role')}
                type="text"
                list="common-roles"
                placeholder="Enter role or select from common roles"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <datalist id="common-roles">
                {COMMON_ROLES.map(role => (
                  <option key={role} value={role} />
                ))}
              </datalist>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
            </div>

            {/* Recurring Options */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  {...register('isRecurring')}
                  type="checkbox"
                  disabled={!!editingShift}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Create recurring shifts
                  {editingShift && (
                    <span className="text-xs text-gray-500 block">
                      (Not available when editing)
                    </span>
                  )}
                </label>
              </div>

              {isRecurring && (
                <div className="pl-6 space-y-4 border-l-2 border-primary-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Repeat on days:
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {DAYS_OF_WEEK.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleDayToggle(day.value)}
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            selectedDays.includes(day.value)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {day.label.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End recurring on:
                    </label>
                    <input
                      {...register('recurringEndDate')}
                      type="date"
                      min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to create shifts for the next 30 days
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Add any special instructions or notes for this shift..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Submit Buttons */}
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
                {isSubmitting ? 'Creating...' : isRecurring ? 'Create Recurring Shifts' : 'Create Shift'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 