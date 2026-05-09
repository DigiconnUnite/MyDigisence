import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateUser, generateToken } from "@/lib/auth";
import { createSession, getUserActiveSessions, invalidateUserSessions } from "@/lib/session";

const unifiedLoginSchema = z.object({
  identifier: z.string().min(1, "Email, username, or mobile is required"),
  password: z.string().min(1, "Password is required"),
  force: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, force = false } = unifiedLoginSchema.parse(body);

    // Authenticate user (supports email, username, or mobile)
    const user = await authenticateUser(identifier, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if email is verified (TEMPORARILY DISABLED FOR TESTING)
    const dbUser = await (await import("@/lib/db")).db.user.findUnique({
      where: { id: user.id }
    } as any);

    // Email verification temporarily disabled for v2 dashboard testing
    // if (!dbUser || !dbUser.emailVerified) {
    //   return NextResponse.json(
    //     { error: "Please verify your email first" },
    //     { status: 403 }
    //   );
    // }

    // Handle session management
    if (force) {
      await invalidateUserSessions(user.id);
    } else {
      const activeSessions = await getUserActiveSessions(user.id);
      if (activeSessions.length > 0) {
        return NextResponse.json(
          { error: "This account is already logged in on another device" },
          { status: 403 }
        );
      }
    }

    // Generate token and create session
    const token = generateToken(user);
    await createSession(user, token);

    // Determine redirect path based on user role and onboarding status
    let redirectPath = "/dashboard";
    
    // Only redirect to onboarding if user is truly new (no userPath set and onboarding not completed)
    if (!dbUser!.onboardingCompleted && !dbUser!.userPath) {
      redirectPath = "/onboarding";
    } else {
      // All users now redirect to dashboard - role-based routing handled there
      redirectPath = "/dashboard";
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: dbUser!.emailVerified,
        onboardingCompleted: dbUser!.onboardingCompleted,
        userPath: dbUser!.userPath || undefined,
      },
      redirectPath,
    });

    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error) {
    console.error("Unified login error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
