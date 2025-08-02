import { User, UserRole } from '@/types'

/**
 * Generate a random username for temporary users
 */
export function generateTempUsername(): string {
  const prefix = 'guest'
  const randomNumber = Math.floor(10000 + Math.random() * 90000) // 5-digit number
  return `${prefix}${randomNumber}`
}

/**
 * Generate a temporary password
 */
export function generateTempPassword(): string {
  return 'temporary123' // Simple default - in real app, could be more complex
}

/**
 * Create a new temporary user
 */
export function createTempUser(overrides?: Partial<User>): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  const username = generateTempUsername()
  const now = new Date()
  
  return {
    username,
    email: `${username}@temp.timetidy.com`,
    firstName: 'Temporary',
    lastName: 'Employee',
    role: 'employee' as UserRole,
    isActive: true,
    isTemporary: true,
    mustResetPassword: true,
    hourlyRate: 16.00, // Default temp employee rate
    phone: undefined,
    avatar: undefined,
    lastLoginAt: undefined,
    ...overrides, // Allow overriding any fields
  }
}

/**
 * Create a new permanent employee
 */
export function createEmployee(
  firstName: string,
  lastName: string,
  email: string,
  role: UserRole = 'employee',
  hourlyRate: number = 18.00
): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  // Generate username from name
  const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`
    .replace(/[^a-z0-9]/g, '') // Remove special characters
    .substring(0, 20) // Limit length
  
  return {
    username,
    email,
    firstName,
    lastName,
    role,
    isActive: true,
    isTemporary: false,
    mustResetPassword: true, // New employees must set their own password
    hourlyRate,
    phone: undefined,
    avatar: undefined,
    lastLoginAt: undefined,
  }
}

/**
 * Validate employee data before creation
 */
export function validateEmployeeData(data: {
  firstName: string
  lastName: string
  email: string
  role: UserRole
  hourlyRate: number
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.firstName.trim()) {
    errors.push('First name is required')
  }

  if (!data.lastName.trim()) {
    errors.push('Last name is required')
  }

  if (!data.email.trim()) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format')
  }

  if (!['admin', 'manager', 'employee'].includes(data.role)) {
    errors.push('Invalid role selected')
  }

  if (data.hourlyRate < 0 || data.hourlyRate > 1000) {
    errors.push('Hourly rate must be between 0 and 1000')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
} 