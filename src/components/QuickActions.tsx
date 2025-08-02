import { useState } from 'react'
import { Clock, Calendar, Users, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePermissions } from '@/hooks/usePermissions'
import { useCheckInStore } from '@/stores/checkInStore'
import { useToast } from '@/components/Toast'
import TimeOffRequestModal from './TimeOffRequestModal'
import CreateShiftModal from './CreateShiftModal'

export default function QuickActions() {
  const { canCreateShifts, canManageUsers } = usePermissions()
  const { isCheckedIn, checkIn, checkOut } = useCheckInStore()
  const { success, error } = useToast()
  const [showTimeOffModal, setShowTimeOffModal] = useState(false)
  const [showCreateShiftModal, setShowCreateShiftModal] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)

  const handleQuickCheckInOut = async () => {
    const defaultLocationId = '1' // Main Store - Downtown
    
    setIsCheckingIn(true)
    try {
      if (isCheckedIn) {
        await checkOut()
        success('Successfully checked out!')
      } else {
        await checkIn(defaultLocationId)
        success('Successfully checked in!')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      error(`Check-in failed: ${errorMessage}`)
    } finally {
      setIsCheckingIn(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Quick Check In/Out */}
        <button
          onClick={handleQuickCheckInOut}
          disabled={isCheckingIn}
          className={`flex items-center justify-center p-4 rounded-lg border-2 border-dashed transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isCheckedIn
              ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
              : 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
          }`}
        >
          <Clock className="w-5 h-5 mr-2" />
          <span className="font-medium">
            {isCheckingIn 
              ? (isCheckedIn ? 'Checking Out...' : 'Checking In...')
              : (isCheckedIn ? 'Quick Check Out' : 'Quick Check In')
            }
          </span>
        </button>

        {/* View Schedule */}
        <Link
          to="/schedule"
          className="flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Calendar className="w-5 h-5 mr-2" />
          <span className="font-medium">View Schedule</span>
        </Link>

        {/* Create Shift (Admin/Manager only) */}
        {canCreateShifts() && (
          <button 
            onClick={() => setShowCreateShiftModal(true)}
            className="flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="font-medium">Create Shift</span>
          </button>
        )}

        {/* Request Time Off */}
        <button
          onClick={() => setShowTimeOffModal(true)}
          className="flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
        >
          <Clock className="w-5 h-5 mr-2" />
          <span className="font-medium">Request Time Off</span>
        </button>

        {/* Manage Users (Admin/Manager only) */}
        {canManageUsers() && (
          <Link
            to="/admin"
            className="flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <Users className="w-5 h-5 mr-2" />
            <span className="font-medium">Manage Users</span>
          </Link>
        )}
      </div>

      {/* Time Off Request Modal */}
      <TimeOffRequestModal
        isOpen={showTimeOffModal}
        onClose={() => setShowTimeOffModal(false)}
        onRequestSubmitted={() => {
          setShowTimeOffModal(false)
        }}
      />

      {/* Create Shift Modal */}
      <CreateShiftModal
        isOpen={showCreateShiftModal}
        onClose={() => setShowCreateShiftModal(false)}
        onShiftCreated={() => {
          setShowCreateShiftModal(false)
        }}
      />
    </div>
  )
} 