import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, JWTPayload } from '../types'
import { mockUsers } from '../utils/mockData'

export interface AuthenticatedRequest extends Request {
  user?: User
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'] as string
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({
      data: null,
      success: false,
      message: 'Access token required'
    })
    return
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here'
    const decoded = jwt.verify(token, secret) as JWTPayload
    
    // Find user in mock data
    const user = mockUsers.find(u => u.id === decoded.userId)
    
    if (!user) {
      res.status(401).json({
        data: null,
        success: false,
        message: 'User not found'
      })
      return
    }

    req.user = user
    next()
  } catch (error) {
    res.status(403).json({
      data: null,
      success: false,
      message: 'Invalid or expired token'
    })
    return
  }
}

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        data: null,
        success: false,
        message: 'Authentication required'
      })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        data: null,
        success: false,
        message: 'Insufficient permissions'
      })
      return
    }

    next()
  }
}

export const requireAdmin = requireRole(['admin'])
export const requireManager = requireRole(['admin', 'manager'])
export const requireEmployee = requireRole(['admin', 'manager', 'employee']) 