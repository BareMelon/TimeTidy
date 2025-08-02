import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { ApiResponse, ShiftSwap, SwapRequestForm } from '../types'
import { mockShiftSwaps, mockShifts, getUserById } from '../utils/mockData'
import { authenticateToken, requireManager } from '../middleware/auth'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// GET /api/swaps
router.get('/', (req: Request, res: Response) => {
  try {
    const swapsWithRelations = mockShiftSwaps.map(swap => ({
      ...swap,
      requester: getUserById(swap.requesterId),
      originalShift: mockShifts.find(s => s.id === swap.originalShiftId),
      targetUser: swap.targetUserId ? getUserById(swap.targetUserId) : undefined,
      targetShift: swap.targetShiftId ? mockShifts.find(s => s.id === swap.targetShiftId) : undefined,
      reviewer: swap.reviewedBy ? getUserById(swap.reviewedBy) : undefined
    }))

    const response: ApiResponse<ShiftSwap[]> = {
      data: swapsWithRelations,
      success: true,
      message: 'Shift swaps retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get swaps error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// POST /api/swaps
router.post('/', [
  body('originalShiftId').notEmpty().withMessage('Original shift ID is required')
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

    const swapData: SwapRequestForm = req.body
    const requesterId = (req as any).user.id

    // Validate original shift exists
    const originalShift = mockShifts.find(s => s.id === swapData.originalShiftId)
    if (!originalShift) {
      return res.status(400).json({
        data: null,
        success: false,
        message: 'Original shift not found'
      })
    }

    // Create new swap request
    const newSwap: ShiftSwap = {
      id: Date.now().toString(),
      requesterId,
      originalShiftId: swapData.originalShiftId,
      targetUserId: swapData.targetUserId,
      targetShiftId: swapData.targetShiftId,
      reason: swapData.reason,
      status: 'pending',
      deadline: swapData.deadline ? new Date(swapData.deadline) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add to mock data
    mockShiftSwaps.push(newSwap)

    // Add relations
    const swapWithRelations = {
      ...newSwap,
      requester: getUserById(requesterId),
      originalShift,
      targetUser: swapData.targetUserId ? getUserById(swapData.targetUserId) : undefined,
      targetShift: swapData.targetShiftId ? mockShifts.find(s => s.id === swapData.targetShiftId) : undefined
    }

    const response: ApiResponse<ShiftSwap> = {
      data: swapWithRelations,
      success: true,
      message: 'Swap request created successfully'
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('Create swap error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// PUT /api/swaps/:id/approve
router.put('/:id/approve', requireManager, (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { approved, reviewNotes } = req.body
    const reviewerId = (req as any).user.id

    const swapIndex = mockShiftSwaps.findIndex(s => s.id === id)
    if (swapIndex === -1) {
      return res.status(404).json({
        data: null,
        success: false,
        message: 'Swap request not found'
      })
    }

    // Update swap status
    mockShiftSwaps[swapIndex] = {
      ...mockShiftSwaps[swapIndex],
      status: approved ? 'approved' : 'rejected',
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      reviewNotes,
      updatedAt: new Date()
    }

    // Add relations
    const swapWithRelations = {
      ...mockShiftSwaps[swapIndex],
      requester: getUserById(mockShiftSwaps[swapIndex].requesterId),
      originalShift: mockShifts.find(s => s.id === mockShiftSwaps[swapIndex].originalShiftId),
      targetUser: mockShiftSwaps[swapIndex].targetUserId ? getUserById(mockShiftSwaps[swapIndex].targetUserId) : undefined,
      targetShift: mockShiftSwaps[swapIndex].targetShiftId ? mockShifts.find(s => s.id === mockShiftSwaps[swapIndex].targetShiftId) : undefined,
      reviewer: getUserById(reviewerId)
    }

    const response: ApiResponse<ShiftSwap> = {
      data: swapWithRelations,
      success: true,
      message: `Swap request ${approved ? 'approved' : 'rejected'} successfully`
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Approve swap error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 