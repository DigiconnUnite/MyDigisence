"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HomePreloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add hide-scrollbar class to body when loading
    document.body.classList.add("hide-scrollbar");
    
    // Simulate minimum loading time for smooth UX
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Remove hide-scrollbar class after loading
      document.body.classList.remove("hide-scrollbar");
    }, 1500);

    return () => {
      clearTimeout(timer);
      // Ensure cleanup on unmount
      document.body.classList.remove("hide-scrollbar");
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 hide-scrollbar z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50">
      {/* Logo */}
      <div className="mb-8 relative">
        <div className="w-24 h-24 relative animate-pulse">
          <Image
            src="/logo.png"
            alt="DigiSence"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      
      {/* Animated Loader */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-3 h-3 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-3 h-3 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>

      
    </div>
  );
}
