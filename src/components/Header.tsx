'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { UserNav } from './UserNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState } from 'react';

export function Header() {
  const { data: session } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-heading text-xl font-bold tracking-tight"
          >
            MindfulArt Studio
          </Link>

          {/* Navigation */}
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 flex-1 justify-center">
            <Link 
              href="/" 
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Home
            </Link>
            <div className="relative group">
              <Link 
                href="/explore" 
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
              >
                Explore
              </Link>
              {/* Mega Menu */}
              <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-white border rounded-lg shadow-lg p-4">
                {/* Mega Menu 内容 */}
              </div>
            </div>
            <div className="relative group">
              <Link 
                href="/create" 
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
              >
                Create
              </Link>
              {/* Mega Menu */}
              <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-white border rounded-lg shadow-lg p-4">
                {/* Mega Menu 内容 */}
              </div>
            </div>
            <Link 
              href="/pricing" 
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/blog" 
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {session ? (
              <UserNav name={session.user?.name} />
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
} 