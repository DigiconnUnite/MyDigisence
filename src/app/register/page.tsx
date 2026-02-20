"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// --- Main Content Logic ---
function RegisterContent() {
  const router = useRouter();

  // This page now purely serves as a selection screen, just like Login
  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-200">
      <div className="flex-1 flex flex-col justify-center items-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Top Nav - Matches Login Page */}
        <div className="w-full absolute top-0 left-0 right-0  mx-auto p-4 sm:p-6 flex justify-between items-center z-50">
          <Link href="/" className="flex items-center space-x-2 group">
            {/* ACTUAL LOGO IMAGE */}
            <Image
              src="/logo.png"
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
            // Fix: Using onClick here to go back in history or home
            onClick={() => router.push("/")}
            variant="ghost"
            size="sm"
            className="hover:bg-slate-100 rounded-full py-0 px-0 border cursor-pointer text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>

        {/* Role Selection Grid - Matches Login Page */}
        <div className="w-full max-w-7xl space-y-8 sm:space-y-10 mt-12 sm:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Professional Card - Copied & Adapted from Login */}
            <Link href="/register/professional" className="block group">
              <Card className="group relative border-none transition-all duration-500 rounded-3xl border-primary shadow-xl w-full overflow-hidden hover:shadow-2xl max-h-[500px] md:min-h-[500px] h-full">
                <div className="absolute inset-0 bg-slate-900/10 transition-colors group-hover:bg-slate-900/20 z-10" />

                {/* ACTUAL BACKGROUND IMAGE */}
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-in-out group-hover:scale-105 bg-slate-200">
                  <Image
                    src="/login-bg.svg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="flex flex-col items-center justify-between h-full relative z-20 px-6 py-8 sm:py-12">
                  {/* Icon Section */}
                  <div className="flex-1 flex items-center justify-center w-full pt-4">
                    <div className="shrink-0 drop-shadow-2xl transition-transform duration-300 group-hover:scale-110">
                      <div className="h-32 w-32 sm:h-48 sm:w-48 md:h-56 md:w-56 relative">
                        <Image
                          src="/pro-svg.png"
                          alt="Professional Icon"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Section */}
                  <CardHeader className="space-y-3 w-full text-center pb-0 pt-6">
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-sm leading-tight">
                      Register as Professional
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base md:text-lg text-slate-100 font-medium leading-relaxed drop-shadow-md">
                      Create your profile, showcase your skills, and find work.
                    </CardDescription>
                  </CardHeader>
                </div>
              </Card>
            </Link>

            {/* Business Card - Copied & Adapted from Login */}
            <Link href="/register/business" className="block group">
              <Card className="group relative border-none transition-all duration-500 rounded-3xl border-primary shadow-xl w-full overflow-hidden hover:shadow-2xl max-h-[500px] md:min-h-[500px] h-full">
                <div className="absolute inset-0 bg-slate-900/10 transition-colors group-hover:bg-slate-900/20 z-10" />

                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-in-out group-hover:scale-105 bg-slate-200">
                  <Image
                    src="/login-bg.svg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="flex flex-col items-center justify-between h-full relative z-20 px-6 py-8 sm:py-12">
                  {/* Icon Section */}
                  <div className="flex-1 flex items-center justify-center w-full pt-4">
                    <div className="shrink-0 drop-shadow-2xl transition-transform duration-300 group-hover:scale-110">
                      <div className="h-32 w-32 sm:h-48 sm:w-48 md:h-56 md:w-56 relative">
                        <Image
                          src="/bus-svg.png"
                          alt="Business Icon"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Section */}
                  <CardHeader className="space-y-3 w-full text-center pb-0 pt-6">
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-sm leading-tight">
                      Register as Business
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base md:text-lg text-slate-100 font-medium leading-relaxed drop-shadow-md">
                      Build your business team and connect with top talent.
                    </CardDescription>
                  </CardHeader>
                </div>
              </Card>
            </Link>
          </div>

          {/* Footer Link */}
          <div className="text-center text-sm sm:text-base text-slate-500 space-y-2 pt-4 pb-4">
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-bold underline underline-offset-4 transition-all"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Export ---
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary"></div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
