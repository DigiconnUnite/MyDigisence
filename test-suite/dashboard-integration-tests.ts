import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

describe('Dashboard Shared Hooks', () => {
  describe('useDashboardRouter', () => {
    it('initializes with default view', () => {
      const { useDashboardRouter } = require('../src/app/dashboard/hooks/useDashboardRouter')
      const { result } = renderHook(() =>
        useDashboardRouter(['overview', 'settings'] as const, 'overview')
      )
      expect(result.current.currentView).toBe('overview')
    })

    it('validates views correctly', () => {
      const { useDashboardRouter } = require('../src/app/dashboard/hooks/useDashboardRouter')
      const { result } = renderHook(() =>
        useDashboardRouter(['overview', 'settings'] as const, 'overview')
      )
      expect(result.current.isValidView('overview')).toBe(true)
      expect(result.current.isValidView('invalid')).toBe(false)
    })

    it('navigates to valid views', () => {
      const { useDashboardRouter } = require('../src/app/dashboard/hooks/useDashboardRouter')
      const { result } = renderHook(() =>
        useDashboardRouter(['overview', 'settings'] as const, 'overview')
      )
      act(() => {
        result.current.setCurrentView('settings')
      })
      expect(result.current.currentView).toBe('settings')
    })

    it('rejects invalid views', () => {
      const { useDashboardRouter } = require('../src/app/dashboard/hooks/useDashboardRouter')
      const { result } = renderHook(() =>
        useDashboardRouter(['overview', 'settings'] as const, 'overview')
      )
      act(() => {
        result.current.setCurrentView('invalid')
      })
      expect(result.current.currentView).toBe('overview')
    })
  })

  describe('useDashboardSearch', () => {
    it('returns empty results for empty query', () => {
      const { useDashboardSearch } = require('../src/app/dashboard/hooks/useDashboardSearch')
      const index = [
        { id: '1', label: 'Test', description: 'Desc', keywords: ['test'] },
      ]
      const { result } = renderHook(() => useDashboardSearch(index))
      expect(result.current.results).toEqual([])
    })

    it('returns matching results', () => {
      const { useDashboardSearch } = require('../src/app/dashboard/hooks/useDashboardSearch')
      const index = [
        { id: '1', label: 'Test Item', description: 'Description', keywords: ['test'] },
      ]
      const { result } = renderHook(() => useDashboardSearch(index))
      act(() => {
        result.current.setQuery('test')
      })
      expect(result.current.results.length).toBeGreaterThan(0)
    })

    it('limits results to maxResults', () => {
      const { useDashboardSearch } = require('../src/app/dashboard/hooks/useDashboardSearch')
      const index = Array.from({ length: 20 }, (_, i) => ({
        id: String(i),
        label: `Item ${i}`,
        description: 'Desc',
        keywords: ['item'],
      }))
      const { result } = renderHook(() =>
        useDashboardSearch(index, { maxResults: 5 })
      )
      act(() => {
        result.current.setQuery('item')
      })
      expect(result.current.results.length).toBeLessThanOrEqual(5)
    })
  })

  describe('useDashboardPagination', () => {
    it('initializes with default state', () => {
      const { useDashboardPagination } = require('../src/app/dashboard/hooks/useDashboardPagination')
      const { result } = renderHook(() => useDashboardPagination())
      expect(result.current.page).toBe(1)
      expect(result.current.limit).toBe(10)
    })

    it('changes page', () => {
      const { useDashboardPagination } = require('../src/app/dashboard/hooks/useDashboardPagination')
      const { result } = renderHook(() => useDashboardPagination())
      act(() => {
        result.current.setPage(3)
      })
      expect(result.current.page).toBe(3)
    })

    it('resets page when limit changes', () => {
      const { useDashboardPagination } = require('../src/app/dashboard/hooks/useDashboardPagination')
      const { result } = renderHook(() => useDashboardPagination({ page: 5, limit: 10 }))
      act(() => {
        result.current.setLimit(25)
      })
      expect(result.current.page).toBe(1)
      expect(result.current.limit).toBe(25)
    })

    it('nextPage increments', () => {
      const { useDashboardPagination } = require('../src/app/dashboard/hooks/useDashboardPagination')
      const { result } = renderHook(() => useDashboardPagination())
      act(() => {
        result.current.nextPage()
      })
      expect(result.current.page).toBe(2)
    })

    it('prevPage decrements with floor at 1', () => {
      const { useDashboardPagination } = require('../src/app/dashboard/hooks/useDashboardPagination')
      const { result } = renderHook(() => useDashboardPagination({ page: 2, limit: 10 }))
      act(() => {
        result.current.prevPage()
      })
      expect(result.current.page).toBe(1)
      act(() => {
        result.current.prevPage()
      })
      expect(result.current.page).toBe(1)
    })
  })

  describe('useDashboardSelection', () => {
    it('initializes empty', () => {
      const { useDashboardSelection } = require('../src/app/dashboard/hooks/useDashboardSelection')
      const { result } = renderHook(() => useDashboardSelection<string>())
      expect(result.current.selected.size).toBe(0)
    })

    it('toggles items', () => {
      const { useDashboardSelection } = require('../src/app/dashboard/hooks/useDashboardSelection')
      const { result } = renderHook(() => useDashboardSelection<string>())
      act(() => {
        result.current.toggle('a')
      })
      expect(result.current.selected.has('a')).toBe(true)
      act(() => {
        result.current.toggle('a')
      })
      expect(result.current.selected.has('a')).toBe(false)
    })

    it('selects all', () => {
      const { useDashboardSelection } = require('../src/app/dashboard/hooks/useDashboardSelection')
      const { result } = renderHook(() => useDashboardSelection<string>())
      act(() => {
        result.current.selectAll(['a', 'b', 'c'])
      })
      expect(result.current.selectedArray).toEqual(['a', 'b', 'c'])
    })

    it('deselects all', () => {
      const { useDashboardSelection } = require('../src/app/dashboard/hooks/useDashboardSelection')
      const { result } = renderHook(() => useDashboardSelection<string>())
      act(() => {
        result.current.selectAll(['a', 'b'])
        result.current.deselectAll()
      })
      expect(result.current.selected.size).toBe(0)
    })

    it('checks isSelected', () => {
      const { useDashboardSelection } = require('../src/app/dashboard/hooks/useDashboardSelection')
      const { result } = renderHook(() => useDashboardSelection<string>())
      act(() => {
        result.current.toggle('x')
      })
      expect(result.current.isSelected('x')).toBe(true)
      expect(result.current.isSelected('y')).toBe(false)
    })
  })

  describe('useDashboardKeyboardShortcuts', () => {
    it('registers keyboard shortcut', () => {
      const { useDashboardKeyboardShortcuts } = require('../src/app/dashboard/hooks/useDashboardKeyboardShortcuts')
      const action = vi.fn()
      renderHook(() =>
        useDashboardKeyboardShortcuts([
          { key: 'k', ctrlKey: true, action, description: 'Test' },
        ])
      )
      const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
      window.dispatchEvent(event)
      expect(action).toHaveBeenCalled()
    })

    it('does not fire when disabled', () => {
      const { useDashboardKeyboardShortcuts } = require('../src/app/dashboard/hooks/useDashboardKeyboardShortcuts')
      const action = vi.fn()
      renderHook(() =>
        useDashboardKeyboardShortcuts(
          [{ key: 'k', ctrlKey: true, action, description: 'Test' }],
          false
        )
      )
      const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
      window.dispatchEvent(event)
      expect(action).not.toHaveBeenCalled()
    })

    it('ignores non-matching shortcuts', () => {
      const { useDashboardKeyboardShortcuts } = require('../src/app/dashboard/hooks/useDashboardKeyboardShortcuts')
      const action = vi.fn()
      renderHook(() =>
        useDashboardKeyboardShortcuts([
          { key: 'k', ctrlKey: true, action, description: 'Test' },
        ])
      )
      const event = new KeyboardEvent('keydown', { key: 'j', ctrlKey: true })
      window.dispatchEvent(event)
      expect(action).not.toHaveBeenCalled()
    })
  })
})

