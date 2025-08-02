import { Location } from '@/types'

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Check if user is within geofence radius of a location
 */
export function isWithinGeofence(
  userLat: number,
  userLon: number,
  location: Location
): boolean {
  if (!location.latitude || !location.longitude || !location.geofenceRadius) {
    return true // No geofencing configured, allow check-in
  }

  const distance = calculateDistance(
    userLat,
    userLon,
    location.latitude,
    location.longitude
  )

  return distance <= location.geofenceRadius
}

/**
 * Get user's current location using browser geolocation API
 */
export function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location access denied by user'))
            break
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable'))
            break
          case error.TIMEOUT:
            reject(new Error('Location request timed out'))
            break
          default:
            reject(new Error('An unknown error occurred while retrieving location'))
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  })
}

/**
 * Validate check-in location against geofence
 */
export async function validateCheckInLocation(location: Location): Promise<{
  allowed: boolean
  distance?: number
  error?: string
}> {
  try {
    // Get user's current location
    const userLocation = await getCurrentLocation()
    
    // Check if within geofence
    const withinGeofence = isWithinGeofence(
      userLocation.latitude,
      userLocation.longitude,
      location
    )

    if (!withinGeofence && location.latitude && location.longitude) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        location.latitude,
        location.longitude
      )

      return {
        allowed: false,
        distance: Math.round(distance),
        error: `You are ${Math.round(distance)}m away from ${location.name}. Please move closer to check in.`
      }
    }

    return { allowed: true }
  } catch (error) {
    // If geolocation fails, we can either:
    // 1. Allow check-in (more user-friendly)
    // 2. Deny check-in (more secure)
    // For demo purposes, we'll allow it but log the error
    console.warn('Geolocation validation failed:', error)
    
    return {
      allowed: true,
      error: 'Location services unavailable. Check-in allowed without location verification.'
    }
  }
} 