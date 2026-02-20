'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar'

interface NavigationProps {
  navItems: { name: string; link: string }[]
  joinLink?: string
  joinText?: string
}

export default function Navigation({ navItems, joinLink = "/dashboard/professional", joinText = "Join as Professional" }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <Link
          href="/"
          className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-gray-900"
        >
          <img src="/logo.png" alt="DigiSence" className="h-7 w-auto" />
          <span className="font-bold text-xl text-slate-800">DigiSence</span>
        </Link>
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <NavbarButton variant="dark" as={Link} href={joinLink}>{joinText}</NavbarButton>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Link
            href="/"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-gray-900"
          >
            <img src="/logo.png" alt="DigiSence" className="h-10 w-auto" />
            <span className="font-bold text-slate-800">DigiSence</span>
          </Link>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => {
            const isActive = pathname === item.link;
            return (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "relative text-neutral-600 dark:text-neutral-300",
                  isActive && "text-blue-600 dark:text-blue-400 font-semibold"
                )}
              >
                <span className="block">{item.name}</span>
              </Link>
            );
          })}
          <div className="flex w-full flex-col gap-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="dark"
              className="w-full"
              as={Link}
              href={joinLink}
            >
              {joinText}
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}