describe('Admin Dashboard Hook', () => {
  it('initializes with correct default state', () => {
    const { useAdminDashboard } = require('../src/app/dashboard/admin/hooks/useAdminDashboard')
    const { result } = renderHook(() => useAdminDashboard())
    expect(result.current.currentView).toBe('dashboard')
    expect(result.current.stats.totalBusinesses).toBe(0)
    expect(result.current.businesses).toEqual([])
    expect(result.current.professionals).toEqual([])
    expect(result.current.categories).toEqual([])
    expect(result.current.inquiries).toEqual([])
  })

  it('has all required handlers', () => {
    const { useAdminDashboard } = require('../src/app/dashboard/admin/hooks/useAdminDashboard')
    const { result } = renderHook(() => useAdminDashboard())
    expect(typeof result.current.handleAddBusiness).toBe('function')
    expect(typeof result.current.handleUpdateBusiness).toBe('function')
    expect(typeof result.current.handleDeleteBusiness).toBe('function')
    expect(typeof result.current.handleToggleBusinessStatus).toBe('function')
    expect(typeof result.current.handleDuplicateBusiness).toBe('function')
    expect(typeof result.current.handleAddProfessional).toBe('function')
    expect(typeof result.current.handleUpdateProfessional).toBe('function')
    expect(typeof result.current.handleDeleteProfessional).toBe('function')
    expect(typeof result.current.handleToggleProfessionalStatus).toBe('function')
    expect(typeof result.current.handleAddCategory).toBe('function')
    expect(typeof result.current.handleUpdateCategory).toBe('function')
    expect(typeof result.current.handleDeleteCategory).toBe('function')
    expect(typeof result.current.handleRejectInquiry).toBe('function')
    expect(typeof result.current.confirmRejectInquiry).toBe('function')
    expect(typeof result.current.handleBusinessBulkDelete).toBe('function')
    expect(typeof result.current.handleProfessionalBulkDelete).toBe('function')
  })
})

