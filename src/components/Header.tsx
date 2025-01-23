'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { UserNav } from './UserNav';
import { MainNav } from './MainNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState } from 'react';
import { Container } from '@/components/ui/Container';

export function Header() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200/60">
      <Container size="wide">
        <div className="flex h-20 items-center justify-between">
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
      </Container>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
} 