import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryProvider } from "@/lib/queryProvider";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Business Digital Presence Platform (BDPP)",
  description: "A streamlined platform for professional business digital profiles",
  keywords: ["BDPP", "Business", "Digital Presence", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "BDPP Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Business Digital Presence Platform",
    description: "Professional digital profiles for every business",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Digital Presence Platform",
    description: "Professional digital profiles for every business",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="text-[89%]" suppressHydrationWarning>
      <body
        className={`${archivo.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>{children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
