import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db as prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { verifyOTP } from '@/lib/otp';

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email: rawEmail, otp, password } = resetPasswordSchema.parse(body);
    
    // Normalize email to lowercase for case-insensitive matching
    const email = rawEmail.toLowerCase();

    // Verify OTP
    const otpResult = verifyOTP(email, otp, 'password_reset');
    
    if (!otpResult.valid) {
      return NextResponse.json(
        { error: otpResult.message },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}