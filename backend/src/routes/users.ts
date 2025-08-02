import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { ApiResponse, User, UserFilters, CreateUserForm } from '../types'
import { mockUsers, getUserById } from '../utils/mockData'
import { authenticateToken, requireManager, AuthenticatedRequest } from '../middleware/auth'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken as any)

// GET /api/users
router.get('/', (req: Request, res: Response): void => {
  try {
    const filters: UserFilters = req.query as any
    let filteredUsers = [...mockUsers]

    // Apply filters
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role)
    }

    if (filters.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredUsers = filteredUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      )
    }

    const response: ApiResponse<User[]> = {
      data: filteredUsers,
      success: true,
      message: 'Users retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// GET /api/users/:id
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const { id } = req.params
    const user = getUserById(id)

    if (!user) {
      res.status(404).json({
        data: null,
        success: false,
        message: 'User not found'
      })
      return
    }

    const response: ApiResponse<User> = {
      data: user,
      success: true,
      message: 'User retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// POST /api/users
router.post('/', requireManager as any, [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('role').isIn(['admin', 'manager', 'employee']).withMessage('Valid role is required')
], (req: Request, res: Response): void => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({
        data: null,
        success: false,
        message: 'Validation failed',
        errors: errors.array().reduce((acc: any, error: any) => {
          acc[error.path] = [error.msg]
          return acc
        }, {})
      })
      return
    }

    const userData: CreateUserForm = req.body

    // Check if username already exists
    const existingUser = mockUsers.find(u => u.username === userData.username)
    if (existingUser) {
      res.status(400).json({
        data: null,
        success: false,
        message: 'Username already exists'
      })
      return
    }

    // Check if email already exists
    const existingEmail = mockUsers.find(u => u.email === userData.email)
    if (existingEmail) {
      res.status(400).json({
        data: null,
        success: false,
        message: 'Email already exists'
      })
      return
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      isActive: true,
      isTemporary: userData.isTemporary || false,
      mustResetPassword: userData.isTemporary || false,
      hourlyRate: userData.hourlyRate,
      phone: userData.phone,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add to mock data (in real app, save to database)
    mockUsers.push(newUser)

    const response: ApiResponse<User> = {
      data: newUser,
      success: true,
      message: 'User created successfully'
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('Create user error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// PUT /api/users/:id
router.put('/:id', requireManager as any, (req: Request, res: Response): void => {
  try {
    const { id } = req.params
    const updateData = req.body

    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      res.status(404).json({
        data: null,
        success: false,
        message: 'User not found'
      })
      return
    }

    // Update user
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updateData,
      updatedAt: new Date()
    }

    const response: ApiResponse<User> = {
      data: mockUsers[userIndex],
      success: true,
      message: 'User updated successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// DELETE /api/users/:id
router.delete('/:id', requireManager as any, (req: Request, res: Response): void => {
  try {
    const { id } = req.params

    const userIndex = mockUsers.findIndex(u => u.id === id)
    if (userIndex === -1) {
      res.status(404).json({
        data: null,
        success: false,
        message: 'User not found'
      })
      return
    }

    // Remove user
    mockUsers.splice(userIndex, 1)

    const response: ApiResponse<null> = {
      data: null,
      success: true,
      message: 'User deleted successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 