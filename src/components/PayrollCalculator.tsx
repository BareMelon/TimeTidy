import { useState } from 'react'
import { Calculator, DollarSign, Clock, TrendingUp, FileText } from 'lucide-react'
import { format } from 'date-fns'

interface PayrollEntry {
  userId: string
  userName: string
  regularHours: number
  overtimeHours: number
  hourlyRate: number
  regularPay: number
  overtimePay: number
  grossPay: number
  taxes: number
  netPay: number
}

interface PayrollCalculatorProps {
  className?: string
}

export default function PayrollCalculator({ className = '' }: PayrollCalculatorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(format(new Date(), 'yyyy-MM'))
  const [isCalculating, setIsCalculating] = useState(false)
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([])
  const [showResults, setShowResults] = useState(false)

  const calculatePayroll = async () => {
    setIsCalculating(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate mock payroll data
      const mockPayroll: PayrollEntry[] = [
        {
          userId: '2',
          userName: 'John Doe',
          regularHours: 160,
          overtimeHours: 8,
          hourlyRate: 18.50,
          regularPay: 2960.00,
          overtimePay: 222.00, // overtime at 1.5x rate
          grossPay: 3182.00,
          taxes: 636.40, // 20% tax
          netPay: 2545.60,
        },
        {
          userId: '3',
          userName: 'Jane Smith',
          regularHours: 170,
          overtimeHours: 5,
          hourlyRate: 22.00,
          regularPay: 3740.00,
          overtimePay: 165.00,
          grossPay: 3905.00,
          taxes: 781.00,
          netPay: 3124.00,
        },
        {
          userId: '4',
          userName: 'Mike Johnson',
          regularHours: 155,
          overtimeHours: 0,
          hourlyRate: 16.00,
          regularPay: 2480.00,
          overtimePay: 0,
          grossPay: 2480.00,
          taxes: 496.00,
          netPay: 1984.00,
        },
      ]

      setPayrollData(mockPayroll)
      setShowResults(true)
    } catch (error) {
      alert('Failed to calculate payroll. Please try again.')
    }
    
    setIsCalculating(false)
  }

  const getTotals = () => {
    return payrollData.reduce((totals, entry) => ({
      totalRegularHours: totals.totalRegularHours + entry.regularHours,
      totalOvertimeHours: totals.totalOvertimeHours + entry.overtimeHours,
      totalGrossPay: totals.totalGrossPay + entry.grossPay,
      totalTaxes: totals.totalTaxes + entry.taxes,
      totalNetPay: totals.totalNetPay + entry.netPay,
    }), {
      totalRegularHours: 0,
      totalOvertimeHours: 0,
      totalGrossPay: 0,
      totalTaxes: 0,
      totalNetPay: 0,
    })
  }

  const exportPayroll = () => {
    const csvContent = [
      ['Employee', 'Regular Hours', 'Overtime Hours', 'Hourly Rate', 'Regular Pay', 'Overtime Pay', 'Gross Pay', 'Taxes', 'Net Pay'],
      ...payrollData.map(entry => [
        entry.userName,
        entry.regularHours.toString(),
        entry.overtimeHours.toString(),
        entry.hourlyRate.toString(),
        entry.regularPay.toFixed(2),
        entry.overtimePay.toFixed(2),
        entry.grossPay.toFixed(2),
        entry.taxes.toFixed(2),
        entry.netPay.toFixed(2),
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payroll-${selectedPeriod}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totals = getTotals()

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Calculator className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">Payroll Calculator</h2>
        </div>

        {!showResults ? (
          /* Payroll Setup */
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Period
              </label>
              <input
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Payroll Calculation Rules</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Regular hours: Up to 40 hours per week</li>
                <li>• Overtime: 1.5x rate for hours over 40 per week</li>
                <li>• Tax rate: 20% of gross pay</li>
                <li>• Pay period: Monthly</li>
              </ul>
            </div>

            <button
              onClick={calculatePayroll}
              disabled={isCalculating}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {isCalculating ? 'Calculating...' : 'Calculate Payroll'}
            </button>
          </div>
        ) : (
          /* Payroll Results */
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Payroll for {format(new Date(selectedPeriod), 'MMMM yyyy')}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={exportPayroll}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Export
                </button>
                <button
                  onClick={() => setShowResults(false)}
                  className="px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100"
                >
                  Recalculate
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="text-sm font-medium text-blue-800">Total Hours</h4>
                </div>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {(totals.totalRegularHours + totals.totalOvertimeHours).toFixed(1)}
                </p>
                <p className="text-xs text-blue-700">
                  {totals.totalOvertimeHours > 0 && `+${totals.totalOvertimeHours} OT`}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="text-sm font-medium text-green-800">Gross Pay</h4>
                </div>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  DKK {totals.totalGrossPay.toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="text-sm font-medium text-red-800">Total Taxes</h4>
                </div>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  DKK {totals.totalTaxes.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="text-sm font-medium text-purple-800">Net Pay</h4>
                </div>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  DKK {totals.totalNetPay.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Employee Breakdown */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Pay
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Pay
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrollData.map((entry) => (
                    <tr key={entry.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{entry.userName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <span className="font-medium">{entry.regularHours + entry.overtimeHours}h</span>
                          {entry.overtimeHours > 0 && (
                            <div className="text-xs text-orange-600">
                              {entry.regularHours}h + {entry.overtimeHours}h OT
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        DKK {entry.hourlyRate}/hr
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        DKK {entry.grossPay.toLocaleString()}
                        {entry.overtimePay > 0 && (
                          <div className="text-xs text-gray-500">
                            Regular: DKK {entry.regularPay.toLocaleString()}<br/>
                            OT: DKK {entry.overtimePay.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        DKK {entry.taxes.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        DKK {entry.netPay.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 