import { useState } from 'react'
import { Calendar, Clock, Plus, Edit, Trash2, Filter, Search, Users } from 'lucide-react'
import { format, isToday, isTomorrow, startOfWeek, endOfWeek } from 'date-fns'
import { usePermissions } from '@/hooks/usePermissions'
import { mockUsers, getLocationById } from '@/lib/mock-data'
import { Shift } from '@/types'
import { useToast } from '@/components/Toast'
import { useShiftStore } from '@/stores/shiftStore'
import { useLanguageStore } from '@/stores/languageStore'
import CreateShiftModal from '@/components/CreateShiftModal'

interface ShiftManagementProps {
  className?: string
}

export default function ShiftManagement({ className = '' }: ShiftManagementProps) {
  const { canManageShifts } = usePermissions()
  const { success, error } = useToast()
  const { shifts, updateShift, deleteShift, addShift } = useShiftStore()
  const { t } = useLanguageStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [locationFilter, setLocationFilter] = useState<string>('')
  const [selectedShifts, setSelectedShifts] = useState<string[]>([])
  const [showCreateShift, setShowCreateShift] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)

  // Get upcoming shifts for the next 7 days
  const weekStart = startOfWeek(new Date())
  const weekEnd = endOfWeek(new Date())
  
  const filteredShifts = shifts
    .filter(shift => {
      if (searchTerm) {
        const user = mockUsers.find(u => u.id === shift.userId)
        const userName = `${user?.firstName} ${user?.lastName}`.toLowerCase()
        return userName.includes(searchTerm.toLowerCase()) || 
               shift.role.toLowerCase().includes(searchTerm.toLowerCase())
      }
      return true
    })
    .filter(shift => statusFilter ? shift.status === statusFilter : true)
    .filter(shift => locationFilter ? shift.locationId === locationFilter : true)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  const handleShiftAction = async (action: string, shiftIds: string[]) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      switch (action) {
        case 'delete':
          shiftIds.forEach(id => deleteShift(id))
          success(`${shiftIds.length} ${t('shifts.deletedSuccessfully')}`)
          break
        case 'cancel':
          shiftIds.forEach(id => updateShift(id, { status: 'cancelled' }))
          success(`${shiftIds.length} ${t('shifts.cancelled')}`)
          break
        case 'publish':
          shiftIds.forEach(id => updateShift(id, { status: 'scheduled' }))
          success(`${shiftIds.length} ${t('shifts.published')}`)
          break
      }
      setSelectedShifts([])
    } catch (err) {
      error(t('messages.operationFailed'))
    }
  }

  const getShiftStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800'
      case 'no_show':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return t('calendar.today')
    if (isTomorrow(date)) return t('calendar.today') // We'll use "Today" for tomorrow as well in Danish
    return format(date, 'MMM d, yyyy')
  }

  const toggleShiftSelection = (shiftId: string) => {
    setSelectedShifts(prev => 
      prev.includes(shiftId) 
        ? prev.filter(id => id !== shiftId)
        : [...prev, shiftId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedShifts(
      selectedShifts.length === filteredShifts.length 
        ? [] 
        : filteredShifts.map(shift => shift.id)
    )
  }

  if (!canManageShifts()) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('messages.accessDenied')}</h3>
          <p className="text-gray-500">{t('messages.accessDenied')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">{t('shifts.management')}</h2>
          </div>
          <button
            onClick={() => setShowCreateShift(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('shifts.createShift')}
          </button>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('shifts.searchEmployees')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t('shifts.allStatus')}</option>
            <option value="scheduled">{t('schedule.scheduled')}</option>
            <option value="no_show">{t('shifts.noShow')}</option>
            <option value="cancelled">{t('schedule.cancelled')}</option>
            <option value="completed">{t('schedule.completed')}</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t('shifts.allLocations')}</option>
            <option value="1">Main Store - Downtown</option>
            <option value="2">Branch - Westside</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {filteredShifts.length} {t('shifts.shifts')}
            </span>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedShifts.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedShifts.length} {t('shifts.selected')}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleShiftAction('publish', selectedShifts)}
                  className="px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200"
                >
                  {t('shifts.publish')}
                </button>
                <button
                  onClick={() => handleShiftAction('cancel', selectedShifts)}
                  className="px-3 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-md hover:bg-yellow-200"
                >
                  {t('shifts.cancelShift')}
                </button>
                <button
                  onClick={() => handleShiftAction('delete', selectedShifts)}
                  className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                >
                  {t('shifts.deleteShift')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shifts Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedShifts.length === filteredShifts.length && filteredShifts.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('shifts.employee')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('shifts.dateTime')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.role')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('shifts.location')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('shifts.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShifts.map((shift) => {
                const user = mockUsers.find(u => u.id === shift.userId)
                const location = getLocationById(shift.locationId)
                
                return (
                  <tr key={shift.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedShifts.includes(shift.id)}
                        onChange={() => toggleShiftSelection(shift.id)}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user?.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getDateLabel(shift.date)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{shift.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{location?.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getShiftStatusColor(shift.status)}`}>
                        {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingShift(shift)
                            setShowCreateShift(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShiftAction('delete', [shift.id])}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredShifts.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('shifts.noShiftsFound')}</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter || locationFilter 
                ? t('shifts.tryAdjustingFilters')
                : t('shifts.noShiftsCreated')
              }
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">{t('shifts.totalShifts')}</h3>
            <p className="text-2xl font-bold text-blue-900">{shifts.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">{t('schedule.scheduled')}</h3>
            <p className="text-2xl font-bold text-green-900">
              {shifts.filter(s => s.status === 'scheduled').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800">{t('shifts.noShow')}</h3>
            <p className="text-2xl font-bold text-yellow-900">
              {shifts.filter(s => s.status === 'no_show').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800">{t('shifts.thisWeek')}</h3>
            <p className="text-2xl font-bold text-purple-900">
              {shifts.filter(s => s.date >= weekStart && s.date <= weekEnd).length}
            </p>
          </div>
        </div>
      </div>

      {/* Create/Edit Shift Modal */}
      <CreateShiftModal
        isOpen={showCreateShift}
        onClose={() => {
          setShowCreateShift(false)
          setEditingShift(null)
        }}
        editingShift={editingShift}
        onShiftCreated={(newShift) => {
          if (editingShift) {
            // Update existing shift
            if (Array.isArray(newShift)) {
              // Should not happen in edit mode, but handle gracefully
              updateShift(editingShift.id, newShift[0])
            } else {
              updateShift(editingShift.id, newShift)
            }
            success(t('shifts.shiftUpdated'))
          } else {
            // Create new shift(s)
            if (Array.isArray(newShift)) {
              // Multiple shifts for recurring
              newShift.forEach(shift => addShift(shift))
            } else {
              // Single shift
              addShift(newShift)
            }
          }
          setEditingShift(null)
        }}
      />
    </div>
  )
} 