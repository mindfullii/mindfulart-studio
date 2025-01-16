'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { UserMenu } from './UserMenu';
import { Container } from '@/components/ui/Container';
import { AuthModal } from '@/components/auth/AuthModal';

// 定义导航菜单类型
type MenuItem = {
  label: string;
  href?: string;
  children?: {
    label: string;
    href: string;
    description?: string;
    image?: string;
  }[];
  type?: 'simple' | 'mega';
};

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Explore',
    type: 'mega',
    children: [
      {
        label: 'Coloring Pages',
        href: '/explore/coloring',
        description: 'Discover our collection of mindful coloring pages',
        image: '/images/menu/coloring.jpg'
      },
      {
        label: 'Mindful Visuals',
        href: '/explore/visuals',
        description: 'Explore visual meditation experiences',
        image: '/images/menu/visuals.jpg'
      }
    ]
  },
  {
    label: 'Create',
    type: 'mega',
    children: [
      {
        label: 'Mindful Coloring',
        href: '/create/coloring',
        description: 'Create your own mindful coloring experience',
        image: '/images/menu/create-coloring.jpg'
      },
      {
        label: 'Meditation Visual',
        href: '/create/meditation',
        description: 'Generate calming meditation visuals',
        image: '/images/menu/create-meditation.jpg'
      },
      {
        label: 'Inner Vision',
        href: '/create/vision',
        description: 'Transform your thoughts into art',
        image: '/images/menu/create-vision.jpg'
      }
    ]
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  {
    label: 'About Us',
    type: 'simple',
    children: [
      { label: 'Our Story', href: '/about/story' },
      { label: 'Contact Us', href: '/about/contact' },
      { label: 'Guest Post', href: '/about/guest-post' },
      { label: 'Newsletter', href: '/about/newsletter' }
    ]
  }
];

export function Header() {
  const { data: session } = useSession();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout>();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleMouseEnter = (label: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100); // 添加一个小延迟，让用户有时间移动到子菜单
  };

  return (
    <header className="sticky top-0 w-full bg-white border-b border-secondary/10 z-50">
      <Container size="wide">
        <div className="flex items-center justify-between h-24">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/branding/logo.svg"
                alt="MindfulArt Studio"
                width={240}
                height={60}
                priority
                className="h-[60px] w-auto"
              />
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-12">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-primary font-normal font-mono transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button className="flex items-center text-gray-600 hover:text-primary font-normal font-mono transition-colors py-2">
                      {item.label}
                      <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </button>
                  )}

                  {/* Dropdown Menus */}
                  {item.children && activeMenu === item.label && (
                    <div 
                      className={cn(
                        "absolute top-full mt-0 bg-white rounded-lg shadow-lg overflow-hidden",
                        item.type === 'mega' 
                          ? 'w-[900px] left-1/2 -translate-x-1/2' 
                          : 'w-48 left-0'
                      )}
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {item.type === 'mega' ? (
                        <div 
                          className={cn(
                            "grid gap-6 p-6",
                            item.children.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                          )}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="group block"
                            >
                              {child.image && (
                                <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                                  <Image
                                    src={child.image}
                                    alt={child.label}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                              )}
                              <h3 className="font-medium text-text-primary mb-1">
                                {child.label}
                              </h3>
                              {child.description && (
                                <p className="text-sm text-text-secondary">
                                  {child.description}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-text-secondary hover:bg-primary/5 hover:text-primary"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Right: Sign In/User Menu */}
          <div className="flex items-center">
            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <div className="flex items-center space-x-4">
                <UserCircleIcon className="w-6 h-6 text-gray-400" />
                <div className="text-sm font-mono">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    Sign In / Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
} 