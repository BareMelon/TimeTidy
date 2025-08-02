import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { ApiResponse, CheckIn, CheckInFilters } from '../types'
import { mockCheckIns, mockUsers, mockLocations, getUserById, getLocationById } from '../utils/mockData'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// GET /api/checkins
router.get('/', (req: Request, res: Response) => {
  try {
    const filters: CheckInFilters = req.query as any
    let filteredCheckIns = [...mockCheckIns]

    // Apply filters
    if (filters.userId) {
      filteredCheckIns = filteredCheckIns.filter(checkIn => checkIn.userId === filters.userId)
    }

    if (filters.locationId) {
      filteredCheckIns = filteredCheckIns.filter(checkIn => checkIn.locationId === filters.locationId)
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      filteredCheckIns = filteredCheckIns.filter(checkIn => new Date(checkIn.checkInTime) >= startDate)
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      filteredCheckIns = filteredCheckIns.filter(checkIn => new Date(checkIn.checkInTime) <= endDate)
    }

    if (filters.includeActive === false) {
      filteredCheckIns = filteredCheckIns.filter(checkIn => checkIn.checkOutTime)
    }

    // Add user and location data
    const checkInsWithRelations = filteredCheckIns.map(checkIn => ({
      ...checkIn,
      user: getUserById(checkIn.userId),
      location: getLocationById(checkIn.locationId)
    }))

    const response: ApiResponse<CheckIn[]> = {
      data: checkInsWithRelations,
      success: true,
      message: 'Check-ins retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get check-ins error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// POST /api/checkins
router.post('/', [
  body('locationId').notEmpty().withMessage('Location ID is required')
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

    const { locationId, shiftId, latitude, longitude, notes } = req.body
    const userId = (req as any).user.id

    // Validate location exists
    const location = getLocationById(locationId)
    if (!location) {
      return res.status(400).json({
        data: null,
        success: false,
        message: 'Location not found'
      })
    }

    // Create new check-in
    const newCheckIn: CheckIn = {
      id: Date.now().toString(),
      userId,
      shiftId,
      locationId,
      checkInTime: new Date(),
      latitude,
      longitude,
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add to mock data
    mockCheckIns.push(newCheckIn)

    // Add user and location data
    const checkInWithRelations = {
      ...newCheckIn,
      user: getUserById(userId),
      location
    }

    const response: ApiResponse<CheckIn> = {
      data: checkInWithRelations,
      success: true,
      message: 'Check-in successful'
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('Check-in error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// PUT /api/checkins/:id/checkout
router.put('/:id/checkout', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { notes } = req.body

    const checkInIndex = mockCheckIns.findIndex(c => c.id === id)
    if (checkInIndex === -1) {
      return res.status(404).json({
        data: null,
        success: false,
        message: 'Check-in not found'
      })
    }

    // Update check-out time
    mockCheckIns[checkInIndex] = {
      ...mockCheckIns[checkInIndex],
      checkOutTime: new Date(),
      notes: notes || mockCheckIns[checkInIndex].notes,
      updatedAt: new Date()
    }

    // Add user and location data
    const checkInWithRelations = {
      ...mockCheckIns[checkInIndex],
      user: getUserById(mockCheckIns[checkInIndex].userId),
      location: getLocationById(mockCheckIns[checkInIndex].locationId)
    }

    const response: ApiResponse<CheckIn> = {
      data: checkInWithRelations,
      success: true,
      message: 'Check-out successful'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Check-out error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 