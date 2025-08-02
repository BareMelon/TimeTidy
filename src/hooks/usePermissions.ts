import { useAuthStore } from '@/stores/authStore'
import { UserRole } from '@/types'

export function usePermissions() {
  const { user } = useAuthStore()

  const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role)
    }
    
    return user.role === requiredRole
  }

  const canManageUsers = (): boolean => {
    return hasRole(['admin', 'manager'])
  }

  const canCreateShifts = (): boolean => {
    return hasRole(['admin', 'manager'])
  }

  const canApproveRequests = (): boolean => {
    return hasRole(['admin', 'manager'])
  }

  const canViewAllShifts = (): boolean => {
    return hasRole(['admin', 'manager'])
  }

  const canManageLocations = (): boolean => {
    return hasRole('admin')
  }

  const canManagePayroll = (): boolean => {
    return hasRole('admin')
  }

  const canAccessAdminPanel = (): boolean => {
    return hasRole('admin')
  }

  const canManageShifts = (): boolean => {
    return hasRole(['admin', 'manager'])
  }

  const canEditUser = (targetUserId: string): boolean => {
    if (!user) return false
    
    // Users can edit themselves
    if (user.id === targetUserId) return true
    
    // Admins can edit anyone
    if (user.role === 'admin') return true
    
    // Managers can edit employees (you'd need to check the target user's role)
    return false
  }

  const canViewUser = (targetUserId: string): boolean => {
    if (!user) return false
    
    // Users can view themselves
    if (user.id === targetUserId) return true
    
    // Admins and managers can view anyone
    return hasRole(['admin', 'manager'])
  }

  return {
    user,
    hasRole,
    canManageUsers,
    canCreateShifts,
    canApproveRequests,
    canViewAllShifts,
    canManageShifts,
    canViewAllReports: () => hasRole(['admin', 'manager']),
    canManageLocations,
    canManagePayroll,
    canAccessAdminPanel,
    canEditUser,
    canViewUser,
  }
} 