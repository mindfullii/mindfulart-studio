'use client';

import Link from 'next/link';
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

  // 使用 useEffect 来处理客户端水合
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端水合之前不渲染认证相关的 UI
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            </nav>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : status === 'authenticated' ? (
              <UserNav user={session.user} />
            ) : (
              <Button 
                variant="default" 
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
} 