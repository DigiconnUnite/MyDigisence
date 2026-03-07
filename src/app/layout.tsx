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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mydigisence.com'),
  title: {
    default: 'Mydigisence - Digital Presence Platform for Businesses & Professionals',
    template: '%s | Mydigisence',
  },
  description: 'Mydigisence is India\'s leading global digital presence platform designed for business owners and professionals. Build your online presence, connect with clients, and grow your business with powerful digital tools.',
  keywords: [
    'digital presence',
    'business profile',
    'professional profile',
    'online business directory',
    'professional networking',
    'business listings',
    'digital marketing',
    'online presence',
    'India business platform',
    'global business directory',
  ],
  authors: [{ name: 'Digiconn Unite Pvt Ltd' }],
  creator: 'Digiconn Unite Pvt Ltd',
  publisher: 'Digiconn Unite Pvt Ltd',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mydigisence.com',
    siteName: 'Mydigisence',
    title: 'Mydigisence - Digital Presence Platform for Businesses & Professionals',
    description: 'India\'s leading global digital presence platform for business owners and professionals. Build your online presence and connect with clients worldwide.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mydigisence - Digital Presence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mydigisence - Digital Presence Platform for Businesses & Professionals',
    description: 'India\'s leading global digital presence platform for business owners and professionals.',
    creator: '@mydigisence',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="text-[90%]" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="aTFmc6hbCD9_PN52nvLV2QMS1pc-hC_Aue5oKd5lvWI"
        />
      </head>
      <body
        className={`${archivo.variable} antialiased hide-scrollbar bg-background text-foreground`}
      >
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
