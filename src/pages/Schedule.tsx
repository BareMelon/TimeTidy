import { useState } from 'react'
import { Calendar, Clock, User, Filter } from 'lucide-react'
import { format } from 'date-fns'
import CalendarView from '@/components/CalendarView'
import ShiftModal from '@/components/ShiftModal'
import ShiftSwapModal from '@/components/ShiftSwapModal'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/Toast'
import { useShiftStore } from '@/stores/shiftStore'
import { useLanguageStore } from '@/stores/languageStore'
import { Shift } from '@/types'

export default function Schedule() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [showShiftModal, setShowShiftModal] = useState(false)
  const [showShiftSwapModal, setShowShiftSwapModal] = useState(false)
  const [filterRole, setFilterRole] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const { user } = useAuthStore()
  const { canViewAllShifts } = usePermissions()
  const { shifts: storeShifts, updateShift } = useShiftStore()
  const { success } = useToast()
  const { t } = useLanguageStore()

  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift)
    setShowShiftModal(true)
  }

  const handleRequestTimeOff = (shiftId: string) => {
    // Close shift modal and open time off request modal for this specific shift
    setShowShiftModal(false)
    // In a real app, this would open a time off request modal for the specific shift
    // For now, we'll show a success message as placeholder
    success('Time off request form would open here for the selected shift')
  }

  const handleRequestSwap = (shiftId: string) => {
    setShowShiftModal(false)
    setShowShiftSwapModal(true)
  }

  const handleEditShift = (shiftId: string) => {
    setShowShiftModal(false)
    success(`Edit functionality would open for shift ${shiftId}`)
  }

  const handleCancelShift = (shiftId: string) => {
    setShowShiftModal(false)
    updateShift(shiftId, { status: 'cancelled' })
    success(`Shift ${shiftId} has been cancelled`)
  }

  const handleSwapRequested = (swapData: any) => {
    // In a real app, this would be added to the pending approvals in the backend
    // For now, we'll just show success feedback
    setShowShiftSwapModal(false)
  }

  const handleRequestTimeOffClick = () => {
    success('General time off request form would open here')
  }
  
  // TEMPORARY: Always show all shifts to debug
  const shifts = storeShifts

  // Get unique roles and statuses for filter options
  const uniqueRoles = [...new Set(storeShifts.map(shift => shift.role))]
  const uniqueStatuses = [...new Set(storeShifts.map(shift => shift.status))]



  // If we have no shifts at all, show a loading or error state
  if (!storeShifts || storeShifts.length === 0) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts available</h3>
          <p className="text-gray-500">The shift store appears to be empty.</p>
          <p className="text-sm text-gray-400 mt-2">Store shifts length: {storeShifts?.length || 0}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {canViewAllShifts() ? t('schedule.allSchedules') : t('schedule.mySchedule')}
        </h1>
        
        <div className="flex items-center space-x-4">
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="">{t('schedule.allRoles')}</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="">{t('schedule.allStatus')}</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('schedule.listView')}
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('schedule.calendarView')}
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {shifts.map((shift) => (
            <div 
              key={shift.id} 
              className="card cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleShiftClick(shift)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Calendar className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {format(shift.date, 'EEEE, MMMM d')}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {shift.role}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      shift.status === 'scheduled'
                        ? 'bg-green-100 text-green-800'
                        : shift.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : shift.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {shift.status === 'scheduled' && t('schedule.scheduled')}
                    {shift.status === 'pending' && t('schedule.pending')}
                    {shift.status === 'cancelled' && t('schedule.cancelled')}
                    {shift.status === 'completed' && t('schedule.completed')}
                    {shift.status === 'no_show' && t('schedule.noShow')}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {shifts.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('schedule.noShiftsFound')}</h3>
              <p className="text-gray-500">{t('schedule.tryAdjustingFilters')}</p>
            </div>
          )}
        </div>
      ) : (
        <CalendarView 
          shifts={shifts} 
          onShiftClick={handleShiftClick}
        />
      )}

      {/* Request Time Off Button */}
      <div className="mt-6">
        <button className="btn-primary" onClick={handleRequestTimeOffClick}>
          {t('schedule.requestTimeOff')}
        </button>
      </div>

      {/* Shift Detail Modal */}
      <ShiftModal
        shift={selectedShift}
        isOpen={showShiftModal}
        onClose={() => setShowShiftModal(false)}
        onRequestTimeOff={handleRequestTimeOff}
        onRequestSwap={handleRequestSwap}
        onEditShift={handleEditShift}
        onCancelShift={handleCancelShift}
      />

      {/* Shift Swap Modal */}
      {selectedShift && (
        <ShiftSwapModal
          isOpen={showShiftSwapModal}
          onClose={() => setShowShiftSwapModal(false)}
          originalShift={selectedShift}
          onSwapRequested={handleSwapRequested}
        />
      )}
    </div>
  )
} 