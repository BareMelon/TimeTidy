import { 
  User, 
  Shift, 
  CheckIn, 
  ShiftSwap, 
  TimeOffRequest,
  ApiResponse,
  PaginatedResponse,
  LoginForm,
  CreateUserForm,
  CreateShiftForm,
  SwapRequestForm,
  TimeOffRequestForm,
  ShiftFilters,
  UserFilters,
  DashboardStats
} from '@/types'

import {
  mockUsers,
  mockShifts,
  mockCheckIns,
  mockShiftSwaps,
  mockTimeOffRequests,
  mockDashboardStats,
  mockNotifications,
  mockLocations,
  mockPayrollAddOns
} from './mock-data'

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API base URL
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api'

// API client class
class ApiClient {
  private baseURL: string
  private authToken: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.authToken = localStorage.getItem('auth-token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Add authentication header if token exists
    const headers = {
      'Content-Type': 'application/json',
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      ...options.headers,
    }

    try {
      // Mock API - simulate network delay
      await delay(300)

      // For demo purposes, return mock data instead of making real requests
      return this.mockResponse<T>(endpoint, options)
    } catch (error) {
      throw new Error(`API Error: ${error}`)
    }
  }

  private mockResponse<T>(endpoint: string, options: RequestInit): ApiResponse<T> {
    const method = options.method || 'GET'
    const [resource] = endpoint.split('/').filter(Boolean)

    // Mock authentication
    if (endpoint === 'auth/login') {
      this.authToken = 'mock-jwt-token'
      localStorage.setItem('auth-token', this.authToken)
      return {
        data: mockUsers[1] as T, // Return John Doe
        success: true,
        message: 'Login successful'
      }
    }

    if (endpoint === 'auth/logout') {
      this.authToken = null
      localStorage.removeItem('auth-token')
      return {
        data: null as T,
        success: true,
        message: 'Logout successful'
      }
    }

    // Mock resource endpoints
    switch (resource) {
      case 'users':
        if (method === 'GET') {
          return { data: mockUsers as T, success: true }
        }
        if (method === 'POST') {
          const newUser = { id: Date.now().toString(), ...JSON.parse(options.body as string) }
          return { data: newUser as T, success: true }
        }
        break

      case 'shifts':
        if (method === 'GET') {
          return { data: mockShifts as T, success: true }
        }
        if (method === 'POST') {
          const newShift = { id: Date.now().toString(), ...JSON.parse(options.body as string) }
          return { data: newShift as T, success: true }
        }
        break

      case 'checkins':
        if (method === 'GET') {
          return { data: mockCheckIns as T, success: true }
        }
        if (method === 'POST') {
          const newCheckIn = { id: Date.now().toString(), ...JSON.parse(options.body as string) }
          return { data: newCheckIn as T, success: true }
        }
        break

      case 'dashboard':
        return { data: mockDashboardStats as T, success: true }

      default:
        return { data: [] as T, success: true }
    }

    return { data: [] as T, success: true }
  }

