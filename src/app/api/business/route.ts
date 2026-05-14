import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const updateBusinessSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z0-9\s\-&.,()]+$/, "Name contains invalid characters")
    .optional(),
  description: z.string().max(1000).optional(),
  about: z.string().max(2000).optional(),

  // 1. ADDED: Accept logoUrl from frontend
  logoUrl: z
    .string()
    .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
      message:
        "Logo must be a valid URL starting with http:// or https://, or empty",
    })
    .optional(),

  // Keep logo for compatibility
  logo: z
    .string()
    .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
      message:
        "Logo must be a valid URL starting with http:// or https://, or empty",
    })
    .optional(),

  address: z.string().max(500).optional(),
  phone: z
    .string()
    .regex(/^[\+]?[\d][\d\s\-\(\)]{0,20}$/, "Invalid phone format")
    .optional(),
  email: z.string().email().optional(),
  website: z
    .string()
    .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
      message:
        "Website must be a valid URL starting with http:// or https://, or empty",
    })
    .optional(),
  facebook: z
    .string()
    .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
      message:
        "Facebook must be a valid URL starting with http:// or https://, or empty",
    })
    .optional(),
  twitter: z
    .string()
    .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
      message:
        "Twitter must be a valid URL starting with http:// or https://, or empty",
    })
    .optional(),
  instagram: z
    .string()
    .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
      message:
        "Instagram must be a valid URL starting with http:// or https://, or empty",
    })
    .optional(),
  linkedin: z
    .string()
    .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
      message:
        "LinkedIn must be a valid URL starting with http:// or https://, or empty",
    })
    .optional(),
  catalogPdf: z
    .string()
    .refine((val) => val === "" || /^https?:\/\/.+/.test(val), {
      message:
        "Catalog PDF must be a valid URL starting with http:// or https://, or empty",
    })
    .optional(),
  openingHours: z
    .array(
      z.object({
        day: z.string(),
        open: z.string().optional(),
        close: z.string().optional(),
      }),
    )
    .optional(),
  gstNumber: z.string().max(50).optional(),
  categoryId: z.string().nullable().optional(),
  heroContent: z.any().optional(),
  brandContent: z.any().optional(),
  portfolioContent: z.any().optional(),
  isActive: z.boolean().optional(),
  ownerName: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z\s\-.,]+$/, "Owner name contains invalid characters")
    .optional(),
  slug: z.string().optional(),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6),
});

async function getBusinessAdmin(request: NextRequest) {
  const token =
    getTokenFromRequest(request) || request.cookies.get("auth-token")?.value;

  console.log("getBusinessAdmin - Token present:", !!token);
  if (!token) {
    console.log("getBusinessAdmin - No token found");
    return null;
  }

  const payload = verifyToken(token);
  console.log("getBusinessAdmin - Payload:", payload ? { userId: payload.userId, role: payload.role } : null);
  if (!payload || payload.role !== "BUSINESS_ADMIN") {
    console.log("getBusinessAdmin - Invalid payload or role:", payload?.role);
    return null;
  }

  return payload;
}

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/business - Starting request");
    const admin = await getBusinessAdmin(request);
    console.log("GET /api/business - Admin:", admin ? { userId: admin.userId, role: admin.role } : null);
    if (!admin) {
      console.log("GET /api/business - Unauthorized: No admin found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("GET /api/business - Fetching business for adminId:", admin.userId);
    const business = await db.business.findUnique({
      where: { adminId: admin.userId },
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
            inquiries: true,
          },
        },
      },
    });

    console.log("GET /api/business - Business found:", !!business);
    if (!business) {
      console.log("GET /api/business - Business not found for adminId:", admin.userId);
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    // Ensure content fields are included in response
    const businessWithContent = business as any;
    businessWithContent.heroContent = businessWithContent.heroContent || {
      slides: [],
    };
    businessWithContent.brandContent = businessWithContent.brandContent || {
      brands: [],
    };
    businessWithContent.portfolioContent =
      businessWithContent.portfolioContent || { images: [] };

    console.log("GET /api/business - Successfully returning business data");
    return NextResponse.json({ business: businessWithContent });
  } catch (error) {
    console.error("GET /api/business - Error:", error);
    console.error("GET /api/business - Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("GET /api/business - Error message:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getBusinessAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(`business_update_${admin.userId}`);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const updateData = updateBusinessSchema.parse(body);

    // Direct update - let Prisma handle non-existent records
    // First get the current business for comparison
    const existingBusiness = await db.business.findUnique({
      where: { adminId: admin.userId },
      select: { id: true, name: true }
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    const { ownerName, ...restData } = updateData;

    // 2. MAP LOGO: Prioritize logoUrl (from upload) or logo (legacy)
    const finalLogoUrl = updateData.logoUrl || updateData.logo;

    // Filter out empty strings and convert to null for database
    // We also explicitly filter out 'logo' and 'logoUrl' here to handle them manually below
    const cleanBusinessUpdateData = Object.fromEntries(
      Object.entries(restData)
        .filter(([key]) => key !== "logo" && key !== "logoUrl")
        .map(([key, value]) => [key, value === "" ? null : value]),
    );

    // FIX H-3: Preserve existing slug to avoid breaking public URLs
    // Slugs should NOT be regenerated when business name changes
    // This ensures existing bookmarks, shared links, and indexed URLs remain valid
    let updateFields = { ...cleanBusinessUpdateData };

    // 3. ASSIGN LOGO FIELD
    if (finalLogoUrl !== undefined) {
      updateFields.logo = finalLogoUrl;
      console.log("Updating logo in database to:", finalLogoUrl);
    }

    // Remove slug from update fields to preserve existing slug
    // Business admins cannot change the slug after initial creation
    delete updateFields.slug;

    const business = await db.business.update({
      where: { id: existingBusiness.id },
      data: updateFields,
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update owner name if provided and not empty
    if (ownerName !== undefined && ownerName.trim() !== "") {
      await db.user.update({
        where: { id: admin.userId },
        data: { name: ownerName.trim() },
      });
      // Update the business response to include the new name
      business.admin.name = ownerName.trim();
    }

    // Ensure content fields are included in response
    const businessWithContent = business as any;
    businessWithContent.heroContent = businessWithContent.heroContent || {
      slides: [],
    };
    businessWithContent.brandContent = businessWithContent.brandContent || {
      brands: [],
    };
    businessWithContent.portfolioContent =
      businessWithContent.portfolioContent || { images: [] };

    return NextResponse.json({
      success: true,
      business: businessWithContent,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Business update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getBusinessAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { newPassword } = resetPasswordSchema.parse(body);

    // Check if business exists and belongs to this admin
    const business = await db.business.findUnique({
      where: { adminId: admin.userId },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    // Generate new password
    const { hashPassword } = await import("@/lib/auth");
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await db.user.update({
      where: { id: business.adminId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
