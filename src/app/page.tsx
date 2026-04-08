"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Shield, Zap, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import HeroSectionOne from "@/components/ui/hero";
import MarqueeSection from "@/components/ui/marquee";
import Footer from "@/components/Footer";
import { Android } from "@/components/ui/android";
import PricingSection from "@/components/sections/pricing/PricingSection";
import UnifiedPublicLayout from "@/components/UnifiedPublicLayout";
import HomePreloader from "@/components/ui/HomePreloader";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add hide-scrollbar class to body when loading
    document.body.classList.add("hide-scrollbar");

    // Minimum loading time for smooth UX
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Remove hide-scrollbar class after loading
      document.body.classList.remove("hide-scrollbar");
    }, 1200);

    return () => {
      clearTimeout(timer);
      // Ensure cleanup on unmount
      document.body.classList.remove("hide-scrollbar");
    };
  }, []);

  return (
    <>
      <UnifiedPublicLayout variant="transparent" sidebarVariant="home">
        <div className="secondary-light-gradient pt-0  md:pb-0">
        <HeroSectionOne />
        {/* Who Is It For? Section */}
        <section className="py-10 md:py-20 bg-white">
          <div className="container  mx-auto px-4">
            <div className="text-center mb-8">
              <div className="flex items-center w-fit mx-auto rounded-full px-4 py-2 border border-slate-900 shadow-sm mb-2  text-slate-800">
                <CheckCircle className="h-4 w-4 mr-2 text-slate-900" />
                Who Is It For
              </div>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 md:mb-20 text-slate-800">
              Discover Your Digital Presence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                className="aspect-square overflow-hidden relative bg-linear-30 from-cyan-950 via-55% via-slate-950 to-cyan-950 rounded-4xl shadow-lg p-8 flex flex-col justify-between items-center text-center bg-cover bg-center"
                style={{
                  backgroundImage: "url('square-bg.svg')",
                }}
              >
                {/* Top content area */}
                <div className="z-10 w-full pb-10 flex flex-col items-center justify-start pt-4">
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">
                    For Businesses
                  </h3>
                  <p className="text-md mb-6 text-gray-200 max-w-xs">
                    Boost your business online.
                  </p>
                  <Link href="/businesses">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="rounded-full bg-white text-slate-900 border-2 border-cyan-400  hover:border-cyan-300 px-8 shadow-lg font-semibold"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <Android
                  src={"b-1.png"}
                  className="h-full scale-200 w-fit mx-5  object-cover pointer-events-none relative   -bottom-1/3"
                />
                <div className="absolute"></div>
              </div>
              <div
                className="aspect-square overflow-hidden relative bg-linear-30 from-cyan-950 via-55% via-slate-950 to-cyan-950 rounded-4xl shadow-lg p-8 flex flex-col justify-between items-center text-center bg-cover bg-center"
                style={{
                  backgroundImage: "url('square-bg.svg')",
                }}
              >
                {/* Top content area */}
                <div className="z-10 pb-10 w-full flex flex-col items-center justify-start pt-4">
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-3">
                    For Professionals
                  </h3>
                  <p className="text-md mb-6 text-gray-200 max-w-xs">
                    Grow your presence online.
                  </p>
                  <Link href="/professionals">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="rounded-full bg-white text-slate-900 border-2 border-cyan-400  hover:border-cyan-300 px-8 shadow-lg font-semibold"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                <Android
                  src={"p-1.png"}
                  className="h-full scale-200 mx-auto object-cover pointer-events-none relative -bottom-1/3"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Businesses Section */}
        <section className="py-10 md:py-20 bg-[#F3FBFF]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="text-left flex flex-col h-full    mr-8">
                <h2 className="text-3xl md:text-6xl font-bold text-gray-600 mb-6">
                  How It Work here. <br /> For
                  <span className="  font-extrabold  italic text-slate-900 ">
                    {" "}
                    Businesses
                  </span>
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Explore the powerful tools and capabilities that DigiSence
                  offers to enhance your digital presence.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 bg-[#E5F6FF] rounded-[14px] px-[18px] py-3.5">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Register Your Business
                      </h3>
                      <p className="text-sm text-gray-600">
                        Create your account and get started with DigiSence.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 bg-[#E5F6FF] rounded-[14px] px-[18px] py-3.5">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Connect with Professionals
                      </h3>
                      <p className="text-sm text-gray-600">
                        Find and collaborate with experts in your field.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 bg-[#E5F6FF] rounded-[14px] px-[18px] py-3.5">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Secure Your Data
                      </h3>
                      <p className="text-sm text-gray-600">
                        Enjoy peace of mind with our secure platform.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 bg-[#E5F6FF] rounded-[14px] px-[18px] py-3.5">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Boost Your Visibility
                      </h3>
                      <p className="text-sm text-gray-600">
                        Increase your online presence and reach more customers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col overflow-hidden  h-full ">
                <div className="aspect-video mt-auto  relative bg-[#E5F6FF] rounded-4xl  p-8 flex flex-col justify-between items-end text-center bg-cover bg-center">
                  <Android
                    src={"b-1.png"}
                    className="absolute -bottom-1/3 shadow-lg  left-1/2 transform -translate-x-1/2 h-full w-[80%] scale-300 object-cover pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professionals Section */}
        <section className="py-10 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="flex flex-col overflow-hidden  h-full ">
                <div className="aspect-video mt-auto  relative bg-[#E5F6FF] rounded-4xl  p-8 flex flex-col justify-between items-end text-center bg-cover bg-center">
                  <Android
                    src={"p-1.png"}
                    className="absolute -bottom-1/3 shadow-lg  left-1/2 transform -translate-x-1/2 h-full w-[80%] scale-300 object-cover pointer-events-none"
                  />
                </div>
              </div>
              <div className="text-left flex flex-col h-full    ml-8">
                <h2 className="text-3xl md:text-6xl font-bold text-gray-600 mb-6">
                  How It Work here. <br /> For
                  <span className="  font-extrabold  italic text-slate-900 ">
                    {" "}
                    Professionals
                  </span>
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Explore the powerful tools and capabilities that DigiSence
                  offers to enhance your digital presence.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 bg-[#E5F6FF] rounded-[14px] px-[18px] py-3.5">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Register You Professionals Presence
                      </h3>
                      <p className="text-sm text-gray-600">
                        Create your account and get started with DigiSence.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 bg-[#E5F6FF] rounded-[14px] px-[18px] py-3.5">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Connect with Professionals
                      </h3>
                      <p className="text-sm text-gray-600">
                        Find and collaborate with experts in your field.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 bg-[#E5F6FF] rounded-[14px] px-[18px] py-3.5">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Secure Your Data
                      </h3>
                      <p className="text-sm text-gray-600">
                        Enjoy peace of mind with our secure platform.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 bg-[#E5F6FF] rounded-[14px] px-[18px] py-3.5">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Boost Your Visibility
                      </h3>
                      <p className="text-sm text-gray-600">
                        Increase your online presence and reach more customers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PricingSection />

        {/* CTA Section */}
        <section className="py-10 md:py-20 max-w-7x mx-autol w-full px-4 sm:px-6 bg-transparent flex justify-center items-center">
          <div className="container w-full mx-auto">
            <div className="rounded-3xl border border-cyan/90  bg-linear-30 from-cyan-900  via-55%  via-slate-950 to-cyan-800 shadow-lg p-12 px-6 sm:px-12 text-center backdrop-blur-lg">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow-md text-white">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg sm:text-xl mb-8 opacity-95 text-gray-200">
                Join{" "}
                <span className="font-semibold text-cyan-400">DigiSence</span>{" "}
                today and create your professional digital presence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/dashboard/admin">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full bg-cyan-400 text-slate-900 border-2 border-cyan-400 hover:bg-cyan-300 hover:border-cyan-300 transition-all duration-200 px-8 shadow-lg font-semibold"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/businesses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-8 shadow-md transition-all duration-200 font-semibold"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-5 text-sm opacity-90">
                <div className="flex items-center bg-slate-800/70 rounded-full px-4 py-2 border border-cyan-400/30 shadow-sm mb-2 mx-1 text-gray-200">
                  <CheckCircle className="h-4 w-4 mr-2 text-cyan-400" />
                  No setup fees
                </div>
                <div className="flex items-center bg-slate-800/70 rounded-full px-4 py-2 border border-cyan-400/30 shadow-sm mb-2 mx-1 text-gray-200">
                  <CheckCircle className="h-4 w-4 mr-2 text-cyan-400" />
                  Your Online Presence
                </div>
                <div className="flex items-center bg-slate-800/70 rounded-full px-4 py-2 border border-cyan-400/30 shadow-sm mb-2 mx-1 text-gray-200">
                  <CheckCircle className="h-4 w-4 mr-2 text-cyan-400" />
                  Easy to use
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </UnifiedPublicLayout>
    </>
  );
}
