'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Bookmark, User, TrendingUp } from 'lucide-react'
import UserProfilePreview from './UserProfilePreview'
import UserAccountProgress from './UserAccountProgress'
import UserAccountSummary from './UserAccountSummary'
import UserQuickActions from './UserQuickActions'
import UserActivityChart from './UserActivityChart'

export default function UserOverview() {
  const { user } = useAuth()
  const router = useRouter()

  const stats = [
    {
      title: 'Total Inquiries',
      value: '0',
      icon: FileText,
      trend: '+0 this week'
    },
    {
      title: 'Saved Businesses',
      value: '0',
      icon: Bookmark,
      trend: '+0 this week'
    },
    {
      title: 'Saved Professionals',
      value: '0',
      icon: Bookmark,
      trend: '+0 this week'
    },
    {
      title: 'Profile Completion',
      value: '50%',
      icon: User,
      trend: 'Complete your profile'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'inquiry',
      message: 'No recent inquiries',
      time: '',
      icon: FileText
    }
  ]

  const handleViewProfile = () => {
    // Navigate to profile view
  }

  const handleEditProfile = () => {
    router.push('/dashboard/user/settings')
  }

  const handleImproveProfile = () => {
    router.push('/dashboard/user/settings')
  }

  const handleManageSubscription = () => {
    // Handle subscription
  }

  const quickActions = [
    { id: "browse-businesses", label: "Browse Businesses", icon: () => <span>🏢</span>, onClick: () => router.push('/businesses') },
    { id: "find-professionals", label: "Find Professionals", icon: () => <span>👤</span>, onClick: () => router.push('/professionals') },
    { id: "update-profile", label: "Update Profile", icon: () => <span>⚙️</span>, onClick: () => router.push('/dashboard/user/settings') },
    { id: "view-inquiries", label: "View Inquiries", icon: () => <span>📄</span>, onClick: () => {} }, // Placeholder
  ]

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900">Overview</h1>
        <p className="text-md text-gray-600">
          Welcome back! Here's what's happening with your account.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-gray-500">{stat.trend}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <UserActivityChart />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{activity.message}</span>
                      {activity.time && (
                        <span className="text-gray-400 text-xs ml-auto">{activity.time}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
              <UserQuickActions actions={quickActions} />
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <UserProfilePreview
              user={{
                name: user?.name,
                avatar: user?.avatar,
                memberSince: 'Jan 2024', // Placeholder
                location: 'Location not set', // Placeholder
                bio: 'Add a short bio to introduce yourself.', // Placeholder
              }}
              onViewProfile={handleViewProfile}
              onEditProfile={handleEditProfile}
            />
          </Card>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <UserAccountProgress onImproveProfile={handleImproveProfile} />
          </Card>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <UserAccountSummary
              memberSince="Jan 2024"
              plan="Free Plan"
              status="active"
              onManageSubscription={handleManageSubscription}
            />
          </Card>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <UserQuickActions />
          </Card>
        </div>
      </div>
    </div>
  )
}
