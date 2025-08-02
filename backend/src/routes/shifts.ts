import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { ApiResponse, Shift, ShiftFilters, CreateShiftForm } from '../types'
import { mockShifts, mockUsers, mockLocations, getUserById, getLocationById } from '../utils/mockData'
import { authenticateToken, requireManager } from '../middleware/auth'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// GET /api/shifts
router.get('/', (req: Request, res: Response) => {
  try {
    const filters: ShiftFilters = req.query as any
    let filteredShifts = [...mockShifts]

    // Apply filters
    if (filters.userId) {
      filteredShifts = filteredShifts.filter(shift => shift.userId === filters.userId)
    }

    if (filters.locationId) {
      filteredShifts = filteredShifts.filter(shift => shift.locationId === filters.locationId)
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      filteredShifts = filteredShifts.filter(shift => new Date(shift.date) >= startDate)
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      filteredShifts = filteredShifts.filter(shift => new Date(shift.date) <= endDate)
    }

    if (filters.status) {
      filteredShifts = filteredShifts.filter(shift => shift.status === filters.status)
    }

    if (filters.role) {
      filteredShifts = filteredShifts.filter(shift => shift.role === filters.role)
    }

    // Add user and location data to shifts
    const shiftsWithRelations = filteredShifts.map(shift => ({
      ...shift,
      user: getUserById(shift.userId),
      location: getLocationById(shift.locationId)
    }))

    const response: ApiResponse<Shift[]> = {
      data: shiftsWithRelations,
      success: true,
      message: 'Shifts retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get shifts error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// GET /api/shifts/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const shift = mockShifts.find(s => s.id === id)

    if (!shift) {
      return res.status(404).json({
        data: null,
        success: false,
        message: 'Shift not found'
      })
    }

    // Add user and location data
    const shiftWithRelations = {
      ...shift,
      user: getUserById(shift.userId),
      location: getLocationById(shift.locationId)
    }

    const response: ApiResponse<Shift> = {
      data: shiftWithRelations,
      success: true,
      message: 'Shift retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get shift error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// POST /api/shifts
router.post('/', requireManager, [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('locationId').notEmpty().withMessage('Location ID is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('role').notEmpty().withMessage('Role is required')
], (req: Request, res: Response) => {
  try {
    // Check for validation errors
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

    const shiftData: CreateShiftForm = req.body

    // Validate user exists
    const user = getUserById(shiftData.userId)
    if (!user) {
      return res.status(400).json({
        data: null,
        success: false,
        message: 'User not found'
      })
    }

    // Validate location exists
    const location = getLocationById(shiftData.locationId)
    if (!location) {
      return res.status(400).json({
        data: null,
        success: false,
        message: 'Location not found'
      })
    }

    // Create new shift
    const newShift: Shift = {
      id: Date.now().toString(),
      userId: shiftData.userId,
      locationId: shiftData.locationId,
      date: new Date(shiftData.date),
      startTime: shiftData.startTime,
      endTime: shiftData.endTime,
      role: shiftData.role,
      status: 'scheduled',
      notes: shiftData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Add to mock data
    mockShifts.push(newShift)

    // Add user and location data
    const shiftWithRelations = {
      ...newShift,
      user,
      location
    }

    const response: ApiResponse<Shift> = {
      data: shiftWithRelations,
      success: true,
      message: 'Shift created successfully'
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('Create shift error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// PUT /api/shifts/:id
router.put('/:id', requireManager, (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const shiftIndex = mockShifts.findIndex(s => s.id === id)
    if (shiftIndex === -1) {
      return res.status(404).json({
        data: null,
        success: false,
        message: 'Shift not found'
      })
    }

    // Update shift
    mockShifts[shiftIndex] = {
      ...mockShifts[shiftIndex],
      ...updateData,
      updatedAt: new Date()
    }

    // Add user and location data
    const shiftWithRelations = {
      ...mockShifts[shiftIndex],
      user: getUserById(mockShifts[shiftIndex].userId),
      location: getLocationById(mockShifts[shiftIndex].locationId)
    }

    const response: ApiResponse<Shift> = {
      data: shiftWithRelations,
      success: true,
      message: 'Shift updated successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Update shift error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// DELETE /api/shifts/:id
router.delete('/:id', requireManager, (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const shiftIndex = mockShifts.findIndex(s => s.id === id)
    if (shiftIndex === -1) {
      return res.status(404).json({
        data: null,
        success: false,
        message: 'Shift not found'
      })
    }

    // Remove shift
    mockShifts.splice(shiftIndex, 1)

    const response: ApiResponse<null> = {
      data: null,
      success: true,
      message: 'Shift deleted successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Delete shift error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 