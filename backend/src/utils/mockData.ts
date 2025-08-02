import { 
  User, 
  Location, 
  Shift, 
  CheckIn, 
  ShiftSwap, 
  TimeOffRequest,
  Notification,
  DashboardStats 
} from '../types'

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'Administrator',
    email: 'admin@timetidy.com',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin',
    isActive: true,
    isTemporary: false,
    mustResetPassword: false,
    hourlyRate: 30.00,
    phone: '+45 12 34 56 78',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLoginAt: new Date('2024-12-20'),
  },
  {
    id: '2',
    username: 'jdoe',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'employee',
    isActive: true,
    isTemporary: false,
    mustResetPassword: false,
    hourlyRate: 18.50,
    phone: '+45 98 76 54 32',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    lastLoginAt: new Date('2024-12-20'),
  },
  {
    id: '3',
    username: 'jsmith',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'manager',
    isActive: true,
    isTemporary: false,
    mustResetPassword: false,
    hourlyRate: 22.00,
    phone: '+45 11 22 33 44',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    lastLoginAt: new Date('2024-12-19'),
  },
  {
    id: '4',
    username: 'guest12345',
    email: 'temp@example.com',
    firstName: 'Temp',
    lastName: 'Employee',
    role: 'employee',
    isActive: true,
    isTemporary: true,
    mustResetPassword: true,
    hourlyRate: 16.00,
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
]

// Mock Locations
export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Main Store - Downtown',
    address: '123 Main Street',
    city: 'Copenhagen',
    postalCode: '1000',
    country: 'Denmark',
    latitude: 55.6761,
    longitude: 12.5683,
    geofenceRadius: 50,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Branch Store - Nørrebro',
    address: '456 Nørrebrogade',
    city: 'Copenhagen',
    postalCode: '2200',
    country: 'Denmark',
    latitude: 55.6894,
    longitude: 12.5518,
    geofenceRadius: 50,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

// Mock Shifts
export const mockShifts: Shift[] = [
  {
    id: '1',
    userId: '2',
    locationId: '1',
    date: new Date('2024-12-23'),
    startTime: '09:00',
    endTime: '17:00',
    role: 'Cashier',
    status: 'scheduled',
    notes: 'Morning shift',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: '2',
    userId: '3',
    locationId: '1',
    date: new Date('2024-12-23'),
    startTime: '13:00',
    endTime: '21:00',
    role: 'Manager',
    status: 'scheduled',
    notes: 'Afternoon shift',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: '3',
    userId: '2',
    locationId: '2',
    date: new Date('2024-12-24'),
    startTime: '10:00',
    endTime: '18:00',
    role: 'Cashier',
    status: 'cancelled',
    notes: 'Cancelled due to holiday',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-21'),
  },
  {
    id: '4',
    userId: '3',
    locationId: '1',
    date: new Date('2024-12-25'),
    startTime: '08:00',
    endTime: '16:00',
    role: 'Manager',
    status: 'scheduled',
    notes: 'Christmas Day',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: '5',
    userId: '2',
    locationId: '1',
    date: new Date('2024-12-26'),
    startTime: '09:00',
    endTime: '17:00',
    role: 'Cashier',
    status: 'scheduled',
    notes: 'Regular shift',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: '6',
    userId: '4',
    locationId: '2',
    date: new Date('2024-12-27'),
    startTime: '14:00',
    endTime: '22:00',
    role: 'Cashier',
    status: 'scheduled',
    notes: 'Evening shift',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: '7',
    userId: '3',
    locationId: '1',
    date: new Date('2024-12-28'),
    startTime: '09:00',
    endTime: '17:00',
    role: 'Manager',
    status: 'scheduled',
    notes: 'Weekend shift',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: '8',
    userId: '2',
    locationId: '1',
    date: new Date('2024-12-29'),
    startTime: '10:00',
    endTime: '18:00',
    role: 'Cashier',
    status: 'scheduled',
    notes: 'Regular shift',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: '9',
    userId: '4',
    locationId: '2',
    date: new Date('2024-12-30'),
    startTime: '08:00',
    endTime: '16:00',
    role: 'Cashier',
    status: 'scheduled',
    notes: 'Morning shift',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: '10',
    userId: '3',
    locationId: '1',
    date: new Date('2024-12-31'),
    startTime: '12:00',
    endTime: '20:00',
    role: 'Manager',
    status: 'scheduled',
    notes: 'New Year\'s Eve',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
]

// Mock Check-ins
export const mockCheckIns: CheckIn[] = [
  {
    id: '1',
    userId: '2',
    shiftId: '1',
    locationId: '1',
    checkInTime: new Date('2024-12-23T09:00:00Z'),
    checkOutTime: new Date('2024-12-23T17:00:00Z'),
    latitude: 55.6761,
    longitude: 12.5683,
    notes: 'On time',
    breakDuration: 60,
    overtimeMinutes: 0,
    createdAt: new Date('2024-12-23T09:00:00Z'),
    updatedAt: new Date('2024-12-23T17:00:00Z'),
  },
  {
    id: '2',
    userId: '3',
    shiftId: '2',
    locationId: '1',
    checkInTime: new Date('2024-12-23T13:00:00Z'),
    checkOutTime: new Date('2024-12-23T21:00:00Z'),
    latitude: 55.6761,
    longitude: 12.5683,
    notes: 'Late by 5 minutes',
    breakDuration: 45,
    overtimeMinutes: 0,
    createdAt: new Date('2024-12-23T13:00:00Z'),
    updatedAt: new Date('2024-12-23T21:00:00Z'),
  },
]

// Mock Shift Swaps
export const mockShiftSwaps: ShiftSwap[] = [
  {
    id: '1',
    requesterId: '2',
    originalShiftId: '1',
    targetUserId: '4',
    reason: 'Personal emergency',
    status: 'pending',
    deadline: new Date('2024-12-22T23:59:59Z'),
    createdAt: new Date('2024-12-20T10:00:00Z'),
    updatedAt: new Date('2024-12-20T10:00:00Z'),
  },
  {
    id: '2',
    requesterId: '4',
    originalShiftId: '6',
    targetUserId: '2',
    reason: 'Need more hours',
    status: 'approved',
    reviewedBy: '3',
    reviewedAt: new Date('2024-12-20T14:00:00Z'),
    reviewNotes: 'Approved - good reason',
    deadline: new Date('2024-12-26T23:59:59Z'),
    createdAt: new Date('2024-12-20T12:00:00Z'),
    updatedAt: new Date('2024-12-20T14:00:00Z'),
  },
]

// Mock Time Off Requests
export const mockTimeOffRequests: TimeOffRequest[] = [
  {
    id: '1',
    userId: '2',
    shiftId: '5',
    reason: 'Family vacation',
    status: 'approved',
    reviewedBy: '3',
    reviewedAt: new Date('2024-12-19T15:00:00Z'),
    reviewNotes: 'Approved - advance notice given',
    createdAt: new Date('2024-12-18T10:00:00Z'),
    updatedAt: new Date('2024-12-19T15:00:00Z'),
  },
  {
    id: '2',
    userId: '4',
    shiftId: '9',
    reason: 'Medical appointment',
    status: 'pending',
    createdAt: new Date('2024-12-20T09:00:00Z'),
    updatedAt: new Date('2024-12-20T09:00:00Z'),
  },
  {
    id: '3',
    userId: '2',
    shiftId: '8',
    reason: 'Personal day',
    status: 'approved',
    reviewedBy: '3',
    reviewedAt: new Date('2024-12-20T11:00:00Z'),
    reviewNotes: 'Approved',
    createdAt: new Date('2024-12-20T08:00:00Z'),
    updatedAt: new Date('2024-12-20T11:00:00Z'),
  },
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    type: 'shift_reminder',
    title: 'Shift Reminder',
    message: 'You have a shift tomorrow at 09:00',
    isRead: false,
    actionUrl: '/schedule',
    createdAt: new Date('2024-12-22T08:00:00Z'),
  },
  {
    id: '2',
    userId: '3',
    type: 'swap_request',
    title: 'New Swap Request',
    message: 'John Doe requested a shift swap',
    isRead: false,
    actionUrl: '/admin',
    createdAt: new Date('2024-12-20T10:00:00Z'),
  },
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  hoursToday: 8.5,
  hoursThisWeek: 32.5,
  teamOnline: 3,
  tasksCompleted: 12,
  upcomingShifts: 5,
  pendingApprovals: 2,
}

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

