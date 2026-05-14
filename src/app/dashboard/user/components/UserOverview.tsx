'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Bookmark, User, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import UserProfilePreview from './UserProfilePreview'
import UserAccountProgress from './UserAccountProgress'
import UserAccountSummary from './UserAccountSummary'
import UserQuickActions from './UserQuickActions'
import UserActivityChart from './UserActivityChart'

interface UserOverviewProps {
  data: any
  inquiries: any[]
  activity: any[]
  savedItems: any[]
}

export default function UserOverview({ data, inquiries, activity, savedItems }: UserOverviewProps) {
  const { user } = useAuth()
  const router = useRouter()

  const stats = [
    {
      title: 'Total Inquiries',
      value: String(data?.stats?.totalInquiries || inquiries.length || 0),
      icon: FileText,
      trend: `${inquiries.filter((i: any) => {
        const d = new Date(i.createdAt)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return d >= weekAgo
      }).length} this week`,
    },
    {
      title: 'Saved Items',
      value: String(savedItems.length || 0),
      icon: Bookmark,
      trend: `${savedItems.length} total`,
    },
    {
      title: 'Profile Completion',
      value: `${data?.profileCompletion || 0}%`,
      icon: User,
      trend: data?.profileCompletion === 100 ? 'Complete!' : 'Complete your profile',
    },
    {
      title: 'Recent Activity',
      value: String(activity.length || 0),
      icon: TrendingUp,
      trend: `${activity.filter((a: any) => {
        const d = new Date(a.timestamp || a.createdAt)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return d >= weekAgo
      }).length} this week`,
    },
  ]

  const recentInquiries = inquiries.slice(0, 5)
  const recentActivity = activity.slice(0, 10)

  const handleViewProfile = () => {}
  const handleEditProfile = () => router.push('/dashboard/user/settings')
  const handleImproveProfile = () => router.push('/dashboard/user/settings')
  const handleManageSubscription = () => {}

  const quickActions = [
    { id: "browse-businesses", label: "Browse Businesses", icon: () => <span>🏢</span>, onClick: () => router.push('/businesses') },
    { id: "find-professionals", label: "Find Professionals", icon: () => <span>👤</span>, onClick: () => router.push('/professionals') },
    { id: "update-profile", label: "Update Profile", icon: () => <span>⚙️</span>, onClick: () => router.push('/dashboard/user/settings') },
    { id: "view-inquiries", label: "View Inquiries", icon: () => <span>📄</span>, onClick: () => router.push('/dashboard/user?view=inquiries') },
  ]

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900">Overview</h1>
        <p className="text-md text-gray-600">
          Welcome back{user?.name ? `, ${user.name}` : ''}! Here's what's happening with your account.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg">
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Inquiries</h3>
                <button
                  onClick={() => router.push('/dashboard/user?view=inquiries')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              {recentInquiries.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No inquiries yet</p>
                  <p className="text-gray-400 text-xs mt-1">Browse businesses and submit your first inquiry</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInquiries.map((inquiry: any) => (
                    <div key={inquiry.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {inquiry.product?.name || inquiry.business?.name || 'General Inquiry'}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">{inquiry.message}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            inquiry.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                            inquiry.status === 'READ' ? 'bg-gray-100 text-gray-700' :
                            inquiry.status === 'REPLIED' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {inquiry.status}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-0.5" />
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button
                  onClick={() => router.push('/dashboard/user?view=activity')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No recent activity</p>
                  <p className="text-gray-400 text-xs mt-1">Your actions will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{item.action}</span>
                          {item.entityType && (
                            <span className="text-gray-500"> on {item.entityType}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(item.timestamp || item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <UserProfilePreview
              user={{
                name: user?.name,
                avatar: user?.avatar,
                memberSince: data?.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently',
                location: data?.user?.location || 'Location not set',
                bio: 'Add a short bio to introduce yourself.',
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
            <UserQuickActions actions={quickActions} />
          </Card>
        </div>
      </div>
    </div>
  )
}
