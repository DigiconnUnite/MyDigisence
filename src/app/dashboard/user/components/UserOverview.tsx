'use client'

import { useAuth } from '@/contexts/AuthContext'
import { User, FileText, Bookmark, TrendingUp } from 'lucide-react'

export default function UserOverview() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Total Inquiries',
      value: '0',
      icon: FileText,
      color: 'bg-blue-50 border-blue-200 text-blue-600',
      trend: '+0 this week'
    },
    {
      title: 'Saved Businesses',
      value: '0',
      icon: Bookmark,
      color: 'bg-green-50 border-green-200 text-green-600',
      trend: '+0 this week'
    },
    {
      title: 'Saved Professionals',
      value: '0',
      icon: Bookmark,
      color: 'bg-purple-50 border-purple-200 text-purple-600',
      trend: '+0 this week'
    },
    {
      title: 'Profile Completion',
      value: '50%',
      icon: User,
      color: 'bg-orange-50 border-orange-200 text-orange-600',
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

  const quickActions = [
    {
      title: 'Browse Businesses',
      description: 'Discover local businesses and services',
      href: '/businesses',
      icon: '🏢'
    },
    {
      title: 'Find Professionals',
      description: 'Connect with skilled professionals',
      href: '/professionals',
      icon: '👤'
    },
    {
      title: 'Update Profile',
      description: 'Complete your profile information',
      href: '/dashboard/user/settings',
      icon: '⚙️'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h2>
        <p className="text-gray-600">
          Here's your personalized dashboard to manage your DigiSence experience.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className={`rounded-lg p-4 border ${stat.color}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium opacity-80">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs opacity-70 mt-1">{stat.trend}</p>
                </div>
                <Icon className="h-8 w-8 opacity-80" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {action.icon}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🔍</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Explore</h4>
            <p className="text-sm text-gray-600">Browse businesses and professionals in your area</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">💬</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Connect</h4>
            <p className="text-sm text-gray-600">Send inquiries and get responses from businesses</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">⭐</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Review</h4>
            <p className="text-sm text-gray-600">Share your experience and help others</p>
          </div>
        </div>
      </div>
    </div>
  )
}
