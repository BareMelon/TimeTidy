import { 
  User, 
  Location, 
  Shift, 
  CheckIn, 
  ShiftSwap, 
  TimeOffRequest,
  DashboardStats,
  ApiResponse,
  LoginForm,
  CreateUserForm,
  CreateShiftForm,
  SwapRequestForm,
  TimeOffRequestForm,
  UserFilters,
  ShiftFilters
} from '@/types'

// API base URL
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
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw new Error(`API Error: ${error}`)
    }
  }

  // Authentication methods
  async login(credentials: LoginForm): Promise<ApiResponse<User>> {
    const response = await this.request<User>('auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    
    if (response.success && response.data) {
      this.authToken = 'mock-jwt-token' // In real app, this would come from response
      localStorage.setItem('auth-token', this.authToken)
    }
    
    return response
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await this.request<null>('auth/logout', {
      method: 'POST'
    })
    
    this.authToken = null
    localStorage.removeItem('auth-token')
    
    return response
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('auth/refresh', {
      method: 'POST'
    })
  }

  // User methods
  async getUsers(filters?: UserFilters): Promise<ApiResponse<User[]>> {
    const queryParams = filters ? new URLSearchParams(filters as any).toString() : ''
    const endpoint = queryParams ? `users?${queryParams}` : 'users'
    return this.request<User[]>(endpoint)
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`users/${id}`)
  }

  async createUser(userData: CreateUserForm): Promise<ApiResponse<User>> {
    return this.request<User>('users', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    })
  }

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`users/${id}`, {
      method: 'DELETE'
    })
  }

  // Shift methods
  async getShifts(filters?: ShiftFilters): Promise<ApiResponse<Shift[]>> {
    const queryParams = filters ? new URLSearchParams(filters as any).toString() : ''
    const endpoint = queryParams ? `shifts?${queryParams}` : 'shifts'
    return this.request<Shift[]>(endpoint)
  }

  async getShiftById(id: string): Promise<ApiResponse<Shift>> {
    return this.request<Shift>(`shifts/${id}`)
  }

  async createShift(shiftData: CreateShiftForm): Promise<ApiResponse<Shift>> {
    return this.request<Shift>('shifts', {
      method: 'POST',
      body: JSON.stringify(shiftData)
    })
  }

  async updateShift(id: string, shiftData: Partial<Shift>): Promise<ApiResponse<Shift>> {
    return this.request<Shift>(`shifts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(shiftData)
    })
  }

  async deleteShift(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`shifts/${id}`, {
      method: 'DELETE'
    })
  }

  // Check-in methods
  async checkIn(locationId: string, shiftId?: string): Promise<ApiResponse<CheckIn>> {
    return this.request<CheckIn>('checkins', {
      method: 'POST',
      body: JSON.stringify({ locationId, shiftId })
    })
  }

  async checkOut(checkInId: string): Promise<ApiResponse<CheckIn>> {
    return this.request<CheckIn>(`checkins/${checkInId}/checkout`, {
      method: 'PUT'
    })
  }

  async getCheckIns(filters?: any): Promise<ApiResponse<CheckIn[]>> {
    const queryParams = filters ? new URLSearchParams(filters).toString() : ''
    const endpoint = queryParams ? `checkins?${queryParams}` : 'checkins'
    return this.request<CheckIn[]>(endpoint)
  }

  // Shift swap methods
  async createShiftSwap(swapData: SwapRequestForm): Promise<ApiResponse<ShiftSwap>> {
    return this.request<ShiftSwap>('swaps', {
      method: 'POST',
      body: JSON.stringify(swapData)
    })
  }

  async approveShiftSwap(id: string, approved: boolean): Promise<ApiResponse<ShiftSwap>> {
    return this.request<ShiftSwap>(`swaps/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approved })
    })
  }

  async getShiftSwaps(): Promise<ApiResponse<ShiftSwap[]>> {
    return this.request<ShiftSwap[]>('swaps')
  }

  // Time off methods
  async createTimeOffRequest(requestData: TimeOffRequestForm): Promise<ApiResponse<TimeOffRequest>> {
    return this.request<TimeOffRequest>('timeoff', {
      method: 'POST',
      body: JSON.stringify(requestData)
    })
  }

  async approveTimeOffRequest(id: string, approved: boolean): Promise<ApiResponse<TimeOffRequest>> {
    return this.request<TimeOffRequest>(`timeoff/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approved })
    })
  }

  async getTimeOffRequests(): Promise<ApiResponse<TimeOffRequest[]>> {
    return this.request<TimeOffRequest[]>('timeoff')
  }

  // Dashboard methods
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>('dashboard/stats')
  }

  // Location methods
  async getLocations(): Promise<ApiResponse<Location[]>> {
    return this.request<Location[]>('locations')
  }

  // Placeholder methods for future features
  async getPayrollAddOns(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('payroll/addons')
  }

  async calculatePayroll(userId: string, startDate: string, endDate: string): Promise<ApiResponse<any>> {
    return this.request<any>(`payroll/calculate`, {
      method: 'POST',
      body: JSON.stringify({ userId, startDate, endDate })
    })
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export individual methods for convenience
export const {
  login,
  logout,
  refreshToken,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  checkIn,
  checkOut,
  getCheckIns,
  createShiftSwap,
  approveShiftSwap,
  getShiftSwaps,
  createTimeOffRequest,
  approveTimeOffRequest,
  getTimeOffRequests,
  getDashboardStats,
  getLocations,
  getPayrollAddOns,
  calculatePayroll
} = apiClient 