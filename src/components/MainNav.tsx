'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AuthModal } from '@/components/auth/AuthModal';
import { useSession } from 'next-auth/react';
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
  {
    label: 'Explore',
    children: [
      {
        label: 'Mindful Coloring Pages',
        href: '/explore/mindfulcoloringpages',
        description: 'Find peace in mindful coloring',
        image: '/images/nav/coloring.jpg'
      },
      {
        label: 'Visual Journal Artworks',
        href: '/explore/visualjournalartworks',
        description: 'Explore visual meditation experiences',
        image: '/images/nav/journal.jpg'
      },
      {
        label: "Editor's Picks",
        href: '/explore/editorspicks',
        description: 'Curated artworks for inspiration',
        image: '/images/nav/picks.jpg'
      }
    ]
  },
  {
    label: 'Create',
    children: [
      {
        label: 'Mindful Coloring',
        href: '/create/mindfulcoloring',
        description: 'Create your own mindful coloring experience',
        image: '/images/nav/create-coloring.jpg'
      },
      {
        label: 'Meditation Visuals',
        href: '/create/meditationvisuals',
        description: 'Generate calming meditation visuals',
        image: '/images/nav/meditation.jpg'
      },
      {
        label: 'Inner Vision',
        href: '/create/innervision',
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
        href: '/about/ourstory',
        description: 'Learn about our journey'
      },
      {
        label: 'Contact Us',
        href: '/about/contactus',
        description: 'Get in touch with us'
      },
      {
        label: 'Write For Us',
        href: '/about/writeforus',
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
  const { data: session } = useSession();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout>();
  const pathname = usePathname();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMouseEnter = (label: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <nav className="relative">
        <div className="max-w-7xl mx-auto px-0">
          <div className="flex items-center h-20">
            {/* Logo */}
            <Link href="/" className="mr-20">
              <img
                src="/images/logo.svg"
                alt="MindfulArt"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
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

                  {/* Dropdown Menu */}
                  {item.children && activeMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-md px-2"
                    >
                      <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="relative grid gap-6 bg-white p-6 sm:gap-8">
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
                                    alt={child.label}
                                    className="w-full h-full object-cover"
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
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden ml-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-base font-space-mono"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button className="w-full text-left px-3 py-2 text-base font-space-mono">
                      {item.label}
                    </button>
                  )}
                  {/* Mobile Dropdown */}
                  {item.children && (
                    <div className="pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm font-space-mono"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
} 