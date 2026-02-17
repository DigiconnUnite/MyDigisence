"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
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
import { Eye, EyeOff, ArrowLeft, Mail, Lock, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function ProfessionalLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForceButton, setShowForceButton] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowForceButton(false);
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        // Fetch professional data and redirect directly to professional dashboard
        try {
          const response = await fetch("/api/professionals");
          if (response.ok) {
            const data = await response.json();
            const userProfessional = data.professionals?.find(
              (p: any) => p.adminId === result.user?.id,
            );

            if (userProfessional) {
              router.push(`/dashboard/professional/${userProfessional.slug}`);
            } else {
              setError(
                "Professional profile not found. Please contact support.",
              );
            }
          } else {
            setError(
              "Failed to load professional dashboard. Please try again.",
            );
          }
        } catch (fetchError) {
          setError(
            "Connection failed. Please check your internet and try again.",
          );
        }
      } else {
        setError(result.error || "Login failed");
        if (
          result.error ===
          "This account is already logged in on another device."
        ) {
          setShowForceButton(true);
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogin = async () => {
    setError("");
    setShowForceButton(false);
    setLoading(true);

    try {
      const result = await login(email, password, true);

      if (result.success) {
        // Fetch professional data and redirect directly to professional dashboard
        try {
          const response = await fetch("/api/professionals");
          if (response.ok) {
            const data = await response.json();
            const userProfessional = data.professionals?.find(
              (p: any) => p.adminId === result.user?.id,
            );

            if (userProfessional) {
              router.push(`/dashboard/professional/${userProfessional.slug}`);
            } else {
              setError(
                "Professional profile not found. Please contact support.",
              );
            }
          } else {
            setError(
              "Failed to load professional dashboard. Please try again.",
            );
          }
        } catch (fetchError) {
          setError(
            "Connection failed. Please check your internet and try again.",
          );
        }
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="min-h-screen max-h-screen w-full flex flex-col lg:flex-row font-sans bg-slate-200">
      {/* --- LEFT SIDE: FORM --- */}
      <div className="flex-1 flex flex-col justify-center relative w-full px-4 sm:px-6 lg:px-12 py-10 lg:py-0 z-10">
        {/* Top Header */}
        <div className="absolute top-0 left-0 w-full px-4 sm:px-6 lg:px-12 py-4 lg:py-6 flex justify-between items-center z-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="rounded-md text-primary">
              <Image
                src="/logo-tranparent.png"
                alt="DigiSence Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:block">
              DigiSence
            </span>
          </Link>
          <Button
            onClick={() => router.push("/login")}
            variant="ghost"
            size="sm"
            className="hover:bg-slate-100 border rounded-full py-1 px-3 text-slate-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>

        {/* Content Wrapper */}
        <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8 mt-12 sm:mt-4">
          {/* Header Text */}
          <div className="text-center space-y-2 px-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Professional Login
            </h1>
            <p className="text-sm sm:text-base text-slate-500">
              Welcome back! Enter your credentials to access your workspace
            </p>
          </div>

          {/* Form Area */}
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
                    placeholder="professional@example.com"
                    className="pl-9 h-11 shadow-none bg-white focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold uppercase text-slate-500 tracking-wider"
                  >
                    Password
                  </Label>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-xs text-primary hover:text-primary/80 font-medium"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </Button>
                </div>
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
                    className="pl-9 pr-10 bg-white h-11 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0  top-0 h-full px-3 hover:bg-transparent text-slate-400 hover:text-slate-600"
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

              {/* Error Alert */}
              {error && (
                <Alert
                  variant="destructive"
                  className="py-3 text-sm border-red-100 bg-red-50/50"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Force Login Button */}
              {showForceButton && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 hover:bg-accent transition-colors text-sm"
                  onClick={handleForceLogin}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Force Logout Everywhere"}
                </Button>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 shadow-lg bg-slate-800 cursor-pointer hover:opacity-90 text-white font-medium transition-all transform hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login to Professional Dashboard"}
              </Button>

              {/* Register Link */}
              <div className="text-center text-sm text-slate-500 pt-2">
                Don't have a professional account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary hover:text-primary/80 font-semibold"
                  onClick={() => router.push("/register/professional")}
                >
                  Register here
                </Button>
              </div>
            </form>
          </CardContent>
        </div>
      </div>

      {/* --- RIGHT SIDE: IMAGE (Desktop Only) --- */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 m-0 lg:m-4 lg:rounded-2xl overflow-hidden shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-in-out hover:scale-105"
          style={{ backgroundImage: "url('/login-bg.svg')" }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/40 via-slate-900/20 to-slate-900/90 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col justify-between h-full w-full py-16 px-10 xl:px-20">
          <div className="flex-1"></div>

          <div className="flex items-center justify-center py-10">
            <div className="shrink-0 drop-shadow-2xl animate-pulse-slow">
              <img
                src="/pro-svg.png"
                alt="Professional Icon"
                className=" w-auto object-contain opacity-90"
              />
            </div>
          </div>

          <div className="text-center mb-12 space-y-4">
            <h3 className="text-4xl xl:text-5xl font-bold text-white tracking-tight drop-shadow-md">
              Grow Your Professional Presence Online
            </h3>
            <p className="text-base text-gray-200 opacity-90 leading-relaxed max-w-lg mx-auto font-light">
              Join thousands of professionals expanding their digital presence
              with our powerful tools and analytics.
            </p>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
}
