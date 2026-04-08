import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/jwt'
import { broadcast } from '@/lib/socket'
import { parseCSV, mapCSVToBusinessData, ParseError, generateCSVTemplate } from '@/lib/utils/csvParser'
import { sendBulkImportNotification } from '@/lib/email'

// Generate secure password
const generateSecurePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = 'Adm@'
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

async function getSuperAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request) || request.cookies.get('auth-token')?.value

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'SUPER_ADMIN') {
    return null
  }

  return payload
}

async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1
  while (await db.business.findFirst({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  return slug
}

// POST /api/admin/businesses/import - Import businesses from CSV
export async function POST(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const categoryId = formData.get('categoryId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'File must be a CSV file' },
        { status: 400 }
      )
    }

    // Read file content
    const fileContent = await file.text()
    
    // Parse CSV
    const parseResult = parseCSV(fileContent)
    const { data, errors, meta } = parseResult

    if (data.length === 0) {
      return NextResponse.json(
        { 
          error: 'No valid data found in CSV',
          parseErrors: errors,
        },
        { status: 400 }
      )
    }

    // If there are errors, still proceed but report them
    const hasErrors = errors.length > 0

    // Get all categories for mapping
    const categories = await db.category.findMany({
      select: { id: true, name: true },
    })

    const categoryMap = new Map(
      categories.map((c) => [c.name.toLowerCase(), c.id])
    )

    // Create businesses in transaction
    const importResult = await db.$transaction(async (tx) => {
      const created: Array<{id: string; name: string; email: string; password: string}> = []
      const failed: Array<{row: number; errors: ParseError[]}> = []
      const skipped: number[] = []

      for (let i = 0; i < data.length; i++) {
        const row = data[i]
        const rowNumber = i + 2 // +2 because CSV is 0-indexed and header is row 1
        const normalizedEmail = row.email.trim().toLowerCase()

        try {
          // Check if email already exists
          const existingUser = await tx.user.findUnique({
            where: { email: normalizedEmail },
          })

          if (existingUser) {
            skipped.push(rowNumber)
            continue
          }

          // Map CSV data to business data
          const businessData = mapCSVToBusinessData(row)
          
          // Use provided categoryId or try to find by name
          const finalCategoryId = categoryId || 
            (row.category ? categoryMap.get(row.category.toLowerCase()) : null)

          // Generate password
          const password = generateSecurePassword()
          const { hashPassword } = await import('@/lib/auth')
          const hashedPassword = await hashPassword(password)

          // Generate unique slug
          const baseSlug = businessData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          const slug = await generateUniqueSlug(baseSlug)

          // Create user and business
          const user = await tx.user.create({
            data: {
              email: normalizedEmail,
              name: businessData.adminName,
              password: hashedPassword,
              role: 'BUSINESS_ADMIN',
            },
          })

          const business = await tx.business.create({
            data: {
              name: businessData.name,
              slug,
              description: businessData.description || undefined,
              phone: businessData.phone || undefined,
              website: businessData.website || undefined,
              address: businessData.address || undefined,
              categoryId: finalCategoryId || undefined,
              adminId: user.id,
            },
            include: {
              admin: { select: { id: true, email: true, name: true } },
              category: { select: { id: true, name: true } },
              _count: { select: { products: true, inquiries: true } },
            },
          })

          created.push({
            id: business.id,
            name: business.name,
            email: user.email,
            password: password, // Return plain password for admin to see
          })
        } catch (error: any) {
          failed.push({
            row: rowNumber,
            errors: [{ row: rowNumber, message: error.message }],
          })
        }
      }

      return { created, failed, skipped }
    })

    // Send bulk import notification to admin
    try {
      const adminUser = await db.user.findUnique({
        where: { id: admin.userId },
        select: { email: true },
      })
      
      if (adminUser) {
        // Transform failed rows to match expected format
        const transformedFailedRows = importResult.failed.map(f => ({
          row: f.row,
          error: f.errors.map(e => e.message).join(', '),
        }))
        
        await sendBulkImportNotification({
          adminEmail: adminUser.email,
          successCount: importResult.created.length,
          failedCount: importResult.failed.length,
          failedRows: transformedFailedRows,
          importType: 'business',
          adminUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com'}/admin/businesses`,
        })
      }
    } catch (emailError) {
      console.error('Failed to send bulk import notification:', emailError)
      // Don't fail the request if email fails
    }

    // Emit Socket.IO event for real-time update
    if (importResult.created.length > 0) {
      broadcast('business-created', {
        action: 'bulk-import',
        count: importResult.created.length,
        timestamp: new Date().toISOString(),
        adminId: admin.userId
      })
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: data.length,
        created: importResult.created.length,
        failed: importResult.failed.length,
        skipped: importResult.skipped.length,
      },
      createdBusinesses: importResult.created,
      parseErrors: hasErrors ? errors : undefined,
      failedRows: importResult.failed.length > 0 ? importResult.failed : undefined,
      skippedRows: importResult.skipped.length > 0 ? importResult.skipped : undefined,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to import businesses' },
      { status: 500 }
    )
  }
}

// GET /api/admin/businesses/import/template - Get CSV template
export async function GET(request: NextRequest) {
  const admin = await getSuperAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const template = generateCSVTemplate()

  return new NextResponse(template, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="business_import_template.csv"',
    },
  })
}
