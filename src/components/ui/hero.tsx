"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  { value: "5,000+", label: "Businesses" },
  { value: "2,500+", label: "Professionals" },
  { value: "50,000+", label: "Connections" },
  { value: "4.8/5", label: "Rating" },
];

export default function HeroSectionOne() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/footer-bg.jpg')" }}
      />

    

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main Content */}
      <div className="relative mx-auto max-w-[1440px] border-r border-l border-white/20 px-4 sm:px-6 lg:px-8 z-20 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-12 items-center w-full py-16 sm:py-20 lg:py-24">

          {/* Left Side - Text Content */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isClient ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 sm:px-5 sm:py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-300 tracking-wide">
                  India&apos;s Trusted Business Platform
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <h1 className="mb-5 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-6xl 2xl:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
              <div className="flex flex-col">
                <div>
                  {"Connect, Discover &".split(" ").map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, filter: "blur(40px)", y: 15 }}
                      animate={isClient ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
                      transition={{
                        duration: 0.45,
                        delay: 0.15 + index * 0.07,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="mr-[0.3em] inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
                <div>
                  {"Grow Your Business".split(" ").map((word, index) => (
                    <motion.span
                      key={index + 10}
                      initial={{ opacity: 0, filter: "blur(40px)", y: 15 }}
                      animate={isClient ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
                      transition={{
                        duration: 0.45,
                        delay: 0.5 + index * 0.07,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className={`mr-[0.3em] inline-block ${index === 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-50 via-cyan-100 to-cyan-200" : ""}`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isClient ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 sm:mb-10 max-w-lg leading-relaxed"
            >
              Whether you&apos;re a business seeking talent, a professional showcasing expertise, or a customer discovering services —{" "}
              <span className="text-gray-200 font-medium">you&apos;re in the right place.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isClient ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-10 sm:mb-12"
            >
              <Link href="/register/business" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto min-w-[140px] md:min-w-[180px] lg:w-48 xl:w-60 transform rounded-lg px-4 sm:px-6 py-2 sm:py-2.5 font-medium text-sm sm:text-base text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary bg-gray-800 hover:shadow-lg border border-white/50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Go Online
                </Button>
              </Link>
              <Link href="/businesses" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-w-[140px] md:min-w-[180px] lg:w-48 xl:w-60 transform rounded-lg border border-gray-300 bg-white px-4 sm:px-6 py-2 sm:py-2.5 font-medium text-sm sm:text-base text-black transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-lg dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
                >
                  Browse
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isClient ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isClient ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.08 }}
                  className="relative"
                >
                  <div className="flex flex-col">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium">
                      {stat.label}
                    </span>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-white/10" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Visual Content */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={isClient ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full "
            >
   

              {/* Main Card */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
             

                <div className="relative p-4 sm:p-6 lg:p-8">
                

                  {/* Robot Image */}
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden ">
                    <Image
                      src="/hero-card.png"
                      alt="Digital Profile Preview"
                      width={900}
                      height={900}
                      className="object-contain w-full h-auto"
                      priority
                    />
                  </div>

                  
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={isClient ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="absolute -left-4 sm:-left-8 top-1/4 hidden sm:flex items-center gap-2 bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2.5 shadow-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Verified</p>
                  <p className="text-[10px] text-gray-500">Business</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={isClient ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.15 }}
                className="absolute -right-3 sm:-right-6 bottom-1/4 hidden sm:flex items-center gap-2 bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2.5 shadow-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">+2.5K</p>
                  <p className="text-[10px] text-gray-500">Professionals</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}