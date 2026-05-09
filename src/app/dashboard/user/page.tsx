'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../DashboardLayout'
import { User, FileText, Bookmark, Settings, Activity } from 'lucide-react'
import UserOverview from './components/UserOverview'
import UserInquiries from './components/UserInquiries'
import UserSavedItems from './components/UserSavedItems'
import UserSettings from './components/UserSettings'

export default function UserDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [currentView, setCurrentView] = useState('overview')

  const menuItems = [
    {
      title: 'Overview',
      icon: User,
      mobileIcon: User,
      value: 'overview',
      mobileTitle: 'Overview'
    },
    {
      title: 'My Inquiries',
      icon: FileText,
      mobileIcon: FileText,
      value: 'inquiries',
      mobileTitle: 'Inquiries'
    },
    {
      title: 'Saved Items',
      icon: Bookmark,
      mobileIcon: Bookmark,
      value: 'saved',
      mobileTitle: 'Saved'
    },
    {
      title: 'Activity',
      icon: Activity,
      mobileIcon: Activity,
      value: 'activity',
      mobileTitle: 'Activity'
    },
    {
      title: 'Settings',
      icon: Settings,
      mobileIcon: Settings,
      value: 'settings',
      mobileTitle: 'Settings'
    }
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <UserOverview />
      case 'inquiries':
        return <UserInquiries />
      case 'saved':
        return <UserSavedItems />
      case 'activity':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Feed</h2>
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent activity</p>
            </div>
          </div>
        )
      case 'settings':
        return <UserSettings />
      default:
        return null
    }
  }

  return (
    <DashboardLayout
      role="USER"
      menuItems={menuItems}
      title="User Dashboard"
      currentView={currentView}
      onNavigate={setCurrentView}
      onLogout={logout}
    >
      {renderContent()}
    </DashboardLayout>
  )
}
