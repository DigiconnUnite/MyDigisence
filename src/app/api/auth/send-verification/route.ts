import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOTP, canResendOTP } from "@/lib/otp";
import { db } from "@/lib/db";

const sendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = sendVerificationSchema.parse(body);

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    } as any);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Check if can resend OTP (rate limiting)
    if (!canResendOTP(email)) {
      return NextResponse.json(
        { error: "Please wait before requesting another verification code" },
        { status: 429 }
      );
    }

    // Send verification email
    const otpResult = await sendOTP(
      email.toLowerCase(),
      user.name || "User",
      'email_verification'
    );

    if (!otpResult.success) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
    });

  } catch (error) {
    console.error("Send verification error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while sending verification code" },
      { status: 500 }
    );
  }
}
