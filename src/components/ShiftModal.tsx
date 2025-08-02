import { X, Clock, MapPin, User, Calendar, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { Shift } from '@/types'
import { getLocationById } from '@/lib/mock-data'
import { usePermissions } from '@/hooks/usePermissions'

interface ShiftModalProps {
  shift: Shift | null
  isOpen: boolean
  onClose: () => void
  onRequestTimeOff?: (shiftId: string) => void
  onRequestSwap?: (shiftId: string) => void
  onEditShift?: (shiftId: string) => void
  onCancelShift?: (shiftId: string) => void
}

export default function ShiftModal({ 
  shift, 
  isOpen, 
  onClose, 
  onRequestTimeOff, 
  onRequestSwap,
  onEditShift,
  onCancelShift 
}: ShiftModalProps) {
  const { canApproveRequests } = usePermissions()

  if (!isOpen || !shift) return null

  const location = getLocationById(shift.locationId)
  const duration = calculateShiftDuration(shift.startTime, shift.endTime)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Shift Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Date & Time */}
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">
                {format(shift.date, 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                <Clock className="w-4 h-4" />
                <span>{shift.startTime} - {shift.endTime}</span>
                <span>({duration})</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">{location?.name}</h3>
              <p className="text-sm text-gray-600">
                {location?.address}, {location?.city}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900">Role</h3>
              <p className="text-sm text-gray-600">{shift.role}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              shift.status === 'scheduled'
                ? 'bg-green-100 text-green-800'
                : shift.status === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : shift.status === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {shift.status === 'no_show' ? 'No Show' : shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
            </span>
          </div>

          {/* Notes */}
          {shift.notes && (
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Notes</h3>
                <p className="text-sm text-gray-600">{shift.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 flex space-x-3">
          {/* Employee Actions */}
          {!canApproveRequests() && (
            <>
              <button
                onClick={() => onRequestTimeOff?.(shift.id)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Request Time Off
              </button>
              <button
                onClick={() => onRequestSwap?.(shift.id)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Request Swap
              </button>
            </>
          )}

          {/* Admin/Manager Actions */}
          {canApproveRequests() && (
            <>
              <button 
                onClick={() => onEditShift?.(shift.id)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Edit Shift
              </button>
              <button 
                onClick={() => onCancelShift?.(shift.id)}
                className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
              >
                Cancel Shift
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function calculateShiftDuration(startTime: string, endTime: string): string {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute
  
  const durationMinutes = endMinutes - startMinutes
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  
  if (minutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${minutes}m`
} 