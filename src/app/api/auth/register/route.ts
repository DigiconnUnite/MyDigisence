import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/auth";
import { sendOTP } from "@/lib/otp";
import { db } from "@/lib/db";
import { validatePhoneNumber, formatToE164 } from "@/lib/phone-utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(6, "Please enter a valid mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, mobile, password } = registerSchema.parse(body);

    // Normalize phone number to E.164 format
    const normalizedMobile = formatToE164(mobile, 'US'); // Default to US if no country detected

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: { equals: email.toLowerCase(), mode: 'insensitive' } },
          { username: { equals: email.toLowerCase(), mode: 'insensitive' } },
          { mobile: normalizedMobile }
        ]
      }
    } as any);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email, username, or mobile already exists" },
        { status: 400 }
      );
    }

    // Create new user with default USER role
    const user = await createUser(
      email.toLowerCase(),
      password,
      name,
      'USER' as any,
      undefined, // username
      normalizedMobile
    );

    // Send verification email
    const otpResult = await sendOTP(
      email.toLowerCase(),
      name || "User",
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
      message: "Registration successful. Please check your email for verification code.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: false,
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