export const getLocationById = (id: string): Location | undefined => {
  return mockLocations.find(location => location.id === id)
}

export const getShiftsForUser = (userId: string): Shift[] => {
  return mockShifts.filter(shift => shift.userId === userId)
}

export const getCurrentUser = (): User => {
  return mockUsers[1] // John Doe as default
}

export const authenticateUser = (username: string, password: string): User | null => {
  // Simple authentication for demo
  const user = mockUsers.find(u => u.username === username)
  
  if (!user) {
    return null
  }

  // For demo purposes, accept any password for existing users
  // In production, you would hash and compare passwords
  if (username === 'Administrator' && password === 'admin123') {
    return user
  }
  
  if (username === 'jdoe' && password === 'password') {
    return user
  }
  
  if (username === 'jsmith' && password === 'password') {
    return user
  }
  
  if (username === 'guest12345' && password === 'temp123') {
    return user
  }

  return null
}

export const getPendingApprovals = () => {
  return {
    shiftSwaps: mockShiftSwaps.filter(swap => swap.status === 'pending'),
    timeOffRequests: mockTimeOffRequests.filter(request => request.status === 'pending')
  }
}

export const getUserTimeOffStatus = (userId: string) => {
  const approvedRequests = mockTimeOffRequests.filter(
    request => request.userId === userId && request.status === 'approved'
  )
  
  if (approvedRequests.length === 0) {
    return null
  }

  // Get the most recent approved request
  const mostRecent = approvedRequests.sort((a, b) => 
    new Date(b.reviewedAt!).getTime() - new Date(a.reviewedAt!).getTime()
  )[0]

  const shift = mockShifts.find(s => s.id === mostRecent.shiftId)
  
  return {
    endDate: shift?.date,
    reason: mostRecent.reason
  }
}

export const isUserAvailableForShift = (userId: string, shiftDate: Date) => {
  const timeOffStatus = getUserTimeOffStatus(userId)
  
  if (!timeOffStatus || !timeOffStatus.endDate) {
    return { available: true }
  }

  const timeOffEndDate = new Date(timeOffStatus.endDate)
  const shiftDateOnly = new Date(shiftDate.getFullYear(), shiftDate.getMonth(), shiftDate.getDate())
  const timeOffEndDateOnly = new Date(timeOffEndDate.getFullYear(), timeOffEndDate.getMonth(), timeOffEndDate.getDate())

  if (shiftDateOnly <= timeOffEndDateOnly) {
    return {
      available: false,
      warning: `User is on time off until ${timeOffEndDate.toLocaleDateString()}`
    }
  }

  return { available: true }
} 