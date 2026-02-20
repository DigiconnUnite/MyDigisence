"use client";

import { useState } from "react";
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
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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
        setError(data.error || "Failed to send reset link");
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
      <div className="w-full  flex flex-col justify-center items-center relative bg-white px-4 sm:px-8 lg:px-16 py-12 md:py-0 z-10 overflow-y-auto">
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
              Forgot Password
            </h1>
            <p className="text-base text-slate-500">
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Sleek Card */}
          <Card className="border-slate-200 p-0 shadow-none rounded-3xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              {!success ? (
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
                    className="w-full h-11 shadow-none bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
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
                    Reset Link Sent
                  </h3>
                  <p className="text-sm text-slate-500">
                    We've sent a password reset link to your email address.
                    Please check your inbox.
                  </p>
                  <Button
                    type="button"
                    className="w-full h-11 shadow-none bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5"
                    onClick={() => router.push("/login")}
                  >
                    Back to Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
