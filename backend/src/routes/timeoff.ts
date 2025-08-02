import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { ApiResponse, TimeOffRequest, TimeOffRequestForm } from '../types'
import { mockTimeOffRequests, mockShifts, getUserById } from '../utils/mockData'
import { authenticateToken, requireManager } from '../middleware/auth'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// GET /api/timeoff
router.get('/', (req: Request, res: Response) => {
  try {
    const requestsWithRelations = mockTimeOffRequests.map(request => ({
      ...request,
      user: getUserById(request.userId),
      shift: mockShifts.find(s => s.id === request.shiftId),
      reviewer: request.reviewedBy ? getUserById(request.reviewedBy) : undefined
    }))

    const response: ApiResponse<TimeOffRequest[]> = {
      data: requestsWithRelations,
      success: true,
      message: 'Time off requests retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get time off requests error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// POST /api/timeoff
router.post('/', [
  body('shiftId').notEmpty().withMessage('Shift ID is required')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        data: null,
        success: false,
        message: 'Validation failed',
        errors: errors.array().reduce((acc: any, error: any) => {
          acc[error.path] = [error.msg]
          return acc
        }, {})
      })
    }

    const requestData: TimeOffRequestForm = req.body
    const userId = (req as any).user.id

    // Validate shift exists
    const shift = mockShifts.find(s => s.id === requestData.shiftId)
    if (!shift) {
      return res.status(400).json({
        data: null,
        success: false,
        message: 'Shift not found'
      })
    }

    // Create new time off request
    const newRequest: TimeOffRequest = {
      id: Date.now().toString(),
      userId,
      shiftId: requestData.shiftId,
      reason: requestData.reason,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add to mock data
    mockTimeOffRequests.push(newRequest)

    // Add relations
    const requestWithRelations = {
      ...newRequest,
      user: getUserById(userId),
      shift
    }

    const response: ApiResponse<TimeOffRequest> = {
      data: requestWithRelations,
      success: true,
      message: 'Time off request created successfully'
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('Create time off request error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// PUT /api/timeoff/:id/approve
router.put('/:id/approve', requireManager, (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { approved, reviewNotes } = req.body
    const reviewerId = (req as any).user.id

    const requestIndex = mockTimeOffRequests.findIndex(r => r.id === id)
    if (requestIndex === -1) {
      return res.status(404).json({
        data: null,
        success: false,
        message: 'Time off request not found'
      })
    }

    // Update request status
    mockTimeOffRequests[requestIndex] = {
      ...mockTimeOffRequests[requestIndex],
      status: approved ? 'approved' : 'rejected',
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      reviewNotes,
      updatedAt: new Date()
    }

    // Add relations
    const requestWithRelations = {
      ...mockTimeOffRequests[requestIndex],
      user: getUserById(mockTimeOffRequests[requestIndex].userId),
      shift: mockShifts.find(s => s.id === mockTimeOffRequests[requestIndex].shiftId),
      reviewer: getUserById(reviewerId)
    }

    const response: ApiResponse<TimeOffRequest> = {
      data: requestWithRelations,
      success: true,
      message: `Time off request ${approved ? 'approved' : 'rejected'} successfully`
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Approve time off request error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 