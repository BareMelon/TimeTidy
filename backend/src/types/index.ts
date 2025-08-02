// User Management Types
export type UserRole = 'admin' | 'manager' | 'employee'

export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  isTemporary: boolean
  mustResetPassword: boolean
  hourlyRate?: number
  phone?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface UserProfile extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  preferredLanguage: 'en' | 'da'
  darkMode: boolean
  notificationPreferences: NotificationPreferences
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  shiftReminders: boolean
  swapRequests: boolean
  announcements: boolean
}

// Location Types
export interface Location {
  id: string
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  latitude?: number
  longitude?: number
  geofenceRadius?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Shift Management Types
export type ShiftStatus = 'scheduled' | 'pending' | 'completed' | 'cancelled' | 'no_show'
export type SwapStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type TimeOffStatus = 'pending' | 'approved' | 'rejected'

export interface Shift {
  id: string
  userId: string
  locationId: string
  date: Date
  startTime: string // HH:mm format
  endTime: string   // HH:mm format
  role: string
  status: ShiftStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
  
  // Relations
  user?: User
  location?: Location
  checkIns?: CheckIn[]
  swapRequests?: ShiftSwap[]
}

export interface RecurringShift {
  id: string
  userId: string
  locationId: string
  startDate: Date
  endDate?: Date
  daysOfWeek: number[] // 0 = Sunday, 1 = Monday, etc.
  startTime: string
  endTime: string
  role: string
  interval: number // weeks between occurrences
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Time Tracking Types
export interface CheckIn {
  id: string
  userId: string
  shiftId?: string
  locationId: string
  checkInTime: Date
  checkOutTime?: Date
  latitude?: number
  longitude?: number
  notes?: string
  breakDuration?: number // minutes
  overtimeMinutes?: number
  createdAt: Date
  updatedAt: Date
  
  // Relations
  user?: User
  shift?: Shift
  location?: Location
  breaks?: Break[]
}

export interface Break {
  id: string
  checkInId: string
  startTime: Date
  endTime?: Date
  type: 'lunch' | 'break' | 'other'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Shift Swap Types
export interface ShiftSwap {
  id: string
  requesterId: string
  originalShiftId: string
  targetUserId?: string // null for open swap
  targetShiftId?: string // for direct swap
  reason?: string
  status: SwapStatus
  reviewedBy?: string
  reviewedAt?: Date
  reviewNotes?: string
  deadline?: Date
  createdAt: Date
  updatedAt: Date
  
  // Relations
  requester?: User
  originalShift?: Shift
  targetUser?: User
  targetShift?: Shift
  reviewer?: User
}

// Time Off Types
export interface TimeOffRequest {
  id: string
  userId: string
  shiftId: string
  reason?: string
  status: TimeOffStatus
  reviewedBy?: string
  reviewedAt?: Date
  reviewNotes?: string
  createdAt: Date
  updatedAt: Date
  
  // Relations
  user?: User
  shift?: Shift
  reviewer?: User
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'shift_reminder' | 'swap_request' | 'approval' | 'announcement' | 'system'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: Date
  
  // Relations
  user?: User
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form Types
export interface LoginForm {
  username: string
  password: string
  rememberMe?: boolean
}

export interface ResetPasswordForm {
  currentPassword?: string
  newPassword: string
  confirmPassword: string
}

export interface CreateUserForm {
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  hourlyRate?: number
  phone?: string
  isTemporary: boolean
  temporaryPassword?: string
}

export interface CreateShiftForm {
  userId: string
  locationId: string
  date: string
  startTime: string
  endTime: string
  role: string
  notes?: string
  isRecurring?: boolean
  recurringEndDate?: string
  daysOfWeek?: number[]
  interval?: number
}

export interface SwapRequestForm {
  originalShiftId: string
  targetUserId?: string
  targetShiftId?: string
  reason?: string
  deadline?: string
}

export interface TimeOffRequestForm {
  shiftId: string
  reason?: string
}

// Filter and Query Types
export interface ShiftFilters {
  userId?: string
  locationId?: string
  startDate?: string
  endDate?: string
  status?: ShiftStatus
  role?: string
}

export interface UserFilters {
  role?: UserRole
  isActive?: boolean
  locationId?: string
  search?: string
}

export interface CheckInFilters {
  userId?: string
  locationId?: string
  startDate?: string
  endDate?: string
  includeActive?: boolean
}

// Statistics Types
export interface DashboardStats {
  hoursToday: number
  hoursThisWeek: number
  teamOnline: number
  tasksCompleted: number
  upcomingShifts: number
  pendingApprovals: number
}

export interface UserStats {
  totalHours: number
  overtimeHours: number
  shiftsCompleted: number
  averageHoursPerWeek: number
  punctualityScore: number
}

export interface LocationStats {
  totalEmployees: number
  activeEmployees: number
  totalShifts: number
  coveragePercentage: number
  averageShiftLength: number
}

// JWT Payload
export interface JWTPayload {
  userId: string
  username: string
  role: UserRole
  iat?: number
  exp?: number
}

// Request with User
export interface AuthenticatedRequest extends Request {
  user?: User
} 