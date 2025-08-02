import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar, Clock, User, ArrowRightLeft, AlertCircle } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { useAuthStore } from '@/stores/authStore'
import { mockUsers, mockShifts, getLocationById } from '@/lib/mock-data'
import { Shift } from '@/types'
import { useToast } from '@/components/Toast'

const shiftSwapSchema = z.object({
  targetUserId: z.string().optional(),
  targetShiftId: z.string().optional(),
  swapType: z.enum(['open', 'specific']),
  reason: z.string().min(10, 'Please provide a reason (minimum 10 characters)'),
  urgency: z.enum(['low', 'medium', 'high']),
  deadline: z.string().optional(),
}).refine((data) => {
  if (data.swapType === 'specific') {
    return data.targetUserId && data.targetShiftId
  }
  return true
}, {
  message: "Please select a specific user and shift for direct swap",
  path: ["targetUserId"],
})

type ShiftSwapForm = z.infer<typeof shiftSwapSchema>

interface ShiftSwapModalProps {
  isOpen: boolean
  onClose: () => void
  originalShift: Shift
  onSwapRequested?: (swapData: any) => void
}

export default function ShiftSwapModal({ isOpen, onClose, originalShift, onSwapRequested }: ShiftSwapModalProps) {
  const { user } = useAuthStore()
  const { success, error } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ShiftSwapForm>({
    resolver: zodResolver(shiftSwapSchema),
    defaultValues: {
      swapType: 'open',
      urgency: 'medium',
      deadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    },
  })

  const swapType = watch('swapType')
  const targetUserId = watch('targetUserId')

  // Get eligible users (excluding current user and admin)
  const eligibleUsers = mockUsers.filter(u => 
    u.id !== user?.id && 
    u.role !== 'admin' && 
    u.isActive
  )

  // Get available shifts for the selected user
  const getAvailableShifts = (userId: string) => {
    if (!userId) return []
    
    return mockShifts.filter(shift => 
      shift.userId === userId &&
      shift.date >= new Date() &&
      shift.id !== originalShift.id &&
      shift.status === 'scheduled'
    ).sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const availableShifts = targetUserId ? getAvailableShifts(targetUserId) : []

  const onSubmit = async (data: ShiftSwapForm) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const swapRequest = {
        id: Date.now().toString(),
        requesterId: user?.id,
        requesterName: `${user?.firstName} ${user?.lastName}`,
        originalShiftId: originalShift.id,
        originalShift: originalShift,
        targetUserId: data.targetUserId,
        targetShiftId: data.targetShiftId,
        swapType: data.swapType,
        reason: data.reason,
        urgency: data.urgency,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        status: 'pending',
        createdAt: new Date(),
      }

             // If specific swap, also get target user info
       if (data.swapType === 'specific' && data.targetUserId) {
         const targetUser = eligibleUsers.find(u => u.id === data.targetUserId)
         const targetShift = availableShifts.find(s => s.id === data.targetShiftId)
         Object.assign(swapRequest, {
           targetUser: targetUser,
           targetShift: targetShift
         })
       }

      onSwapRequested?.(swapRequest)
      reset()
      onClose()
      success('Swap Request Submitted', 'Your shift swap request has been submitted for approval!')
    } catch (err) {
      error('Submission Failed', 'Failed to submit swap request. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  const originalLocation = getLocationById(originalShift.locationId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <ArrowRightLeft className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Request Shift Swap</h2>
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
          {/* Original Shift Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Your Shift to Swap</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800">
                  {format(originalShift.date, 'EEEE, MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800">
                  {originalShift.startTime} - {originalShift.endTime}
                </span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800">{originalShift.role}</span>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              📍 {originalLocation?.name} - {originalLocation?.address}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Swap Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Swap Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    {...register('swapType')}
                    type="radio"
                    value="open"
                    className="mt-1 mr-3"
                    onChange={() => {
                      setValue('targetUserId', '')
                      setValue('targetShiftId', '')
                    }}
                  />
                  <div>
                    <span className="font-medium text-gray-900">Open Request</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Post your shift for anyone to pick up. No specific person required.
                    </p>
                  </div>
                </label>
                <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    {...register('swapType')}
                    type="radio"
                    value="specific"
                    className="mt-1 mr-3"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Direct Swap</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Swap with a specific person's shift. Both parties must agree.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Specific Swap Options */}
            {swapType === 'specific' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Direct Swap Details</h4>
                
                {/* Target User */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Swap With
                  </label>
                  <select
                    {...register('targetUserId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onChange={(e) => {
                      setValue('targetUserId', e.target.value)
                      setValue('targetShiftId', '')
                    }}
                  >
                    <option value="">Select an employee...</option>
                    {eligibleUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.role})
                      </option>
                    ))}
                  </select>
                  {errors.targetUserId && (
                    <p className="mt-1 text-sm text-red-600">{errors.targetUserId.message}</p>
                  )}
                </div>

                {/* Target Shift */}
                {targetUserId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Their Shift
                    </label>
                    <select
                      {...register('targetShiftId')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select their shift...</option>
                      {availableShifts.map(shift => {
                        const location = getLocationById(shift.locationId)
                        return (
                          <option key={shift.id} value={shift.id}>
                            {format(shift.date, 'MMM d')} • {shift.startTime}-{shift.endTime} • {shift.role} • {location?.name}
                          </option>
                        )
                      })}
                    </select>
                    {availableShifts.length === 0 && (
                      <p className="mt-1 text-sm text-gray-500">No available shifts for this employee</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Swap
              </label>
              <textarea
                {...register('reason')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Please explain why you need to swap this shift..."
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'low', label: 'Low', color: 'text-green-700 bg-green-50 border-green-200' },
                  { value: 'medium', label: 'Medium', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
                  { value: 'high', label: 'High', color: 'text-red-700 bg-red-50 border-red-200' },
                ].map(urgency => (
                  <label key={urgency.value} className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer hover:opacity-80 ${urgency.color}`}>
                    <input
                      {...register('urgency')}
                      type="radio"
                      value={urgency.value}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">{urgency.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Response Deadline (Optional)
              </label>
              <input
                {...register('deadline')}
                type="date"
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                When do you need a response by? Leave blank for no deadline.
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                  <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                    <li>• All swap requests require manager approval</li>
                    <li>• {swapType === 'specific' ? 'The other employee must also agree to the swap' : 'Open requests are visible to all eligible employees'}</li>
                    <li>• You'll be notified once there's a response</li>
                    <li>• You can cancel this request before it's approved</li>
                  </ul>
                </div>
              </div>
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
                {isSubmitting ? 'Submitting...' : 'Submit Swap Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 