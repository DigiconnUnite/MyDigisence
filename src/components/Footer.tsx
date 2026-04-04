import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Send,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/footer-bg.jpg')" }}
    >
      {/* Main Footer Content */}
      <div className="relative mx-auto container ">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img
                  src="/logo-header.png"
                  alt="DigiSence Logo"
                  className="h-auto w-auto filter invert hue-rotate-180 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </Link>
            <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
              Create professional digital profiles for your business. Showcase
              products, connect with customers, and grow your brand in the
              digital world.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="bg-slate-700/80 hover:bg-primary p-2.5 rounded-full text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg font-semibold text-white relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-white rounded-full" />
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Businesses", href: "/businesses" },
                { label: "Professionals", href: "/professionals" },
                { label: "Pricing", href: "/pricing" },
                { label: "Contact Us", href: "/contact" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
                    <span className="group-hover:ml-1">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg font-semibold text-white relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-white rounded-full" />
            </h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Support", href: "/support" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Login", href: "/login" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
                    <span className="group-hover:ml-1">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA & Contact Section */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg font-semibold text-white relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-white rounded-full" />
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300 group">
                <div className="p-2 bg-slate-700/80 rounded-lg group-hover:bg-primary transition-colors duration-300">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <a
                  href="mailto:info@digisence.com"
                  className="hover:text-white transition-colors text-sm"
                >
                  info@digisence.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300 group">
                <div className="p-2 bg-slate-700/80 rounded-lg group-hover:bg-primary transition-colors duration-300">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="hover:text-white transition-colors text-sm"
                >
                  +91 XXX XXX XXXX
                </a>
              </div>
              <div className="flex items-start gap-3 text-gray-300 group">
                <div className="p-2 bg-slate-700/80 rounded-lg group-hover:bg-primary transition-colors duration-300 mt-0.5">
                  <MapPin className="h-5 w-5 text-white shrink-0" />
                </div>
                <span className="text-sm">Agra, Uttar Pradesh, India</span>
              </div>
              {/* Get Started CTA Button */}
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white text-white hover:bg-white hover:text-primary transition-all duration-300 font-semibold w-full justify-center group"
              >
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700/50 pt-8 mb-8">
          <div className="bg-slate-700/50 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-center flex  lg:text-left">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                    Subscribe to Our Newsletter
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Get the latest updates, tips, and offers delivered to your
                    inbox.
                  </p>
                </div>
              </div>
              <form className="flex w-full lg:w-auto gap-3 flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 sm:w-64 px-4 py-3 rounded-xl bg-slate-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="submit"
                  className="bg-white  hover:opacity-90 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Subscribe
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left order-2 md:order-1">
              <p className="text-gray-400 text-sm">
                © 2025 <strong className="text-white">DigiSence</strong>. All
                rights reserved.
              </p>
            </div>

            {/* Centered Powered by Digiconn Unite */}
            <div className="order-1 md:order-2 flex items-center justify-center gap-2">
              <p className="text-gray-400 text-sm text-center">
                Powered by{" "}
                <Link href="https://digiconnunite.com" target="_blank" rel="noopener noreferrer">
                  <span className="text-white font-semibold hover:text-primary transition-colors cursor-pointer">
                    Digiconn Unite Pvt. Ltd.
                  </span>
                </Link>
              </p>
            </div>

            {/* Privacy & Terms Links */}
            <div className="flex gap-2 text-sm order-3">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-primary transition-colors duration-300"
              >
                Privacy
              </Link>
              <div className="h-1 rounded-full my-auto w-1 bg-white"></div>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-primary transition-colors duration-300"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
