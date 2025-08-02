import { ReactNode } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
  fallback?: ReactNode
  requireAuth?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback,
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, hasRole } = usePermissions()

  // Check if user is authenticated (if required)
  if (requireAuth && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Authentication Required</h2>
          <p className="text-gray-600 mt-2">Please log in to access this page.</p>
        </div>
      </div>
    )
  }

  // Check role-based permissions
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Required role: {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 