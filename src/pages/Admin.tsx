import { useState } from 'react'
import { Users, Calendar, Settings, FileText, Plus, UserPlus } from 'lucide-react'

import { getPendingApprovals, getUserTimeOffStatus } from '@/lib/mock-data'
import { format } from 'date-fns'
import ProtectedRoute from '@/components/ProtectedRoute'
import CreateUserModal from '@/components/CreateUserModal'
import TimeOffManagement from '@/components/TimeOffManagement'
import AdminSettings from '@/components/AdminSettings'
import ShiftManagement from '@/components/ShiftManagement'
import { useToast } from '@/components/Toast'
import { useUserStore } from '@/stores/userStore'
import { useLanguageStore } from '@/stores/languageStore'
import { User } from '@/types'

function AdminContent() {
  const [activeTab, setActiveTab] = useState('users')
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [_editingUser, setEditingUser] = useState<User | null>(null)
  const [_userCreationType, setUserCreationType] = useState<'temporary' | 'permanent'>('temporary')
  const [pendingApprovals, setPendingApprovals] = useState(getPendingApprovals())
  const { success } = useToast()
  const { users, updateUser, deleteUser, addUser } = useUserStore()
  const { t } = useLanguageStore()

  const handleCreateUser = (type: 'temporary' | 'permanent') => {
    setUserCreationType(type)
    setIsCreateUserModalOpen(true)
  }

  const handleUserCreated = (newUser: any) => {
    // Add the new user to the store
    addUser(newUser)
    setIsCreateUserModalOpen(false)
    success(t('admin.userCreated'))
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditUserModalOpen(true)
  }

  const handleUserUpdated = (updatedUser: User) => {
    updateUser(updatedUser.id, updatedUser)
    setIsEditUserModalOpen(false)
    setEditingUser(null)
    success(t('admin.userUpdated'))
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      deleteUser(userId)
      success(t('admin.userDeleted'))
    }
  }



  const handleApproveRequest = (requestId: string, type: 'swap' | 'timeoff') => {
    // In a real app, this would update the request status in the backend
    if (type === 'swap') {
      setPendingApprovals(prev => ({
        ...prev,
        shiftSwaps: prev.shiftSwaps.filter(swap => swap.id !== requestId)
      }))
    } else {
      setPendingApprovals(prev => ({
        ...prev,
        timeOffRequests: prev.timeOffRequests.filter(request => request.id !== requestId)
      }))
    }
    success(`${type === 'swap' ? 'Shift swap' : 'Time off'} request approved`)
  }

  const handleRejectRequest = (requestId: string, type: 'swap' | 'timeoff') => {
    // In a real app, this would update the request status in the backend
    if (type === 'swap') {
      setPendingApprovals(prev => ({
        ...prev,
        shiftSwaps: prev.shiftSwaps.filter(swap => swap.id !== requestId)
      }))
    } else {
      setPendingApprovals(prev => ({
        ...prev,
        timeOffRequests: prev.timeOffRequests.filter(request => request.id !== requestId)
      }))
    }
    success(`${type === 'swap' ? 'Shift swap' : 'Time off'} request rejected`)
  }

  const tabs = [
    { id: 'users', name: t('admin.users'), icon: Users },
    { id: 'shifts', name: t('admin.shifts'), icon: Calendar },
    { id: 'timeoff', name: t('admin.timeoff'), icon: FileText },
    { id: 'approvals', name: t('admin.approvals'), icon: FileText },
    { id: 'settings', name: t('admin.settings'), icon: Settings },
  ]

  const totalPendingApprovals = pendingApprovals.shiftSwaps.length + pendingApprovals.timeOffRequests.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Administration</h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Management Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">{t('admin.users')}</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCreateUser('temporary')}
                  className="btn-secondary flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('admin.temporary')}
                </button>
                <button
                  onClick={() => handleCreateUser('permanent')}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('admin.permanent')}
                </button>
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {users.map((employee) => (
                <div key={employee.id} className="card flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Users className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        {(() => {
                          const timeOffStatus = getUserTimeOffStatus(employee.id)
                          return timeOffStatus && timeOffStatus.endDate ? (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {t('timeoff.onTimeOffUntil')} {format(timeOffStatus.endDate, 'MMM d')}
                            </span>
                          ) : null
                        })()}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{employee.email}</span>
                        <span>{employee.role}</span>
                        {employee.isTemporary && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            {t('users.temporary')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditUser(employee)}
                      className="text-sm text-primary-600 hover:text-primary-700 px-3 py-1 rounded border border-primary-200 hover:bg-primary-50"
                    >
                      {t('common.edit')}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(employee.id)}
                      className="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shifts' && <ShiftManagement />}

        {activeTab === 'timeoff' && <TimeOffManagement />}

        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">{t('admin.approvals')}</h2>
            
            {totalPendingApprovals === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                <p className="text-gray-500">All requests have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Shift Swap Requests */}
                {pendingApprovals.shiftSwaps.map((swap) => (
                  <div key={swap.id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Shift Swap Request</h3>
                        <p className="text-sm text-gray-500">
                          Requested on {format(swap.createdAt, 'MMM d, yyyy h:mm a')}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{swap.reason}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveRequest(swap.id, 'swap')}
                          className="btn-primary text-sm"
                        >
                          {t('timeoff.approve')}
                        </button>
                        <button
                          onClick={() => handleRejectRequest(swap.id, 'swap')}
                          className="btn-secondary text-sm"
                        >
                          {t('timeoff.reject')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Time Off Requests */}
                {pendingApprovals.timeOffRequests.map((request) => (
                  <div key={request.id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Time Off Request</h3>
                        <p className="text-sm text-gray-500">
                          Requested on {format(request.createdAt, 'MMM d, yyyy h:mm a')}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{request.reason}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveRequest(request.id, 'timeoff')}
                          className="btn-primary text-sm"
                        >
                          {t('timeoff.approve')}
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id, 'timeoff')}
                          className="btn-secondary text-sm"
                        >
                          {t('timeoff.reject')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && <AdminSettings />}
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onUserCreated={handleUserCreated}
      />

      {/* Edit User Modal */}
      <CreateUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false)
          setEditingUser(null)
        }}
        onUserCreated={handleUserUpdated}
      />
    </div>
  )
}

export default function Admin() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  )
} 