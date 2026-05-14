'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Bell, X, Check, Trash2 } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  link?: string
}

interface NotificationBellProps {
  userId: string
  onNotificationClick?: (notification: Notification) => void
}

export default function NotificationBell({ userId, onNotificationClick }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`, {
        headers: { 'Cache-Control': 'no-cache' }
      })
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications)
        setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }, [userId])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }, [])

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    onNotificationClick?.(notification)
    if (notification.link) {
      window.location.href = notification.link
    }
    setIsOpen(false)
  }, [markAsRead, onNotificationClick])

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-amber-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-72">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getTypeStyles(notification.type)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Mark as read"
                        >
                          <Check className="h-3 w-3 text-blue-600" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
