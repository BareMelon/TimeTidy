import { useState } from 'react'
import { Clock, MapPin, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'

import { useCheckInStore } from '@/stores/checkInStore'
import { useLanguageStore } from '@/stores/languageStore'
import { useToast } from '@/components/Toast'

export default function CheckIn() {
  const { currentCheckIn, checkIn, checkOut, isCheckedIn } = useCheckInStore()
  const { t } = useLanguageStore()
  const { success, error } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckIn = async () => {
    setIsLoading(true)
    try {
      await checkIn('1') // Main Store location ID
      success('Successfully checked in!')
    } catch (err) {
      error('Check-in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setIsLoading(true)
    try {
      await checkOut()
      success('Successfully checked out!')
    } catch (err) {
      error('Check-out failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('checkin.title')}</h1>
          <p className="text-gray-600">
            {isCheckedIn ? t('checkin.currentlyCheckedIn') : 'Ready to check in or out'}
          </p>
        </div>

        {/* Current Status Card */}
        <div className="card mb-6">
          <div className="text-center">
            {isCheckedIn && currentCheckIn ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('checkin.checkedIn')}</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {t('checkin.currentlyCheckedIn')} {format(currentCheckIn.checkInTime, 'h:mm a')}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-500">{t('checkin.location')}</p>
                      <p className="font-medium">Main Store</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">{t('checkin.time')}</p>
                      <p className="font-medium">
                        {format(currentCheckIn.checkInTime, 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('checkin.notCheckedIn')}</h2>
                  <p className="text-sm text-gray-500">
                    You're not currently checked in
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {!isCheckedIn ? (
            <button
              onClick={handleCheckIn}
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              <Clock className="w-5 h-5 mr-2" />
              {isLoading ? t('common.loading') : t('checkin.checkIn')}
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={isLoading}
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Clock className="w-5 h-5 mr-2" />
              {isLoading ? t('common.loading') : t('checkin.checkOut')}
            </button>
          )}
        </div>

        {/* Location Info */}
        <div className="mt-8 card">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="font-medium text-gray-900">{t('checkin.location')}</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">Main Store - Downtown</p>
            <p className="text-gray-500">123 Main Street, Copenhagen</p>
            <p className="text-gray-500">Geofence: 50m radius</p>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-6 card">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-medium text-gray-900">{t('checkin.status')}</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Status:</span>
              <span className={`font-medium ${
                isCheckedIn ? 'text-green-600' : 'text-gray-600'
              }`}>
                {isCheckedIn ? t('checkin.checkedIn') : t('checkin.notCheckedIn')}
              </span>
            </div>
            {isCheckedIn && currentCheckIn && (
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in Time:</span>
                <span className="font-medium">
                  {format(currentCheckIn.checkInTime, 'h:mm a')}
                </span>
              </div>
            )}
            {currentCheckIn?.checkOutTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out Time:</span>
                <span className="font-medium">
                  {format(currentCheckIn.checkOutTime, 'h:mm a')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 