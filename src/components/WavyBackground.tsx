"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "slow",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    let w = canvas.width;
    let h = canvas.height;

    const waveColors = colors ?? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"];
    let nt = 0;
    let x = 0;

    const drawWave = (color: string, y: number, amplitude: number, frequency: number, phase: number) => {
      ctx.beginPath();
      ctx.moveTo(0, y);

      for (let i = 0; i < w; i++) {
        const waveY = y + Math.sin(i * frequency + phase + nt) * amplitude * Math.sin(i * 0.002 + phase);
        ctx.lineTo(i, waveY);
      }

      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, y, 0, h);
      gradient.addColorStop(0, color + "80");
      gradient.addColorStop(1, color + "00");
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw background fill
      if (backgroundFill) {
        ctx.fillStyle = backgroundFill;
        ctx.fillRect(0, 0, w, h);
      }

      const speedMultiplier = speed === "fast" ? 0.03 : 0.01;

      // Draw multiple wave layers
      waveColors.forEach((color, index) => {
        const y = h * 0.3 + index * 30;
        const amplitude = 50 + index * 20;
        const frequency = 0.002 + index * 0.001;
        const phase = index * 1.5;
        drawWave(color, y, amplitude, frequency, phase);
      });

      nt += speedMultiplier;
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      resizeCanvas();
      w = canvas.width;
      h = canvas.height;
    };

    window.addEventListener("resize", handleResize);

    // Use ResizeObserver for more accurate container size changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [colors, backgroundFill, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden min-h-[300px]",
        containerClassName
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{
          filter: `blur(${blur}px)`,
          opacity: waveOpacity,
        }}
      />
      <div
        className={cn(
          "relative z-10",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};
