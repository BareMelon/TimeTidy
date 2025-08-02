import { Router, Request, Response } from 'express'
import { ApiResponse, DashboardStats } from '../types'
import { mockDashboardStats, getPendingApprovals } from '../utils/mockData'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// GET /api/dashboard/stats
router.get('/stats', (req: Request, res: Response) => {
  try {
    const response: ApiResponse<DashboardStats> = {
      data: mockDashboardStats,
      success: true,
      message: 'Dashboard stats retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// GET /api/dashboard/approvals
router.get('/approvals', (req: Request, res: Response) => {
  try {
    const pendingApprovals = getPendingApprovals()

    const response: ApiResponse<any> = {
      data: pendingApprovals,
      success: true,
      message: 'Pending approvals retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get pending approvals error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 