describe('Business Dashboard Hook', () => {
  it('initializes with default view', () => {
    const { useBusinessDashboard } = require('../src/app/dashboard/business/hooks/useBusinessDashboard')
    const { result } = renderHook(() =>
      useBusinessDashboard({
        products: [],
        inquiries: [],
        categories: [],
        brands: [],
        onNavigateToProducts: vi.fn(),
        onNavigateToInquiries: vi.fn(),
        onNavigateToCategories: vi.fn(),
        onNavigateToBrands: vi.fn(),
      })
    )
    expect(result.current.currentView).toBe('dashboard')
    expect(result.current.searchTerm).toBe('')
  })

  it('builds search index from data', () => {
    const { useBusinessDashboard } = require('../src/app/dashboard/business/hooks/useBusinessDashboard')
    const { result } = renderHook(() =>
      useBusinessDashboard({
        products: [{ id: 'p1', name: 'Widget', description: 'A widget' }],
        inquiries: [{ id: 'i1', name: 'John', message: 'Hello' }],
        categories: [{ id: 'c1', name: 'Tech', description: 'Technology' }],
        brands: [{ id: 'b1', name: 'Acme', description: 'Acme Corp' }],
        onNavigateToProducts: vi.fn(),
        onNavigateToInquiries: vi.fn(),
        onNavigateToCategories: vi.fn(),
        onNavigateToBrands: vi.fn(),
      })
    )
    act(() => {
      result.current.setSearchTerm('widget')
    })
    expect(result.current.searchResults.length).toBeGreaterThan(0)
  })
})

