'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useClickOutside } from '@/hooks/useClickOutside';

type UserMenuProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    credits?: number;
  };
};

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [credits, setCredits] = useState(user.credits || 0);
  const menuRef = useClickOutside(() => setIsOpen(false));

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/user/credits');
      const data = await response.json();
      if (response.ok) {
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  // 当菜单打开时获取最新积分
  useEffect(() => {
    if (isOpen) {
      fetchCredits();
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-mono text-primary">Hi, {user.name || 'User'}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded shadow-lg border border-gray-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100 space-y-2">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="font-body text-xs text-gray-500">{user.email}</div>
            <div className="font-body text-xs text-emerald-500">
              {credits} credits remaining
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 space-y-1">
            <Link
              href="/dashboard"
              className="block px-4 py-2 font-body text-sm text-gray-900 hover:bg-gray-50"
            >
              My Artworks
            </Link>
            <Link
              href="/dashboard/subscription"
              className="block px-4 py-2 font-body text-sm text-gray-900 hover:bg-gray-50"
            >
              My Subscription
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 font-body text-sm text-gray-900 hover:bg-gray-50"
            >
              Profile & Settings
            </Link>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-100">
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 font-body text-sm text-gray-700 hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 