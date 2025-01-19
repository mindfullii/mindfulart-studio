'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { UserNav } from './UserNav';
import { MainNav } from './MainNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState, useEffect } from 'react';

export function Header() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border rounded-lg border-gray-200">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <MainNav />
            <div className="flex items-center">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border rounded-lg border-gray-200">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <MainNav />
          <div className="flex items-center">
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : status === 'authenticated' ? (
              <UserNav user={session.user} />
            ) : (
              <Button 
                variant="default" 
                onClick={() => setShowAuthModal(true)}
                className="ml-4 font-space-mono text-[14px] tracking-[0.02em] font-normal border border-gray-200 bg-transparent hover:bg-gray-50 text-gray-600"
              >
                Sign In / Sign Up 
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