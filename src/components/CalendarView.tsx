import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday, 
  addMonths, 
  subMonths 
} from 'date-fns'
import { Shift } from '@/types'

import { useLanguageStore } from '@/stores/languageStore'

interface CalendarViewProps {
  shifts: Shift[]
  onShiftClick?: (shift: Shift) => void
}

export default function CalendarView({ shifts, onShiftClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { t } = useLanguageStore()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getShiftsForDay = (day: Date) => {
    return shifts.filter(shift => isSameDay(shift.date, day))
  }

  const goToPrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {t('calendar.today')}
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const dayShifts = getShiftsForDay(day)
            const isCurrentDay = isToday(day)

            return (
              <div
                key={day.toString()}
                className={`min-h-[100px] p-1 border border-gray-200 rounded-md ${
                  isCurrentDay ? 'bg-blue-50 border-blue-200' : 'bg-white'
                }`}
              >
                {/* Day Number */}
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>

                {/* Shifts for this day */}
                <div className="space-y-1">
                  {dayShifts.slice(0, 2).map(shift => {
                    return (
                      <div
                        key={shift.id}
                        onClick={() => onShiftClick?.(shift)}
                        className={`text-xs p-1 rounded cursor-pointer ${
                          shift.status === 'scheduled'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : shift.status === 'cancelled'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : shift.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{shift.startTime}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span className="truncate">{shift.role}</span>
                        </div>
                      </div>
                    )
                  })}
                  {dayShifts.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayShifts.length - 2} {t('calendar.more')}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-gray-600">{t('calendar.scheduled')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-gray-600">{t('calendar.pending')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-gray-600">Cancelled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
            <span className="text-gray-600">{t('calendar.today')}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 