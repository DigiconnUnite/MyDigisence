"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, CheckCircle2, Lock, Timer } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Failed to send reset code");
        if (data.cooldown) {
          setResendCooldown(data.cooldown);
        }
      } else {
        setOtpSent(true);
        setResendCooldown(60); // Start cooldown after sending
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOtpLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, purpose: "password_reset" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid verification code");
      } else {
        setOtpVerified(true);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setResetLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setResetSuccess(true);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Failed to resend code");
        if (data.cooldown) {
          setResendCooldown(data.cooldown);
        }
      } else {
        setResendCooldown(60);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-200 font-sans">
      {/* --- LEFT SIDE: FORM --- */}
      <div className="w-full  flex flex-col justify-center items-center relative  px-4 sm:px-8 lg:px-16 py-12 md:py-0 z-10 overflow-y-auto">
        {/* Top Header */}
        <div className="absolute top-0 left-0 w-full px-6 py-6 flex justify-between items-center z-20 ">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="/logo-header.png"
                alt="DigiSence Logo"
                className="h-8 w-auto  transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </Link>
          <Button
            onClick={() => router.push("/login")}
            variant="ghost"
            className="hover:bg-slate-100 text-slate-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>

        {/* Content Wrapper */}
        <div className="w-full  max-w-lg space-y-8 pt-8 md:pt-0">
          {/* Header Text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-800 ">
              {otpVerified && !resetSuccess
                ? "Reset Your Password"
                : otpSent
                ? "Verify Your Email"
                : "Forgot Password"}
            </h1>
            <p className="text-base text-slate-500">
              {otpVerified && !resetSuccess
                ? "Enter your new password below"
                : otpSent
                ? "We've sent a code to your email address"
                : "Enter your email to receive a verification code"}
            </p>
          </div>

          {/* Sleek Card */}
          <Card className="border-slate-200 p-0 shadow-none rounded-3xl overflow-hidden bg-white backdrop-blur-sm">

            
            <CardContent className="p-6 sm:p-8">
              {!otpSent ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                    >
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="your@example.com"
                        className="pl-9 h-11 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20 border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert
                      variant="destructive"
                      className="py-3 text-sm border-red-100 bg-red-50/50"
                    >
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 shadow-none bg-slate-800 hover:bg-primary  text-white font-medium  shadow-slate-800/25 transition-all transform hover:-translate-y-0.5"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Verification Code"}
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center text-sm text-slate-500 pt-2">
                    Remember your password?{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-primary hover:text-primary/80 font-semibold"
                      onClick={() => router.push("/login")}
                    >
                      Login here
                    </Button>
                  </div>
                </form>
              ) : otpVerified && !resetSuccess ? (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  {/* Success Message */}
                  <div className="text-center space-y-2 mb-4">
                    <div className="flex justify-center">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Code Verified
                    </h3>
                    <p className="text-sm text-slate-500">
                      Enter your new password for<br />
                      <span className="font-medium text-slate-700">{email}</span>
                    </p>
                  </div>

                  {/* New Password Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                    >
                      New Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={resetLoading}
                        placeholder="Enter new password"
                        className="pl-9 pr-10 h-11 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20 border-slate-200"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={resetLoading}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" x2="23" y1="1" y2="23"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={resetLoading}
                        placeholder="Confirm new password"
                        className="pl-9 h-11 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20 border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert
                      variant="destructive"
                      className="py-3 text-sm border-red-100 bg-red-50/50"
                    >
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Reset Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 shadow-none bg-slate-800 hover:bg-primary text-white font-medium shadow-slate-800/25 transition-all transform hover:-translate-y-0.5"
                    disabled={resetLoading || !newPassword || !confirmPassword}
                  >
                    {resetLoading ? "Resetting..." : "Reset Password"}
                  </Button>

                  {/* Back to OTP */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-slate-500 hover:text-slate-700"
                      onClick={() => {
                        setOtpVerified(false);
                        setOtp("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setError("");
                      }}
                      disabled={resetLoading}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Verification
                    </Button>
                  </div>
                </form>
              ) : resetSuccess ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Password Reset Successful!
                  </h3>
                  <p className="text-sm text-slate-500">
                    Your password has been reset successfully.
                    You can now login with your new password.
                  </p>
                  <Button
                    type="button"
                    className="w-full h-11 shadow-none bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5"
                    onClick={() => router.push("/login")}
                  >
                    Login Now
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  {/* Success Message */}
                  <div className="text-center space-y-2 mb-4">
                    <div className="flex justify-center">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Check Your Email
                    </h3>
                    <p className="text-sm text-slate-500">
                      We've sent a verification code to<br />
                      <span className="font-medium text-slate-700">{email}</span>
                    </p>
                  </div>

                  {/* OTP Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="otp"
                      className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                    >
                      Verification Code
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        disabled={otpLoading}
                        placeholder="Enter 6-digit code"
                        className="pl-9 h-11 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20 border-slate-200 text-center text-lg tracking-widest font-mono"
                      />
                    </div>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert
                      variant="destructive"
                      className="py-3 text-sm border-red-100 bg-red-50/50"
                    >
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Verify Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 shadow-none bg-slate-800 hover:bg-primary text-white font-medium shadow-slate-800/25 transition-all transform hover:-translate-y-0.5"
                    disabled={otpLoading || otp.length !== 6}
                  >
                    {otpLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>

                  {/* Resend OTP */}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {resendCooldown > 0 ? (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Timer className="h-3 w-3" />
                        <span>Resend code in {resendCooldown}s</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-slate-500">Didn't receive the code?</span>
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-primary hover:text-primary/80 font-semibold"
                          onClick={handleResendOtp}
                          disabled={loading}
                        >
                          Resend Code
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Back Button */}
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-slate-500 hover:text-slate-700"
                      onClick={handleGoBack}
                      disabled={otpLoading}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Change Email Address
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
