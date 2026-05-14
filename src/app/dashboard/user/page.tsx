'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useSocket } from '@/lib/hooks/useSocket'
import RoleDashboardLayout from '../components/RoleDashboardLayout'
import { useDashboardRouter } from '../hooks/useDashboardRouter'
import { useDashboardSearch } from '../hooks/useDashboardSearch'
import { useSocketSyncUser } from './hooks/useSocketSyncUser'
import NotificationBell from '../components/NotificationBell'

import {
  User as UserIcon,
  FileText,
  Bookmark,
  Settings,
  Activity,
} from 'lucide-react'

import UserOverview from './components/UserOverview'
import UserInquiries from './components/UserInquiries'
import UserSavedItems from './components/UserSavedItems'
import UserSettings from './components/UserSettings'
import UserActivity from './components/UserActivity'

type UserView = 'overview' | 'inquiries' | 'saved' | 'activity' | 'settings'

const VALID_USER_VIEWS: UserView[] = ['overview', 'inquiries', 'saved', 'activity', 'settings']
const RECENT_SEARCHES_KEY = 'digisence-user-recent-searches'

const SEARCH_INDEX = [
  { id: 'nav-overview', label: 'Overview', description: 'Dashboard overview', keywords: ['overview', 'dashboard', 'home'], view: 'overview' },
  { id: 'nav-inquiries', label: 'My Inquiries', description: 'View your inquiries', keywords: ['inquiry', 'message', 'contact'], view: 'inquiries' },
  { id: 'nav-saved', label: 'Saved Items', description: 'Saved businesses and professionals', keywords: ['saved', 'bookmark', 'favorites'], view: 'saved' },
  { id: 'nav-activity', label: 'Activity', description: 'Your recent activity', keywords: ['activity', 'history', 'log'], view: 'activity' },
  { id: 'nav-settings', label: 'Settings', description: 'Account settings', keywords: ['settings', 'profile', 'preferences'], view: 'settings' },
]

export default function UserDashboard() {
  const { user, loading: authLoading, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { socket, isConnected } = useSocket()

  const { currentView, setCurrentView } = useDashboardRouter(VALID_USER_VIEWS, 'overview')

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const [inquiries, setInquiries] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [savedItems, setSavedItems] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const res = await fetch('/api/user/dashboard', {
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' },
        credentials: 'include',
      })
      clearTimeout(timeout)

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          await logout()
          router.push('/login')
          return
        }
        const data = await res.json().catch(() => ({ error: 'Service unavailable' }))
        setError(data.error || 'Failed to load dashboard')
        return
      }

      const dashboardData = await res.json()
      setData(dashboardData)
      setInquiries(dashboardData.inquiries || [])
      setActivity(dashboardData.activities || [])
      setSavedItems(dashboardData.savedItems || [])
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.')
      } else {
        setError('Connection failed. Please check your internet connection.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [user, logout, router])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
    if (user) {
      fetchData()
    }
  }, [authLoading, user, router, fetchData])

  // Socket.IO real-time sync
  useSocketSyncUser(socket, isConnected, {
    setInquiries,
    setNotifications,
    setActivity,
    setSavedItems,
    toast,
    userId: user?.id || '',
  })

  const {
    query: searchTerm,
    setQuery: setSearchTerm,
    displayResults: searchResults,
    addRecent,
  } = useDashboardSearch(SEARCH_INDEX, {
    recentStorageKey: RECENT_SEARCHES_KEY,
    maxRecent: 8,
  })

  const handleSearchResultSelect = useCallback(
    (result: any) => {
      addRecent(result)
      if (result.view && VALID_USER_VIEWS.includes(result.view as UserView)) {
        setCurrentView(result.view as UserView)
      }
      setSearchTerm('')
    },
    [addRecent, setCurrentView, setSearchTerm]
  )

  const navLinks = useMemo(
    () => [
      { title: 'Overview', icon: UserIcon, mobileIcon: UserIcon, value: 'overview', mobileTitle: 'Overview' },
      { title: 'My Inquiries', icon: FileText, mobileIcon: FileText, value: 'inquiries', mobileTitle: 'Inquiries' },
      { title: 'Saved Items', icon: Bookmark, mobileIcon: Bookmark, value: 'saved', mobileTitle: 'Saved' },
      { title: 'Activity', icon: Activity, mobileIcon: Activity, value: 'activity', mobileTitle: 'Activity' },
      { title: 'Settings', icon: Settings, mobileIcon: Settings, value: 'settings', mobileTitle: 'Settings' },
    ],
    []
  )

  const getSearchPlaceholder = () => {
    switch (currentView) {
      case 'inquiries': return 'Search inquiries...'
      case 'saved': return 'Search saved items...'
      case 'activity': return 'Search activity...'
      default: return 'Search dashboard...'
    }
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    switch (currentView) {
      case 'overview':
        return <UserOverview data={data} inquiries={inquiries} activity={activity} savedItems={savedItems} />
      case 'inquiries':
        return <UserInquiries inquiries={inquiries} />
      case 'saved':
        return <UserSavedItems savedItems={savedItems} />
      case 'activity':
        return <UserActivity activity={activity} />
      case 'settings':
        return <UserSettings />
      default:
        return <UserOverview data={data} inquiries={inquiries} activity={activity} savedItems={savedItems} />
    }
  }

  if (authLoading) {
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

  return (
    <RoleDashboardLayout
      role="USER"
      title="User Dashboard"
      headerIcon={UserIcon}
      navLinks={navLinks}
      currentView={currentView}
      onViewChange={(v) => setCurrentView(v as UserView)}
      onLogout={async () => { await logout(); router.push('/login') }}
      userName={user?.name || 'User'}
      userEmail={user?.email}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder={getSearchPlaceholder()}
      searchResults={searchResults as any}
      recentSearches={[]}
      onSearchResultSelect={handleSearchResultSelect}
      isLoading={isLoading}
      notificationBell={<NotificationBell userId={user.id} />}
    >
      {renderContent()}
    </RoleDashboardLayout>
  )
}
