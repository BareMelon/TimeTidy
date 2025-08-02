import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import { ApiResponse, LoginForm, User, JWTPayload } from '../types'
import { authenticateUser, mockUsers } from '../utils/mockData'

const router = Router()

// Generate JWT token
const generateToken = (user: User): string => {
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
    role: user.role
  }
  
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here'
  return jwt.sign(payload, secret, { expiresIn: '24h' })
}

// Login validation
const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
]

// POST /api/auth/login
router.post('/login', loginValidation, async (req: Request, res: Response): Promise<void> => {
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

    const { username, password }: LoginForm = req.body

    // Authenticate user
    const user = authenticateUser(username, password)
    
    if (!user) {
      res.status(401).json({
        data: null,
        success: false,
        message: 'Invalid credentials'
      })
      return
    }

    // Update last login
    user.lastLoginAt = new Date()

    // Generate token
    const token = generateToken(user)

    const response: ApiResponse<User> = {
      data: user,
      success: true,
      message: 'Login successful'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response): void => {
  try {
    const response: ApiResponse<null> = {
      data: null,
      success: true,
      message: 'Logout successful'
    }
    
    res.status(200).json(response)
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// GET /api/auth/me
router.get('/me', (req: Request, res: Response): void => {
  try {
    const authHeader = req.headers['authorization'] as string
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      res.status(401).json({
        data: null,
        success: false,
        message: 'No token provided'
      })
      return
    }

    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here'
    const decoded = jwt.verify(token, secret) as JWTPayload
    
    const user = mockUsers.find(u => u.id === decoded.userId)
    
    if (!user) {
      res.status(401).json({
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
    res.status(401).json({
      data: null,
      success: false,
      message: 'Invalid token'
    })
  }
})

// POST /api/auth/refresh
router.post('/refresh', (req: Request, res: Response): void => {
  try {
    const authHeader = req.headers['authorization'] as string
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      res.status(401).json({
        data: null,
        success: false,
        message: 'No token provided'
      })
      return
    }

    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here'
    const decoded = jwt.verify(token, secret) as JWTPayload
    
    const user = mockUsers.find(u => u.id === decoded.userId)
    
    if (!user) {
      res.status(401).json({
        data: null,
        success: false,
        message: 'User not found'
      })
      return
    }

    // Generate new token
    const newToken = generateToken(user)

    const response: ApiResponse<{ token: string }> = {
      data: { token: newToken },
      success: true,
      message: 'Token refreshed successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(401).json({
      data: null,
      success: false,
      message: 'Invalid token'
    })
  }
})

export default router 