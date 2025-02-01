'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

type MenuItem = {
  label: string;
  href?: string;
  children?: {
    label: string;
    href: string;
    description?: string;
    image?: string;
  }[];
};

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Explore', href: '/explore/artworks' },
  {
    label: 'Create',
    children: [
      {
        label: 'Coloring Meditation',
        href: '/create/coloring',
        description: 'Create your own mindful coloring experience',
        image: '/images/nav/create-coloring.jpg'
      },
      {
        label: 'Meditation Visuals',
        href: '/create/meditation',
        description: 'Generate calming meditation visuals',
        image: '/images/nav/meditation.jpg'
      },
      {
        label: 'Soul Art Space',
        href: '/create/vision',
        description: 'Transform your thoughts into art',
        image: '/images/nav/vision.jpg'
      }
    ]
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Membership', href: '/membership' },
  {
    label: 'About',
    children: [
      {
        label: 'Our Story',
        href: '/about',
        description: 'Learn about our journey'
      },
      {
        label: 'Contact Us',
        href: '/about/contact',
        description: 'Get in touch with us'
      },
      {
        label: 'Write For Us',
        href: '/about/write-for-us',
        description: 'Join our community of writers'
      },
      {
        label: 'FAQ',
        href: '/about/faq',
        description: 'Find answers to common questions'
      }
    ]
  }
];

export function MainNav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout>();
  const pathname = usePathname();

  const handleMouseEnter = useCallback((label: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
  }, []);

  return (
    <>
      <nav className="relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-[1fr_2fr_1fr] items-center h-[80px]">
            {/* Left: Logo */}
            <div className="pl-4 flex items-center">
              <Link href="/" className="flex items-center">
                <img
                  src="/images/logo.svg"
                  alt="MindfulArt"
                  className="h-[70px] w-auto"
                  loading="eager"
                />
              </Link>
            </div>

            {/* Center: Navigation */}
            <div className="flex justify-center items-center px-4">
              <div className="hidden md:flex items-center space-x-14">
                {menuItems.map((item) => (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={cn(
                          "font-space-mono text-[15px] tracking-[0.03em] transition-colors hover:text-primary/90",
                          pathname === item.href && pathname !== '/'
                            ? "text-primary"
                            : "text-gray-800"
                        )}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button 
                        className="font-space-mono text-[14px] tracking-[0.02em] font-normal text-gray-800 hover:text-primary/90 transition-colors"
                      >
                        {item.label}
                      </button>
                    )}

                    {/* Dropdown Menu with AnimatePresence */}
                    <AnimatePresence>
                      {item.children && activeMenu === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-[52px] left-1/2 transform -translate-x-1/2 w-screen max-w-sm px-2"
                        >
                          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="relative grid gap-4 bg-white p-4">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="flex items-start p-3 -m-3 rounded-lg hover:bg-gray-50 transition ease-in-out duration-150"
                                >
                                  {child.image && (
                                    <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden mr-4">
                                      <img
                                        src={child.image}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-base font-garamond text-gray-900">
                                      {child.label}
                                    </p>
                                    {child.description && (
                                      <p className="mt-1 text-sm font-quattrocento text-gray-500">
                                        {child.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden ml-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu with AnimatePresence */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {menuItems.map((item) => (
                  <div key={item.label}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="block px-3 py-2 text-base font-space-mono"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button className="w-full text-left px-3 py-2 text-base font-space-mono">
                        {item.label}
                      </button>
                    )}
                    {item.children && (
                      <div className="pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-3 py-2 text-sm font-space-mono"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
} 