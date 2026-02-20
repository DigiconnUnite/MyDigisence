"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");                                       
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid or missing reset token");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 font-sans">
      {/* --- LEFT SIDE: FORM --- */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center relative bg-white px-4 sm:px-8 lg:px-16 py-12 md:py-0 z-10 overflow-y-auto">
        {/* Top Header */}
        <div className="absolute top-0 left-0 w-full px-6 py-6 flex justify-between items-center z-20 ">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-1.5 rounded-md text-primary">
              <img
                src="/logo.png"
                alt="DigiSence Logo"
                className="h-5 w-auto"
              />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">
              DigiSence
            </span>
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
        <div className="w-full max-w-lg space-y-8 pt-8 md:pt-0">
          {/* Header Text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-800 ">
              Reset Password
            </h1>
            <p className="text-base text-slate-500">
              Enter your new password below
            </p>
          </div>

          {/* Sleek Card */}
          <Card className="border-slate-200 shadow-none rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Password Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                    >
                      New Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-9 pr-10 h-11 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20 border-slate-200"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
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
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="pl-9 pr-10 h-11 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20 border-slate-200"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
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
                    className="w-full h-11 shadow-none bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
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
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Password Reset Successful
                  </h3>
                  <p className="text-sm text-slate-500">
                    Your password has been successfully reset. You can now login
                    with your new password.
                  </p>
                  <Button
                    type="button"
                    className="w-full h-11 shadow-none bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5"
                    onClick={() => router.push("/login")}
                  >
                    Login Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- RIGHT SIDE: IMAGE --- */}
      <div className="hidden md:flex w-full md:w-1/2 relative bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-in-out hover:scale-105"
          style={{ backgroundImage: "url('/login-bg.svg')" }}
        ></div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
