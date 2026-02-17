"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forceLogout, setForceLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, refreshAuth, user: authUser } = useAuth();

  // Redirect if already logged in and authenticated
  useEffect(() => {
    if (authUser && authUser.role === "SUPER_ADMIN") {
      router.push("/dashboard/admin");
    }
  }, [authUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log('[DEBUG] Admin Login - Starting login attempt for:', email);

    try {
      const result = await login(email, password, forceLogout);

      console.log('[DEBUG] Admin Login - AuthContext login result:', result);

      if (!result.success) {
        setError(result.error || "Login failed");
      } else if (!result.user) {
        setError("Login failed - no user data");
      } else {
        console.log('[DEBUG] Admin Login - Login successful, user data:', result.user);
        // Check if user is admin
        if (result.user.role !== "SUPER_ADMIN") {
          console.log('[DEBUG] Admin Login - User role check failed:', result.user.role);
          setError("Access denied. Admin privileges required.");
          return;
        }
        console.log('[DEBUG] Admin Login - Refreshing auth');
        await refreshAuth();
        console.log('[DEBUG] Admin Login - Auth refreshed, redirecting');
        router.push("/dashboard/admin");
      }
    } catch (error) {
      console.error('[DEBUG] Admin Login - Error:', error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen max-h-screen relative w-full flex flex-col md:flex-row bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col justify-center relative w-full px-4 sm:px-6 lg:px-12 py-10 lg:py-0 z-10">
        <div className="w-full absolute top-0 left-0 right-0 max-w-7xl mx-auto p-4 sm:p-6 flex justify-between items-center z-50">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/logo.svg"
              alt="DigiSence Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="font-bold text-xl sm:text-2xl text-slate-800 tracking-tight">
              DigiSence
            </span>
          </Link>
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            size="sm"
            className="hover:bg-slate-100 rounded-full py-0 px-0 border  cursor-pointer text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8 mt-12 sm:mt-4">
          {/* Header Text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-800">
              Admin Login
            </h1>
            <p className="text-base text-slate-500">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Sleek Card */}
          <CardContent className="p-0 space-y-5">
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
                    placeholder="admin@example.com"
                    className="pl-9 h-11 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                >
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter your password"
                    className="pl-9 pr-9 h-11 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Force Logout Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="force-logout"
                  checked={forceLogout}
                  onCheckedChange={(checked) =>
                    setForceLogout(checked as boolean)
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="force-logout"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  Force login (logout other sessions)
                </Label>
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
                className="w-full h-11 shadow-lg bg-linear-to-r from-[#5757FF] to-[#A89CFE] cursor-pointer hover:opacity-90 text-white font-medium transition-all transform hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Forgot Password */}
              <div className="text-center text-sm text-slate-500 pt-2">
                Forgot your password?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary hover:text-primary/80 font-semibold"
                  onClick={() => router.push("/forgot-password")}
                >
                  Reset here
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}