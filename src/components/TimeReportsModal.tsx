import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Clock, User, Download, Filter } from 'lucide-react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from 'date-fns'
import { usePermissions } from '@/hooks/usePermissions'
import { mockUsers } from '@/lib/mock-data'

const reportFiltersSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  userId: z.string().optional(),
  reportType: z.enum(['summary', 'detailed']),
})

type ReportFilters = z.infer<typeof reportFiltersSchema>

interface TimeReportsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface TimeRecord {
  id: string
  userId: string
  userName: string
  date: Date
  checkInTime: string
  checkOutTime?: string
  totalHours: number
  regularHours: number
  overtimeHours: number
  hourlyRate: number
  totalPay: number
  location: string
}

export default function TimeReportsModal({ isOpen, onClose }: TimeReportsModalProps) {
  const { canViewAllReports, user } = usePermissions()
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState<TimeRecord[]>([])
  const [showResults, setShowResults] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReportFilters>({
    resolver: zodResolver(reportFiltersSchema),
    defaultValues: {
      reportType: 'summary',
      startDate: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfWeek(new Date()), 'yyyy-MM-dd'),
      userId: canViewAllReports() ? '' : user?.id,
    },
  })

  const setQuickRange = (range: 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth') => {
    const now = new Date()
    
    switch (range) {
      case 'thisWeek':
        setValue('startDate', format(startOfWeek(now), 'yyyy-MM-dd'))
        setValue('endDate', format(endOfWeek(now), 'yyyy-MM-dd'))
        break
      case 'lastWeek':
        const lastWeekStart = startOfWeek(subWeeks(now, 1))
        setValue('startDate', format(lastWeekStart, 'yyyy-MM-dd'))
        setValue('endDate', format(endOfWeek(lastWeekStart), 'yyyy-MM-dd'))
        break
      case 'thisMonth':
        setValue('startDate', format(startOfMonth(now), 'yyyy-MM-dd'))
        setValue('endDate', format(endOfMonth(now), 'yyyy-MM-dd'))
        break
      case 'lastMonth':
        const lastMonthStart = startOfMonth(subMonths(now, 1))
        setValue('startDate', format(lastMonthStart, 'yyyy-MM-dd'))
        setValue('endDate', format(endOfMonth(lastMonthStart), 'yyyy-MM-dd'))
        break
    }
  }

  const generateReport = async (data: ReportFilters) => {
    setIsGenerating(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate mock report data
      const mockRecords: TimeRecord[] = [
        {
          id: '1',
          userId: '2',
          userName: 'John Doe',
          date: new Date(),
          checkInTime: '09:00',
          checkOutTime: '17:30',
          totalHours: 8.5,
          regularHours: 8,
          overtimeHours: 0.5,
          hourlyRate: 18.50,
          totalPay: 157.25,
          location: 'Main Store',
        },
        {
          id: '2',
          userId: '2',
          userName: 'John Doe',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          checkInTime: '09:15',
          checkOutTime: '17:45',
          totalHours: 8.5,
          regularHours: 8,
          overtimeHours: 0.5,
          hourlyRate: 18.50,
          totalPay: 157.25,
          location: 'Main Store',
        },
        {
          id: '3',
          userId: '3',
          userName: 'Jane Smith',
          date: new Date(),
          checkInTime: '10:00',
          checkOutTime: '18:00',
          totalHours: 8,
          regularHours: 8,
          overtimeHours: 0,
          hourlyRate: 22.00,
          totalPay: 176.00,
          location: 'Main Store',
        },
      ]

      // Filter by user if specified
      let filteredRecords = mockRecords
      if (data.userId) {
        filteredRecords = mockRecords.filter(record => record.userId === data.userId)
      }

      setReportData(filteredRecords)
      setShowResults(true)
    } catch (error) {
      alert('Failed to generate report. Please try again.')
    }
    
    setIsGenerating(false)
  }

  const calculateTotals = () => {
    return reportData.reduce((totals, record) => ({
      totalHours: totals.totalHours + record.totalHours,
      regularHours: totals.regularHours + record.regularHours,
      overtimeHours: totals.overtimeHours + record.overtimeHours,
      totalPay: totals.totalPay + record.totalPay,
    }), { totalHours: 0, regularHours: 0, overtimeHours: 0, totalPay: 0 })
  }

  const exportReport = () => {
    // In a real app, this would generate and download a CSV/PDF
    const csvContent = [
      ['Date', 'Employee', 'Check In', 'Check Out', 'Total Hours', 'Regular Hours', 'Overtime Hours', 'Hourly Rate', 'Total Pay', 'Location'],
      ...reportData.map(record => [
        format(record.date, 'yyyy-MM-dd'),
        record.userName,
        record.checkInTime,
        record.checkOutTime || '',
        record.totalHours.toString(),
        record.regularHours.toString(),
        record.overtimeHours.toString(),
        record.hourlyRate.toString(),
        record.totalPay.toString(),
        record.location,
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `time-report-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  const totals = calculateTotals()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Time Reports</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showResults ? (
          /* Report Filters */
          <div className="p-6">
            <form onSubmit={handleSubmit(generateReport)} className="space-y-6">
              {/* Quick Date Ranges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Date Ranges
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickRange('thisWeek')}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    This Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickRange('lastWeek')}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Last Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickRange('thisMonth')}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    This Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickRange('lastMonth')}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Last Month
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    {...register('startDate')}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    {...register('endDate')}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              {/* Employee Filter */}
              {canViewAllReports() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee (Optional)
                  </label>
                  <select
                    {...register('userId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Employees</option>
                    {mockUsers.filter(u => u.role !== 'admin').map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('reportType')}
                      type="radio"
                      value="summary"
                      className="mr-2"
                    />
                    <span className="text-sm">Summary</span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('reportType')}
                      type="radio"
                      value="detailed"
                      className="mr-2"
                    />
                    <span className="text-sm">Detailed</span>
                  </label>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating Report...' : 'Generate Report'}
              </button>
            </form>
          </div>
        ) : (
          /* Report Results */
          <div className="p-6">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Report Results</h3>
              <div className="flex space-x-2">
                <button
                  onClick={exportReport}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export CSV
                </button>
                <button
                  onClick={() => setShowResults(false)}
                  className="px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100"
                >
                  New Report
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800">Total Hours</h4>
                <p className="text-2xl font-bold text-blue-900">{totals.totalHours.toFixed(1)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-800">Regular Hours</h4>
                <p className="text-2xl font-bold text-green-900">{totals.regularHours.toFixed(1)}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-orange-800">Overtime Hours</h4>
                <p className="text-2xl font-bold text-orange-900">{totals.overtimeHours.toFixed(1)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800">Total Pay</h4>
                <p className="text-2xl font-bold text-purple-900">DKK {totals.totalPay.toFixed(2)}</p>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pay
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(record.date, 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{record.userName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{record.checkInTime} - {record.checkOutTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <span className="font-medium">{record.totalHours}h</span>
                          {record.overtimeHours > 0 && (
                            <span className="ml-2 text-xs text-orange-600">
                              (+{record.overtimeHours}h OT)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        DKK {record.totalPay.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reportData.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
                <p className="text-gray-500">Try adjusting your date range or filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 