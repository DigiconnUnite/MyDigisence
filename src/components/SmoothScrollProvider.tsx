"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBusinessOrProfessionalProfile = 
    pathname === "/businesses" || pathname === "/professionals";

  return (
    <SmoothScroll enabled={!isBusinessOrProfessionalProfile}>
      {children}
    </SmoothScroll>
  );
}
