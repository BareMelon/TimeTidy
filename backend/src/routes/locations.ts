import { Router, Request, Response } from 'express'
import { ApiResponse, Location } from '../types'
import { mockLocations } from '../utils/mockData'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// GET /api/locations
router.get('/', (req: Request, res: Response) => {
  try {
    const response: ApiResponse<Location[]> = {
      data: mockLocations,
      success: true,
      message: 'Locations retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get locations error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

// GET /api/locations/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const location = mockLocations.find(l => l.id === id)

    if (!location) {
      return res.status(404).json({
        data: null,
        success: false,
        message: 'Location not found'
      })
    }

    const response: ApiResponse<Location> = {
      data: location,
      success: true,
      message: 'Location retrieved successfully'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Get location error:', error)
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 