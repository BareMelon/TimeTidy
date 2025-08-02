import { 
  User, 
  Location, 
  Shift, 
  CheckIn, 
  ShiftSwap, 
  TimeOffRequest,
  PayrollAddOn,
  Notification,
  DashboardStats 
} from '@/types'

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
    latitude: 55.6867,
    longitude: 12.5492,
    geofenceRadius: 75,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
]

// Mock Shifts
export const mockShifts: Shift[] = [
  {
    id: '1',
    userId: '2',
    locationId: '1',
    date: new Date('2024-12-25'), // Christmas Day
    startTime: '09:00',
    endTime: '17:00',
    role: 'Cashier',
    status: 'scheduled',
    notes: 'Morning shift',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '2',
    userId: '2',
    locationId: '1',
    date: new Date('2024-12-26'), // Boxing Day
    startTime: '13:00',
    endTime: '21:00',
    role: 'Floor Associate',
    status: 'scheduled',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '3',
    userId: '3',
    locationId: '1',
    date: new Date('2024-12-27'), // Day after Boxing Day
    startTime: '10:00',
    endTime: '18:00',
    role: 'Supervisor',
    status: 'scheduled',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '4',
    userId: '1',
    locationId: '1',
    date: new Date('2024-12-28'),
    startTime: '08:00',
    endTime: '16:00',
    role: 'Manager',
    status: 'scheduled',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '5',
    userId: '4',
    locationId: '2',
    date: new Date('2024-12-29'),
    startTime: '14:00',
    endTime: '22:00',
    role: 'Cashier',
    status: 'scheduled',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '6',
    userId: '2',
    locationId: '1',
    date: new Date('2024-12-30'),
    startTime: '09:00',
    endTime: '17:00',
    role: 'Cashier',
    status: 'scheduled',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '7',
    userId: '3',
    locationId: '1',
    date: new Date('2024-12-31'),
    startTime: '10:00',
    endTime: '18:00',
    role: 'Supervisor',
    status: 'scheduled',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '8',
    userId: '1',
    locationId: '1',
    date: new Date('2025-01-01'),
    startTime: '08:00',
    endTime: '16:00',
    role: 'Manager',
    status: 'scheduled',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '9',
    userId: '2',
    locationId: '1',
    date: new Date('2025-01-02'),
    startTime: '09:00',
    endTime: '17:00',
    role: 'Cashier',
    status: 'scheduled',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '10',
    userId: '4',
    locationId: '2',
    date: new Date('2025-01-03'),
    startTime: '14:00',
    endTime: '22:00',
    role: 'Cashier',
    status: 'scheduled',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
]

// Mock Check-ins
export const mockCheckIns: CheckIn[] = [
  {
    id: '1',
    userId: '2',
    shiftId: '1',
    locationId: '1',
    checkInTime: new Date('2024-12-20T09:02:00'),
    checkOutTime: new Date('2024-12-20T17:05:00'),
    latitude: 55.6761,
    longitude: 12.5683,
    breakDuration: 30,
    overtimeMinutes: 5,
    createdAt: new Date('2024-12-20T09:02:00'),
    updatedAt: new Date('2024-12-20T17:05:00'),
  },
]

// Mock Shift Swaps
export const mockShiftSwaps: ShiftSwap[] = [
  {
    id: '1',
    requesterId: '2',
    originalShiftId: '2',
    targetUserId: '3',
    reason: 'Family emergency',
    status: 'pending',
    deadline: new Date('2024-12-21T12:00:00'),
    createdAt: new Date('2024-12-20T10:00:00'),
    updatedAt: new Date('2024-12-20T10:00:00'),
  },
]

// Mock Time Off Requests
export const mockTimeOffRequests: TimeOffRequest[] = [
  {
    id: '1',
    userId: '2',
    shiftId: '3',
    reason: 'Doctor appointment',
    status: 'pending',
    createdAt: new Date('2024-12-19T14:00:00'),
    updatedAt: new Date('2024-12-19T14:00:00'),
  },
  {
    id: '2',
    userId: '3',
    shiftId: '7',
    reason: 'Family vacation',
    status: 'approved',
    reviewedBy: '1',
    reviewedAt: new Date('2024-12-20T10:00:00'),
    reviewNotes: 'Approved for vacation',
    createdAt: new Date('2024-12-18T09:00:00'),
    updatedAt: new Date('2024-12-20T10:00:00'),
  },
  {
    id: '3',
    userId: '4',
    shiftId: '10',
    reason: 'Medical leave',
    status: 'approved',
    reviewedBy: '1',
    reviewedAt: new Date('2024-12-21T14:00:00'),
    reviewNotes: 'Approved for medical reasons',
    createdAt: new Date('2024-12-20T16:00:00'),
    updatedAt: new Date('2024-12-21T14:00:00'),
  },
]

// Mock Payroll Add-ons
export const mockPayrollAddOns: PayrollAddOn[] = [
  {
    id: '1',
    name: 'Night Shift Premium',
    type: 'percentage',
    value: 15,
    description: '15% extra for shifts starting after 6 PM',
    isActive: true,
    appliedToAll: false,
    conditions: [
      {
        field: 'time',
        operator: 'greater_than',
        value: '18:00',
      },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Weekend Bonus',
    type: 'fixed',
    value: 50,
    description: 'DKK 50 bonus for weekend shifts',
    isActive: true,
    appliedToAll: true,
    conditions: [
      {
        field: 'day_of_week',
        operator: 'in',
        value: ['0', '6'], // Sunday and Saturday
      },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Supervisor Allowance',
    type: 'percentage',
    value: 10,
    description: '10% extra for supervisor role',
    isActive: true,
    appliedToAll: false,
    conditions: [
      {
        field: 'role',
        operator: 'equals',
        value: 'Supervisor',
      },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    type: 'shift_reminder',
    title: 'Shift Reminder',
    message: 'Your shift starts in 1 hour (9:00 AM)',
    isRead: false,
    actionUrl: '/checkin',
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: '2',
    userId: '3',
    type: 'swap_request',
    title: 'Shift Swap Request',
    message: 'John Doe wants to swap shifts with you',
    isRead: false,
    actionUrl: '/admin?tab=approvals',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '3',
    userId: '2',
    type: 'announcement',
    title: 'Store Update',
    message: 'New uniforms will be distributed next week',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  hoursToday: 7.5,
  hoursThisWeek: 32.5,
  teamOnline: 8,
  tasksCompleted: 12,
  upcomingShifts: 3,
  pendingApprovals: 2,
}

// Helper function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

// Helper function to get location by ID
export const getLocationById = (id: string): Location | undefined => {
  return mockLocations.find(location => location.id === id)
}

// Helper function to get shifts for a user
export const getShiftsForUser = (userId: string): Shift[] => {
  return mockShifts.filter(shift => shift.userId === userId)
}

// Helper function to get current user (mock authentication)
export const getCurrentUser = (): User => {
  return mockUsers[1] // John Doe as default logged-in user
}

// Helper function to authenticate user
export const authenticateUser = (username: string, password: string): User | null => {
  // Specific credentials for Administrator
  if (username === 'Administrator' && password === 'Ju78342107') {
    return mockUsers[0] // Return Administrator user
  }
  
  // Demo credentials for John Doe (employee)
  if (username === 'jdoe' && password === 'password123') {
    return mockUsers[1] // Return John Doe
  }
  
  // Demo credentials for Jane Smith (manager) 
  if (username === 'jsmith' && password === 'manager456') {
    return mockUsers[2] // Return Jane Smith
  }
  
  // Demo credentials for temporary user
  if (username === 'guest12345' && password === 'temporary123') {
    return mockUsers[3] // Return temporary employee
  }
  
  // No valid credentials found
  return null
}

// Helper function to get pending approvals
export const getPendingApprovals = () => {
  return {
    shiftSwaps: mockShiftSwaps.filter(swap => swap.status === 'pending'),
    timeOffRequests: mockTimeOffRequests.filter(request => request.status === 'pending'),
  }
}

// Helper function to get user's current time off status
export const getUserTimeOffStatus = (userId: string) => {
  const approvedTimeOff = mockTimeOffRequests.filter(
    request => request.userId === userId && request.status === 'approved'
  )

  if (approvedTimeOff.length === 0) {
    return null
  }

  // Get the associated shifts for the approved time off
  const timeOffShifts = approvedTimeOff.map(request => {
    const shift = mockShifts.find(s => s.id === request.shiftId)
    return { request, shift }
  }).filter(item => item.shift)

  if (timeOffShifts.length === 0) {
    return null
  }

  // Find the latest end date
  const latestShift = timeOffShifts.reduce((latest, current) => {
    if (!latest.shift || !current.shift) return latest
    return current.shift.date > latest.shift.date ? current : latest
  })

  return {
    isOnTimeOff: true,
    endDate: latestShift.shift?.date,
    reason: latestShift.request.reason,
  }
}

// Helper function to check if a user is available for a shift date
export const isUserAvailableForShift = (userId: string, shiftDate: Date) => {
  const timeOffStatus = getUserTimeOffStatus(userId)
  
  if (!timeOffStatus || !timeOffStatus.endDate) {
    return { available: true, warning: null }
  }

  if (shiftDate <= timeOffStatus.endDate) {
    return {
      available: false,
      warning: `User is on time off until ${timeOffStatus.endDate.toLocaleDateString()}. Reason: ${timeOffStatus.reason}`,
    }
  }

  return { available: true, warning: null }
} 