  // Authentication endpoints
  async login(credentials: LoginForm): Promise<ApiResponse<User>> {
    return this.request<User>('auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request<null>('auth/logout', {
      method: 'POST',
    })
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('auth/refresh', {
      method: 'POST',
    })
  }

  // User endpoints
  async getUsers(filters?: UserFilters): Promise<ApiResponse<User[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters as any)}` : ''
    return this.request<User[]>(`users${queryParams}`)
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`users/${id}`)
  }

  async createUser(userData: CreateUserForm): Promise<ApiResponse<User>> {
    return this.request<User>('users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`users/${id}`, {
      method: 'DELETE',
    })
  }

  // Shift endpoints
  async getShifts(filters?: ShiftFilters): Promise<ApiResponse<Shift[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters as any)}` : ''
    return this.request<Shift[]>(`shifts${queryParams}`)
  }

  async getShiftById(id: string): Promise<ApiResponse<Shift>> {
    return this.request<Shift>(`shifts/${id}`)
  }

  async createShift(shiftData: CreateShiftForm): Promise<ApiResponse<Shift>> {
    return this.request<Shift>('shifts', {
      method: 'POST',
      body: JSON.stringify(shiftData),
    })
  }

  async updateShift(id: string, shiftData: Partial<Shift>): Promise<ApiResponse<Shift>> {
    return this.request<Shift>(`shifts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(shiftData),
    })
  }

  async deleteShift(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`shifts/${id}`, {
      method: 'DELETE',
    })
  }

  // Check-in endpoints
  async checkIn(locationId: string, shiftId?: string): Promise<ApiResponse<CheckIn>> {
    return this.request<CheckIn>('checkins', {
      method: 'POST',
      body: JSON.stringify({ locationId, shiftId, checkInTime: new Date() }),
    })
  }

  async checkOut(checkInId: string): Promise<ApiResponse<CheckIn>> {
    return this.request<CheckIn>(`checkins/${checkInId}`, {
      method: 'PUT',
      body: JSON.stringify({ checkOutTime: new Date() }),
    })
  }

  async getCheckIns(filters?: any): Promise<ApiResponse<CheckIn[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : ''
    return this.request<CheckIn[]>(`checkins${queryParams}`)
  }

  // Shift swap endpoints
  async createShiftSwap(swapData: SwapRequestForm): Promise<ApiResponse<ShiftSwap>> {
    return this.request<ShiftSwap>('shift-swaps', {
      method: 'POST',
      body: JSON.stringify(swapData),
    })
  }

  async approveShiftSwap(id: string, approved: boolean): Promise<ApiResponse<ShiftSwap>> {
    return this.request<ShiftSwap>(`shift-swaps/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approved }),
    })
  }

  async getShiftSwaps(): Promise<ApiResponse<ShiftSwap[]>> {
    return this.request<ShiftSwap[]>('shift-swaps')
  }

  // Time off endpoints
  async createTimeOffRequest(requestData: TimeOffRequestForm): Promise<ApiResponse<TimeOffRequest>> {
    return this.request<TimeOffRequest>('time-off-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
  }

  async approveTimeOffRequest(id: string, approved: boolean): Promise<ApiResponse<TimeOffRequest>> {
    return this.request<TimeOffRequest>(`time-off-requests/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approved }),
    })
  }

  async getTimeOffRequests(): Promise<ApiResponse<TimeOffRequest[]>> {
    return this.request<TimeOffRequest[]>('time-off-requests')
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>('dashboard/stats')
  }

  // Location endpoints
  async getLocations(): Promise<ApiResponse<Location[]>> {
    return this.request<Location[]>('locations')
  }

  // Payroll endpoints
  async getPayrollAddOns(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('payroll/add-ons')
  }

  async calculatePayroll(userId: string, startDate: string, endDate: string): Promise<ApiResponse<any>> {
    return this.request<any>(`payroll/calculate`, {
      method: 'POST',
      body: JSON.stringify({ userId, startDate, endDate }),
    })
  }
}

// Create and export API client instance
export const api = new ApiClient(API_BASE_URL)

// Export individual service functions for easier use
export const authService = {
  login: (credentials: LoginForm) => api.login(credentials),
  logout: () => api.logout(),
  refreshToken: () => api.refreshToken(),
}

export const userService = {
  getUsers: (filters?: UserFilters) => api.getUsers(filters),
  getUserById: (id: string) => api.getUserById(id),
  createUser: (userData: CreateUserForm) => api.createUser(userData),
  updateUser: (id: string, userData: Partial<User>) => api.updateUser(id, userData),
  deleteUser: (id: string) => api.deleteUser(id),
}

export const shiftService = {
  getShifts: (filters?: ShiftFilters) => api.getShifts(filters),
  getShiftById: (id: string) => api.getShiftById(id),
  createShift: (shiftData: CreateShiftForm) => api.createShift(shiftData),
  updateShift: (id: string, shiftData: Partial<Shift>) => api.updateShift(id, shiftData),
  deleteShift: (id: string) => api.deleteShift(id),
}

export const checkInService = {
  checkIn: (locationId: string, shiftId?: string) => api.checkIn(locationId, shiftId),
  checkOut: (checkInId: string) => api.checkOut(checkInId),
  getCheckIns: (filters?: any) => api.getCheckIns(filters),
}

export const dashboardService = {
  getStats: () => api.getDashboardStats(),
}

// Default export
export default api 