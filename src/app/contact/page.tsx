import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Aurora from "@/components/Aurora";
import UnifiedPublicLayout from "@/components/UnifiedPublicLayout";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with Mydigisence",
  description: "Contact Mydigisence team for support, inquiries, or partnership opportunities. We're here to help you build your digital presence. Reach out today!",
  keywords: ['contact mydigisence', 'customer support', 'business inquiry', 'partnership', 'get in touch', 'contact us India', 'digital platform support'],
  openGraph: {
    title: 'Contact Us - Mydigisence',
    description: 'Get in touch with the Mydigisence team for support and inquiries.',
    url: 'https://mydigisence.com/contact',
    siteName: 'Mydigisence',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Mydigisence',
    description: 'Get in touch with the Mydigisence team for support and inquiries.',
  },
  alternates: {
    canonical: 'https://mydigisence.com/contact',
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
};

export default function ContactPage() {
  return (
    <UnifiedPublicLayout variant="solid" sidebarVariant="contact">
      <div className="relative">

        {/* Contact Content */}
        <div className="relative z-10 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Form and Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact Form - Client Component */}
              <ContactForm />

              {/* Contact Info Sidebar */}
              <Card className="lg:pl-8 bg-transparent  p-0 h-full"> 
                {/* Contact SVG */}
                <div className=" rounded-lg overflow-hidden h-full">
                  <img
                    src="/contact.svg"
                    alt="Contact Illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
              
            </div>
          </div>
        </div>
      </div>
    </UnifiedPublicLayout>
  );
}
