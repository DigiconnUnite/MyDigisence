'use client'

import { Clock, Activity, FileText, Bookmark, Shield, User } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface UserActivityProps {
  activity: any[]
}

function getActivityIcon(action: string) {
  if (action.includes('INQUIRY') || action.includes('inquiry')) return FileText
  if (action.includes('LOGIN') || action.includes('login')) return Shield
  if (action.includes('BOOKMARK') || action.includes('SAVE')) return Bookmark
  if (action.includes('PROFILE') || action.includes('profile')) return User
  return Activity
}

function getActivityColor(action: string) {
  if (action.includes('CREATE') || action.includes('LOGIN')) return 'bg-green-100 text-green-600'
  if (action.includes('UPDATE') || action.includes('EDIT')) return 'bg-blue-100 text-blue-600'
  if (action.includes('DELETE')) return 'bg-red-100 text-red-600'
  return 'bg-gray-100 text-gray-600'
}

export default function UserActivity({ activity }: UserActivityProps) {
  if (activity.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-lg font-bold text-gray-900">Activity Feed</h1>
        <Card className="bg-white border border-gray-300 shadow-none rounded-3xl p-12">
          <div className="text-center">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Your recent actions like submitting inquiries, saving items, and updating your profile will appear here.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Activity Feed</h1>
        <span className="text-sm text-gray-500">{activity.length} entries</span>
      </div>

      <div className="space-y-3">
        {activity.map((item: any, index: number) => {
          const Icon = getActivityIcon(item.action)
          const colorClass = getActivityColor(item.action)
          return (
            <Card key={item.id || index} className="bg-white border border-gray-300 shadow-none rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium capitalize">{item.action.toLowerCase().replace(/_/g, ' ')}</span>
                    {item.entityType && (
                      <span className="text-gray-500"> on {item.entityType.toLowerCase()}</span>
                    )}
                  </p>
                  {item.entityId && (
                    <p className="text-xs text-gray-400 mt-0.5">ID: {item.entityId}</p>
                  )}
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(item.timestamp || item.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
