import { useState } from 'react'
import { Calendar, Clock, User, Check, X, MessageSquare, Filter, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { usePermissions } from '@/hooks/usePermissions'
import { useToast } from '@/components/Toast'

interface TimeOffRequest {
  id: string
  userId: string
  userName: string
  startDate: Date
  endDate: Date
  reason: string
  notes?: string
  status: 'pending' | 'approved' | 'denied'
  submittedAt: Date
  totalDays: number
  reviewedBy?: string
  reviewedAt?: Date
  reviewNotes?: string
}

interface TimeOffManagementProps {
  className?: string
}

const REASON_ICONS: Record<string, string> = {
  vacation: '🏖️',
  sick: '🏥',
  personal: '👤',
  family: '👨‍👩‍👧‍👦',
  other: '📝',
}

export default function TimeOffManagement({ className = '' }: TimeOffManagementProps) {
  const { canApproveRequests, user } = usePermissions()
  const { success, error } = useToast()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock data - in real app this would come from an API
  const [requests, setRequests] = useState<TimeOffRequest[]>([
    {
      id: '1',
      userId: '2',
      userName: 'John Doe',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-19'),
      reason: 'vacation',
      notes: 'Family vacation to the mountains',
      status: 'pending',
      submittedAt: new Date('2024-01-01'),
      totalDays: 5,
    },
    {
      id: '2',
      userId: '3',
      userName: 'Jane Smith',
      startDate: new Date('2024-01-08'),
      endDate: new Date('2024-01-08'),
      reason: 'sick',
      status: 'approved',
      submittedAt: new Date('2024-01-07'),
      totalDays: 1,
      reviewedBy: 'Administrator',
      reviewedAt: new Date('2024-01-07'),
    },
    {
      id: '3',
      userId: '4',
      userName: 'Mike Johnson',
      startDate: new Date('2024-01-22'),
      endDate: new Date('2024-01-26'),
      reason: 'personal',
      notes: 'Moving to a new apartment',
      status: 'pending',
      submittedAt: new Date('2024-01-05'),
      totalDays: 5,
    },
  ])

  const filteredRequests = statusFilter 
    ? requests.filter(req => req.status === statusFilter)
    : requests

  const handleRequestAction = async (requestId: string, action: 'approve' | 'deny') => {
    setIsProcessing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? {
              ...req,
              status: action === 'approve' ? 'approved' : 'denied',
              reviewedBy: user?.firstName + ' ' + user?.lastName,
              reviewedAt: new Date(),
              reviewNotes: reviewNotes || undefined,
            }
          : req
      ))

      setSelectedRequest(null)
      setReviewNotes('')
      success(
        `Request ${action === 'approve' ? 'Approved' : 'Denied'}`, 
        `Time off request has been ${action === 'approve' ? 'approved' : 'denied'} successfully!`
      )
    } catch (err) {
      error('Processing Failed', 'Failed to process request. Please try again.')
    }
    
    setIsProcessing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'denied':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!canApproveRequests()) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500">You don't have permission to manage time off requests.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Time Off Requests</h2>
          </div>
          
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800">Pending Requests</h3>
            <p className="text-2xl font-bold text-yellow-900">
              {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Approved This Month</h3>
            <p className="text-2xl font-bold text-green-900">
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Total Days Requested</h3>
            <p className="text-2xl font-bold text-blue-900">
              {requests.filter(r => r.status !== 'denied').reduce((sum, r) => sum + r.totalDays, 0)}
            </p>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Employee and Date Info */}
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-900">{request.userName}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-600">
                      {format(request.submittedAt, 'MMM d, yyyy')}
                    </span>
                  </div>

                  {/* Request Details */}
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {format(request.startDate, 'MMM d')} - {format(request.endDate, 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{request.totalDays} day{request.totalDays !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">{REASON_ICONS[request.reason] || '📝'}</span>
                      <span className="text-sm text-gray-900 capitalize">{request.reason}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {request.notes && (
                    <div className="text-sm text-gray-600 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      {request.notes}
                    </div>
                  )}

                  {/* Review Info */}
                  {request.reviewedBy && (
                    <div className="text-xs text-gray-500">
                      Reviewed by {request.reviewedBy} on {format(request.reviewedAt!, 'MMM d, yyyy')}
                      {request.reviewNotes && (
                        <div className="mt-1 italic">"{request.reviewNotes}"</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Status and Actions */}
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>

                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-xs px-3 py-1 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                      >
                        Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-500">
                {statusFilter ? `No ${statusFilter} requests at this time.` : 'No time off requests to show.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Review Request</h3>
              <button
                onClick={() => {
                  setSelectedRequest(null)
                  setReviewNotes('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Request Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedRequest.userName}</h4>
                  <p className="text-sm text-gray-600">
                    {format(selectedRequest.startDate, 'MMMM d')} - {format(selectedRequest.endDate, 'MMMM d, yyyy')} 
                    ({selectedRequest.totalDays} day{selectedRequest.totalDays !== 1 ? 's' : ''})
                  </p>
                  <p className="text-sm text-gray-600 capitalize mt-1">
                    Reason: {selectedRequest.reason}
                  </p>
                  {selectedRequest.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{selectedRequest.notes}"</p>
                  )}
                </div>

                {/* Review Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Notes (Optional)
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Add any notes about your decision..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRequestAction(selectedRequest.id, 'deny')}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Deny'}
                  </button>
                  <button
                    onClick={() => handleRequestAction(selectedRequest.id, 'approve')}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 