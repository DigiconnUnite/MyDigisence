import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyOTP } from "@/lib/otp";
import { db } from "@/lib/db";

const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = verifyEmailSchema.parse(body);

    // Verify OTP
    const otpResult = verifyOTP(email.toLowerCase(), otp, 'email_verification');

    if (!otpResult.valid) {
      return NextResponse.json(
        { error: otpResult.message },
        { status: 400 }
      );
    }

    // Update user email verification status
    const updatedUser = await db.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: true }
    } as any);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        emailVerified: true,
        onboardingCompleted: updatedUser.onboardingCompleted,
      }
    });

  } catch (error) {
    console.error("Email verification error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred during email verification" },
      { status: 500 }
    );
  }
}
