import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Clock, AlertCircle, User } from 'lucide-react'
import { format, differenceInDays, parseISO } from 'date-fns'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/Toast'

const timeOffRequestSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  reason: z.enum(['vacation', 'sick', 'personal', 'family', 'other']),
  notes: z.string().optional(),
}).refine((data) => {
  const start = parseISO(data.startDate)
  const end = parseISO(data.endDate)
  return start <= end
}, {
  message: "End date must be after start date",
  path: ["endDate"],
})

type TimeOffRequestForm = z.infer<typeof timeOffRequestSchema>

interface TimeOffRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onRequestSubmitted?: (request: any) => void
}

const REASON_OPTIONS = [
  { value: 'vacation', label: 'Vacation', icon: '🏖️' },
  { value: 'sick', label: 'Sick Leave', icon: '🏥' },
  { value: 'personal', label: 'Personal', icon: '👤' },
  { value: 'family', label: 'Family Emergency', icon: '👨‍👩‍👧‍👦' },
  { value: 'other', label: 'Other', icon: '📝' },
]

export default function TimeOffRequestModal({ isOpen, onClose, onRequestSubmitted }: TimeOffRequestModalProps) {
  const { user } = useAuthStore()
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<TimeOffRequestForm>({
    resolver: zodResolver(timeOffRequestSchema),
    defaultValues: {
      reason: 'vacation',
    },
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = parseISO(startDate)
      const end = parseISO(endDate)
      const days = differenceInDays(end, start) + 1
      return days > 0 ? days : 0
    }
    return 0
  }

  const onSubmit = async (data: TimeOffRequestForm) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newRequest = {
        id: Date.now().toString(),
        userId: user?.id,
        userName: `${user?.firstName} ${user?.lastName}`,
        startDate: parseISO(data.startDate),
        endDate: parseISO(data.endDate),
        reason: data.reason,
        notes: data.notes || '',
        status: 'pending',
        submittedAt: new Date(),
        totalDays: calculateDays(),
      }

      onRequestSubmitted?.(newRequest)
      reset()
      onClose()
      success('Time off request submitted successfully!')
    } catch (err) {
      error('Failed to submit time off request. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  const totalDays = calculateDays()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Request Time Off</h2>
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
            {/* User Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Employee</p>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  {...register('startDate')}
                  type="date"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  {...register('endDate')}
                  type="date"
                  min={startDate || format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Duration Display */}
            {totalDays > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Duration: {totalDays} day{totalDays !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <div className="grid grid-cols-1 gap-2">
                {REASON_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      {...register('reason')}
                      type="radio"
                      value={option.value}
                      className="mr-3"
                    />
                    <span className="mr-2">{option.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add any additional information or context for your request..."
              />
            </div>

            {/* Warning for upcoming schedules */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Please submit your request at least 2 weeks in advance when possible. 
                    Existing scheduled shifts during this period will need manager approval for changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || totalDays === 0}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 