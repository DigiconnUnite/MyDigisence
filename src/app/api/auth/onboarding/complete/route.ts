import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { generateUniqueBusinessSlug, generateUniqueProfessionalSlug, generateUniqueCategorySlug } from "@/lib/slug-helpers";

const completeOnboardingSchema = z.object({
  userId: z.string(),
  path: z.enum(["BUSINESS", "PROFESSIONAL", "NORMAL_USER"]),
  // Business fields
  businessName: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  // Professional fields
  professionalName: z.string().optional(),
  profession: z.string().optional(),
  headline: z.string().optional(),
  aboutMe: z.string().optional(),
  // Normal user fields
  interests: z.array(z.string()).optional(),
  preferences: z.object({
    emailUpdates: z.boolean().optional(),
    smsAlerts: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
  }).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // 1. Parse FormData instead of JSON
    const formData = await request.formData();
    
    // 2. Extract text fields and files into separate objects
    const body: Record<string, any> = {};
    const files: Record<string, File> = {};

    formData.forEach((value, key) => {
      if (value instanceof File) {
        files[key] = value; // Store files separately (logo, cover, resume, etc.)
      } else {
        body[key] = value; // Store text fields for Zod validation
      }
    });

    // 3. Validate the text fields with Zod
    const { userId, path, ...onboardingData } = completeOnboardingSchema.parse(body);

    // Get current user
    const currentUser = await db.user.findUnique({
      where: { id: userId }
    } as any);

    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let updatedUser;
    let roleUpdate: any = {};

    // Handle different onboarding paths
    switch (path) {
      case "BUSINESS":
        if (!onboardingData.businessName || !onboardingData.category || !onboardingData.location) {
          return NextResponse.json(
            { error: "Business name, category, and location are required" },
            { status: 400 }
          );
        }

        // Find or create category
        let category = await db.category.findFirst({
          where: { name: onboardingData.category, type: 'BUSINESS' }
        });

        if (!category) {
          const categorySlug = await generateUniqueCategorySlug(onboardingData.category);
          category = await db.category.create({
            data: {
              name: onboardingData.category,
              slug: categorySlug,
              type: 'BUSINESS',
            }
          });
        }

        // Create business record
        const businessSlug = await generateUniqueBusinessSlug(onboardingData.businessName);
        await db.business.create({
          data: {
            name: onboardingData.businessName,
            slug: businessSlug,
            categoryId: category.id,
            address: onboardingData.location,
            phone: onboardingData.phone,
            email: currentUser.email,
            website: onboardingData.website,
            description: onboardingData.description,
            adminId: userId,
          }
        });

        roleUpdate = { role: 'BUSINESS_ADMIN' as any };
        break;

      case "PROFESSIONAL":
        if (!onboardingData.professionalName || !onboardingData.profession) {
          return NextResponse.json(
            { error: "Professional name and profession are required" },
            { status: 400 }
          );
        }

        // Create professional record
        const professionalSlug = await generateUniqueProfessionalSlug(onboardingData.professionalName);
        await db.professional.create({
          data: {
            name: onboardingData.professionalName,
            slug: professionalSlug,
            professionName: onboardingData.profession,
            professionalHeadline: onboardingData.headline,
            aboutMe: onboardingData.aboutMe,
            location: onboardingData.location,
            phone: onboardingData.phone,
            email: currentUser.email,
            website: onboardingData.website,
            adminId: userId,
          }
        } as any);

        roleUpdate = { role: 'PROFESSIONAL_ADMIN' as any };
        break;

      case "NORMAL_USER":
        // For normal users, just update preferences
        break;
    }

    // Update user with onboarding completion
    updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        ...roleUpdate,
        userPath: path,
        onboardingCompleted: true,
      }
    } as any);

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        userPath: updatedUser.userPath,
        onboardingCompleted: updatedUser.onboardingCompleted,
      },
      // Removed updatedUser.userPath argument since it wasn't being used in the function
      redirectPath: getRedirectPath(updatedUser.role)
    });

  } catch (error) {
    console.error("Complete onboarding error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred during onboarding completion" },
      { status: 500 }
    );
  }
}

// Updated signature to accept null and removed unused userPath parameter
function getRedirectPath(role: string | null): string {
  switch (role) {
    case 'BUSINESS_ADMIN':
      return '/dashboard/business';
    case 'PROFESSIONAL_ADMIN':
      return '/dashboard/professional';
    case 'USER':
      return '/dashboard/user';
    default:
      return '/dashboard';
  }
}