describe('Socket Sync Hooks', () => {
  describe('useSocketSyncBusiness', () => {
    it('registers and unregisters socket listeners', () => {
      const mockSocket = {
        on: vi.fn(),
        off: vi.fn(),
      }
      const { useSocketSyncBusiness } = require('../src/app/dashboard/business/hooks/useSocketSyncBusiness')
      const setProducts = vi.fn()
      const setInquiries = vi.fn()
      const setCategories = vi.fn()
      const setBrands = vi.fn()
      const setStats = vi.fn()

      const { unmount } = renderHook(() =>
        useSocketSyncBusiness(mockSocket as any, true, {
          setProducts,
          setInquiries,
          setCategories,
          setBrands,
          setStats,
          toast: vi.fn(),
          businessId: 'biz-123',
        })
      )

      expect(mockSocket.on).toHaveBeenCalledWith('product:created', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('product:updated', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('product:deleted', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('inquiry:created', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('inquiry:updated', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('category:created', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('category:deleted', expect.any(Function))

      unmount()
      expect(mockSocket.off).toHaveBeenCalledTimes(7)
    })
  })

  describe('useSocketSyncProfessional', () => {
    it('registers professional socket listeners', () => {
      const mockSocket = {
        on: vi.fn(),
        off: vi.fn(),
      }
      const { useSocketSyncProfessional } = require('../src/app/dashboard/professional/hooks/useSocketSyncProfessional')
      const { unmount } = renderHook(() =>
        useSocketSyncProfessional(mockSocket as any, true, {
          setServices: vi.fn(),
          setEnquiries: vi.fn(),
          setAppointments: vi.fn(),
          setMessages: vi.fn(),
          setStats: vi.fn(),
          toast: vi.fn(),
          professionalId: 'prof-123',
        })
      )

      expect(mockSocket.on).toHaveBeenCalledWith('enquiry:created', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('enquiry:updated', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('appointment:created', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('appointment:updated', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('message:received', expect.any(Function))

      unmount()
      expect(mockSocket.off).toHaveBeenCalledTimes(5)
    })
  })

  describe('useSocketSyncUser', () => {
    it('registers user socket listeners', () => {
      const mockSocket = {
        on: vi.fn(),
        off: vi.fn(),
      }
      const { useSocketSyncUser } = require('../src/app/dashboard/user/hooks/useSocketSyncUser')
      const { unmount } = renderHook(() =>
        useSocketSyncUser(mockSocket as any, true, {
          setInquiries: vi.fn(),
          setNotifications: vi.fn(),
          setActivity: vi.fn(),
          setSavedItems: vi.fn(),
          toast: vi.fn(),
          userId: 'user-123',
        })
      )

      expect(mockSocket.on).toHaveBeenCalledWith('inquiry:status-changed', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('notification:received', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('activity:added', expect.any(Function))
      expect(mockSocket.on).toHaveBeenCalledWith('saved-item:removed', expect.any(Function))

      unmount()
      expect(mockSocket.off).toHaveBeenCalledTimes(4)
    })
  })
})

describe('Notification Center', () => {
  it('renders notification bell with zero unread', () => {
    const React = require('react')
    const { render } = require('@testing-library/react')
    const NotificationBell = require('../src/app/dashboard/components/NotificationBell').default
    const { container } = render(
      React.createElement(NotificationBell, { userId: 'user-123' })
    )
    expect(container.querySelector('[aria-label="Notifications"]')).toBeTruthy()
  })
})

describe('Global Search API', () => {
  it('GET /api/search requires auth', async () => {
    const { GET } = require('../src/app/api/search/route')
    const req = new Request('http://localhost/api/search?query=test')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })
})

describe('Notifications API', () => {
  it('GET /api/notifications requires auth', async () => {
    const { GET } = require('../src/app/api/notifications/route')
    const req = new Request('http://localhost/api/notifications')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('POST /api/notifications/read-all requires auth', async () => {
    const { POST } = require('../src/app/api/notifications/read-all/route')
    const req = new Request('http://localhost/api/notifications/read-all')
    const res = await POST(req)
    expect(res.status).toBe(401)
  })
})

describe('User Dashboard API', () => {
  it('GET /api/user/dashboard requires USER role', async () => {
    const { GET } = require('../src/app/api/user/dashboard/route')
    const req = new Request('http://localhost/api/user/dashboard')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })
})

describe('RoleDashboardLayout', () => {
  it('renders loading state', () => {
    const React = require('react')
    const { render } = require('@testing-library/react')
    const RoleDashboardLayout = require('../src/app/dashboard/components/RoleDashboardLayout').default
    const { container } = render(
      React.createElement(
        RoleDashboardLayout,
        {
          role: 'USER',
          title: 'Test Dashboard',
          headerIcon: {} as any,
          navLinks: [],
          currentView: 'overview',
          onViewChange: () => {},
          onLogout: () => {},
          userName: 'Test',
          searchValue: '',
          onSearchChange: () => {},
          searchPlaceholder: 'Search...',
          isLoading: true,
        },
        React.createElement('div', null, 'Content')
      )
    )
    expect(container.textContent).toContain('Loading')
  })
})
