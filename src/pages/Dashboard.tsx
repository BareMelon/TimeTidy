import { useState } from 'react'
import { Clock, Calendar, TrendingUp, Users, Activity, Bell } from 'lucide-react'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/authStore'
import { useShiftStore } from '@/stores/shiftStore'
import { useCheckInStore } from '@/stores/checkInStore'
import { useLanguageStore } from '@/stores/languageStore'
import { mockNotifications } from '@/lib/mock-data'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { shifts } = useShiftStore()
  const { currentCheckIn } = useCheckInStore()
  const { t } = useLanguageStore()
  const [notifications] = useState(mockNotifications)

  // Get user's upcoming shifts
  const userShifts = shifts
    .filter(shift => shift.userId === user?.id)
    .filter(shift => {
      try {
        const shiftDate = new Date(shift.date)
        const now = new Date()
        return shiftDate > now
      } catch (e) {
        console.error('Date comparison error:', e, shift.date)
        return false
      }
    })
    .sort((a, b) => {
      try {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } catch (e) {
        console.error('Date sort error:', e)
        return 0
      }
    })
    .slice(0, 3)



  // Get recent activity (mock data for now)
  const recentActivity = [
    { id: 1, action: 'Checked in', time: new Date(Date.now() - 2 * 60 * 60 * 1000), location: 'Main Store' },
    { id: 2, action: 'Shift completed', time: new Date(Date.now() - 8 * 60 * 60 * 1000), location: 'Main Store' },
    { id: 3, action: 'Time off requested', time: new Date(Date.now() - 24 * 60 * 60 * 1000), location: 'Admin' },
  ]

  const formatTime = (date: Date) => {
    return format(date, 'MMM d')
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.welcome')}, {user?.firstName}!
        </h1>
        <p className="text-gray-600">Here's what's happening today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.stats.hoursToday')}</p>
              <p className="text-2xl font-bold text-gray-900">7.5</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.stats.weeklyHours')}</p>
              <p className="text-2xl font-bold text-gray-900">32.5</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.stats.thisMonth')}</p>
              <p className="text-2xl font-bold text-gray-900">140</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.stats.overtime')}</p>
              <p className="text-2xl font-bold text-gray-900">2.5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Shifts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">{t('dashboard.upcomingShifts')}</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              {t('dashboard.viewAll')}
            </button>
          </div>
          
          {userShifts.length > 0 ? (
            <div className="space-y-3">
              {userShifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-primary-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {format(shift.date, 'EEEE, MMM d')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {shift.startTime} - {shift.endTime} • {shift.role}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {shift.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('dashboard.noShifts')}</h3>
              <p className="text-gray-500">No upcoming shifts scheduled</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">{t('dashboard.recentActivity')}</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              {t('dashboard.viewAll')}
            </button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      {format(activity.time, 'MMM d, h:mm a')} • {activity.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mt-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Mark all as read
            </button>
          </div>
          
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(notification.createdAt, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 