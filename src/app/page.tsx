"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Shield, Zap, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
        <div className=" pt-0  md:pb-0">
        <HeroSectionOne />
        {/* <MarqueeSection /> */}

        {/* feature Section */}
        <section className="bg-zinc-100">
          <div className="max-w-[1440px] border-r border-l  mx-auto px-4">
            <div className="grid grid-cols-1 divide divide-x divide-slate-300 md:grid-cols-3 gap-8">
              {/* Column 1 */}
             
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative overflow-hidden w-40 h-40  p-4 flex-shrink-0">
                  <Image
                    src="/h-discover.svg"
                    alt="Inquiry Management"
                    width={120}
                    height={120}
                    className="object-contain w-full h-auto"
                  />
                </div>
                <div className="text-left px-4">
                  <h3 className="text-xl font-bold  mb-2">Discover</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Discover local businesses and services. Browse professional profiles, compare offerings, and find trusted providers.
                  </p>
                </div>
                </div>


                {/* Column 2 */}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative overflow-hidden h-40 w-40  p-4 flex-shrink-0">
                    <Image
                      src="/h-connection.svg"
                      alt="Inquiry Management"
                      width={120}
                      height={120}
                      className="object-contain w-full h-auto"
                    />
                  </div>
                  <div className="text-left px-4">
                    <h3 className="text-xl font-bold  mb-2">Connect</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Create professional digital profiles with custom landing pages, service showcases, and brand storytelling tools.
                    </p>
                  </div>
                </div>

              {/* Column 3 */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative overflow-hidden h-40 w-40  p-4 flex-shrink-0">
                    <Image
                      src="/h-growth.svg"
                      alt="Inquiry Management"
                      width={120}
                      height={120}
                      className="object-contain w-full h-auto"
                    />
                </div>
                <div className="text-left px-4">
                  <h3 className="text-xl font-bold  mb-2">Growth</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Track profile views, customer inquiries, and engagement metrics. Optimize your digital presence with data insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Businesses Section */}
        <section className="bg-white ">
          <div className="max-w-[1440px] border-r py-10 md:py-20  border-l border-gray-200 mx-auto px-4">
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
                  Explore the powerful tools and capabilities that Mydigisence
                  offers to enhance your digital presence.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 bg-zinc-100 rounded-[14px] px-[18px] py-3.5">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Register Your Business
                      </h3>
                      <p className="text-sm text-gray-600">
                        Create your account and get started with Mydigisence.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 bg-zinc-100 rounded-[14px] px-[18px] py-3.5">
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
                  <div className="flex items-center gap-3.5 bg-zinc-100 rounded-[14px] px-[18px] py-3.5">
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
                  <div className="flex items-center gap-3.5 bg-zinc-100 rounded-[14px] px-[18px] py-3.5">
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
                <div className="h-full mt-auto  relative bg-zinc-200 rounded-4xl  p-8 flex flex-col justify-between items-end text-center bg-cover bg-center">
                  
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professionals Section */}
        <section className=" bg-white">
            <div className="max-w-[1440px] py-10 md:py-20 border-r border-l border-gray-200 mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="flex flex-col overflow-hidden  h-full ">
                <div className="h-full mt-auto  relative bg-zinc-200 rounded-4xl  p-8 flex flex-col justify-between items-end text-center bg-cover bg-center">
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
                  Explore the powerful tools and capabilities that Mydigisence
                  offers to enhance your digital presence.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 bg-zinc-100 rounded-[14px] px-[18px] py-3.5">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Register You Professionals Presence
                      </h3>
                      <p className="text-sm text-gray-600">
                        Create your account and get started with Mydigisence.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 bg-zinc-100 rounded-[14px] px-[18px] py-3.5">
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
                  <div className="flex items-center gap-3.5 bg-zinc-100 rounded-[14px] px-[18px] py-3.5">
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
                  <div className="flex items-center gap-3.5 bg-zinc-100 rounded-[14px] px-[18px] py-3.5">
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
      </div>
    </UnifiedPublicLayout>
    </>
  );
}
