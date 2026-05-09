import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request) ?? request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token) as any
    
    if (!user || user.role !== 'USER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get user's dashboard data
    const [inquiriesCount, savedBusinesses, savedProfessionals] = await Promise.all([
      // Count user's inquiries
      db.inquiry.count({
        where: {
          userId: user.userId
        }
      }),
      
      // Get user's saved businesses (this would need a saved items table)
      // For now, return empty array
      Promise.resolve([]),
      
      // Get user's saved professionals (this would need a saved items table)
      // For now, return empty array
      Promise.resolve([])
    ])

    // Calculate profile completion
    const dbUser = await db.user.findUnique({
      where: { id: user.userId },
      select: {
        name: true,
        email: true,
        mobile: true,
        username: true
      }
    })

    let profileCompletion = 0
    if (dbUser) {
      const fields = ['name', 'email', 'mobile', 'username'] as const
      const completedFields = fields.filter(field => dbUser[field]).length
      profileCompletion = Math.round((completedFields / fields.length) * 100)
    }

    const dashboardData = {
      user: {
        id: user.userId,
        email: user.email,
        name: dbUser?.name,
        profileCompletion
      },
      stats: {
        totalInquiries: inquiriesCount,
        savedBusinesses: savedBusinesses.length,
        savedProfessionals: savedProfessionals.length
      },
      recentActivity: [], // Would be populated from activity logs
      quickActions: [
        {
          title: 'Browse Businesses',
          description: 'Discover local businesses and services',
          href: '/businesses'
        },
        {
          title: 'Find Professionals',
          description: 'Connect with skilled professionals',
          href: '/professionals'
        },
        {
          title: 'Update Profile',
          description: 'Complete your profile information',
          href: '/dashboard/user/settings'
        }
      ]
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('User dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
