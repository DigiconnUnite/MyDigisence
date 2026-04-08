import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db as prisma } from '@/lib/db';
import { sendOTP, canResendOTP, getOTPExpirySeconds } from '@/lib/otp';

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email: rawEmail } = forgotPasswordSchema.parse(body);
    
    // Normalize email to lowercase for case-insensitive matching
    const email = rawEmail.toLowerCase();

    console.log('[Forgot Password] Processing request for:', email);

    // Find user by email in User table
    let user = await prisma.user.findUnique({
      where: { email },
    });

    console.log('[Forgot Password] User found in User table:', user ? 'yes' : 'no');

    // If not found in User table, check RegistrationInquiry for pending registrations
    if (!user) {
      const registration = await prisma.registrationInquiry.findFirst({
        where: { email },
      });
      
      console.log('[Forgot Password] Registration found:', registration ? 'yes' : 'no');
      
      if (registration) {
        // Return message that account is not yet approved
        return NextResponse.json(
          { message: "Your registration is still pending approval. Please contact support." },
          { status: 400 }
        );
      }
    }

    // If still not found, check Business table
    if (!user) {
      const business = await prisma.business.findFirst({
        where: { email },
        include: { admin: true }
      });
      
      console.log('[Forgot Password] Business found:', business ? 'yes' : 'no');
      
      if (business?.admin) {
        user = business.admin;
        console.log('[Forgot Password] Found user via Business table');
      }
    }

    // If still not found, check Professional table
    if (!user) {
      const professional = await prisma.professional.findFirst({
        where: { email },
        include: { admin: true }
      });
      
      console.log('[Forgot Password] Professional found:', professional ? 'yes' : 'no');
      
      if (professional?.admin) {
        user = professional.admin;
        console.log('[Forgot Password] Found user via Professional table');
      }
    }

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: "If an account exists with this email, a reset code has been sent." },
        { status: 200 }
      );
    }

    // Check if OTP can be resent (rate limiting)
    if (!canResendOTP(email)) {
      const remainingSeconds = getOTPExpirySeconds(email);
      return NextResponse.json(
        { 
          message: "Please wait before requesting another OTP.",
          cooldown: remainingSeconds > 0 ? remainingSeconds : 60
        },
        { status: 429 }
      );
    }

    // Get user name for the email
    const name = user.name || user.email.split('@')[0];
    console.log('[Forgot Password] Sending OTP to:', email, 'name:', name);

    // Send OTP via email
    const result = await sendOTP(email, name, 'password_reset');
    
    console.log('[Forgot Password] Send result:', result);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Password reset code sent successfully. Please check your email.",
        email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3") // Mask email for display
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}