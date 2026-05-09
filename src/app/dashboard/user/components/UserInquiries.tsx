'use client'

import { useState, useEffect } from 'react'
import { FileText, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react'

interface Inquiry {
  id: string
  type: 'business' | 'professional'
  targetName: string
  message: string
  status: 'pending' | 'replied' | 'closed'
  createdAt: string
  response?: string
  respondedAt?: string
}

export default function UserInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching user inquiries
    const fetchInquiries = async () => {
      setLoading(true)
      // This would be replaced with actual API call
      setTimeout(() => {
        setInquiries([])
        setLoading(false)
      }, 1000)
    }

    fetchInquiries()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'replied':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'replied':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'closed':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Inquiries</h2>
            <p className="text-gray-600 mt-1">Track your business and professional inquiries</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Total: {inquiries.length}</span>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries yet</h3>
          <p className="text-gray-600 mb-6">
            Start exploring businesses and professionals to make inquiries
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/businesses"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Businesses
            </a>
            <a
              href="/professionals"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Find Professionals
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(inquiry.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{inquiry.targetName}</h3>
                    <p className="text-sm text-gray-500">
                      {inquiry.type === 'business' ? 'Business' : 'Professional'} Inquiry
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry.status)}`}>
                  {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Your Message:</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{inquiry.message}</p>
                </div>

                {inquiry.response && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Response:
                    </h4>
                    <p className="text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      {inquiry.response}
                    </p>
                    {inquiry.respondedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Responded on {new Date(inquiry.respondedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Sent on {new Date(inquiry.createdAt).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  {inquiry.status === 'pending' && (
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Send Reminder
                    </button>
                  )}
                  {inquiry.status === 'replied' && (
                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                      View Conversation
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Tips for Better Inquiries</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Be specific about your requirements and timeline</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Include your contact information for faster responses</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Check your email regularly for responses</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Be respectful and professional in your communications</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
