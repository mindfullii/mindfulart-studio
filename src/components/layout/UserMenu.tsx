'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useClickOutside } from '@/hooks/useClickOutside';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useClickOutside(() => setIsOpen(false));

  // Debug: 打印详细的 session 信息
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Full session:', session);
    if (session?.user) {
      console.log('User object:', {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        credits: session.user.credits,
        isSubscribed: session.user.isSubscribed,
      });
    }
  }, [session, status]);

  // 定期刷新 session
  useEffect(() => {
    const refreshSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          console.log('Refreshed session:', data);
        }
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
    };

    if (status === 'authenticated') {
      refreshSession();
      const interval = setInterval(refreshSession, 30000); // 每30秒刷新一次
      return () => clearInterval(interval);
    }
  }, [status]);

  if (!session?.user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-mono text-primary">Hey, {session.user.name || 'User'}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded shadow-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-sm font-medium">My Account</div>
            <div className="text-xs text-gray-500 mt-1">
              Credits: {session.user.credits || 0}
            </div>
          </div>

          <div className="py-2">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="mr-2">👤</span>
              My Artworks
            </Link>
            <Link
              href="/credits"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="mr-2">🎫</span>
              My Credits
              <span className="ml-auto text-xs text-gray-500">{session.user.credits || 0}</span>
            </Link>
            <Link
              href="/subscription"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="mr-2">💳</span>
              My Subscription
            </Link>
          </div>

          <div className="border-t border-gray-100">
            <button
              onClick={() => signOut()}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              <span className="mr-2">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 