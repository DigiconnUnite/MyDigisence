"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const images = [
  "d-1.png",
  "m-1.png",
  "d-1.png",
  "m-1.png",
  "d-1.png",
  "m-1.png",
];

export default function HeroSectionOne() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleImageClick = (index: number) => {
    if (!isDragging) {
      setActiveIndex(index);
    }
  };

  // Auto-scroll functionality for infinite carousel
  useEffect(() => {
    if (!isClient || isHovered || isDragging) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, isDragging, isClient]);

  // Responsive values
  const getResponsiveValues = () => {
    if (typeof window === "undefined")
      return {
        radius: 700,
        cardWidth: 200,
        dragSensitivity: 100,
        containerHeight: 500,
        perspective: 12000,
      };

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Mobile specific optimizations
    if (width < 640) {
      // Adjust for mobile viewport
      const mobileHeight = Math.min(height * 0.6, 400);
      return {
        radius: Math.min(width * 0.8, 280),
        cardWidth: Math.min(width * 0.4, 120),
        dragSensitivity: 60,
        containerHeight: mobileHeight,
        perspective: 8000,
      };
    }

    // Tablet specific optimizations
    if (width < 1024) {
      return {
        radius: 500,
        cardWidth: 160,
        dragSensitivity: 80,
        containerHeight: 600,
        perspective: 10000,
      };
    }

    // Desktop
    return {
      radius: 700,
      cardWidth: 200,
      dragSensitivity: 100,
      containerHeight: 800,
      perspective: 12000,
    };
  };

  const [responsiveValues, setResponsiveValues] = useState({
    radius: 700,
    cardWidth: 200,
    dragSensitivity: 100,
    containerHeight: 500,
    perspective: 12000,
  });

  useEffect(() => {
    const handleResize = () => {
      const newValues = getResponsiveValues();
      setResponsiveValues(newValues);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { radius, cardWidth, dragSensitivity, containerHeight, perspective } =
    responsiveValues;
  const totalCards = images.length;
  const angleStep = (2 * Math.PI) / totalCards;

  // Drag handlers with improved touch support
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
    dragStartIndex.current = activeIndex;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX.current;
    const indexDelta = Math.round(-deltaX / dragSensitivity);
    const newIndex =
      (dragStartIndex.current + indexDelta + totalCards) % totalCards;
    setActiveIndex(newIndex);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Prevent scrolling when dragging on mobile
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    if (isDragging) {
      document.addEventListener("touchmove", preventDefault, {
        passive: false,
      });
      return () => {
        document.removeEventListener("touchmove", preventDefault);
      };
    }
  }, [isDragging]);

  return (
    
    <div
      className="relative pt-24 pb-10 sm:py-14 md:py-18 lg:py-24  border border-white/20 shadow-xl min-h-[calc(112vh-1.5rem)] sm:min-h-[calc(115vh-2rem)] lg:min-h-[calc(120vh-2.5rem)] overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
  

      {/* LAYER 3: Content (z-20 & z-30) */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 sm:px-6 z-20">
        <div className="py-4 sm:py-8 md:py-12 lg:py-16 xl:py-20 w-full">
          <h1 className="relative mx-auto max-w-4xl mb-3 sm:mb-4 md:mb-5 text-center text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-slate-50 leading-tight px-2 sm:px-4">
            {"Your One-Stop Solution for a Stunning Digital Profiles"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(50px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="mr-1 sm:mr-1.5 md:mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative mt-3 sm:mt-4 md:mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0"
          >
            <Link href="/professionals" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[140px] md:min-w-[180px] lg:w-48 xl:w-60 transform rounded-lg px-4 sm:px-6 py-2 sm:py-2.5 font-medium text-sm sm:text-base text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary bg-gray-800 hover:shadow-lg border border-white/50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Make Profile
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-w-[140px] md:min-w-[180px] lg:w-48 xl:w-60 transform rounded-lg border border-gray-300 bg-white px-4 sm:px-6 py-2 sm:py-2.5 font-medium text-sm sm:text-base text-black transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-lg dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
              >
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="w-full relative z-10 pb-3 sm:pb-4 md:pb-5 pt-3 sm:pt-4 md:pt-5 mt-4 sm:mt-6 md:mt-8">
        <div className="flex items-center overflow-hidden">
          <motion.div
            className="flex gap-3 sm:gap-4 md:gap-6 lg:gap-10"
            animate={{
              x: [0, -3000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {[...images, ...images, ...images, ...images].map((img, i) => {
              // Alternate between 16:9 and 9:16
              const isPortrait = i % 2 !== 0;

              return (
                <div
                  key={`marquee-${i}`}
                  className={`relative shrink-0 z-10 overflow-hidden duration-300 
                    rounded-lg border-4 shadow-none 
                    sm:rounded-2xl sm:border-4 sm:shadow-2xl
                    ${isPortrait ? "h-32 sm:h-64 md:h-80 lg:h-96" : "h-32 sm:h-64 md:h-80 lg:h-96"}
                    ${isPortrait ? "w-auto sm:w-auto md:w-auto lg:w-auto" : "w-auto sm:w-auto md:w-auto lg:w-auto"}
                  `}
                  style={{
                    aspectRatio: isPortrait ? "9/16" : "16/9",
                  }}
                >
                  <div className="w-full h-full  flex items-center justify-center">
                    <Image
                      src={`/${img}`}
                      alt="slider"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
