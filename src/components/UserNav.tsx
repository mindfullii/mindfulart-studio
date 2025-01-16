'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';
import { CreditCardIcon, UserIcon, LogOutIcon, CoinsIcon } from 'lucide-react';

interface UserNavProps {
  name?: string | null;
}

export function UserNav({ name }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          Hi, {name || 'User'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="w-full flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>My Artworks</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/credits" className="w-full flex items-center">
              <CoinsIcon className="mr-2 h-4 w-4" />
              <span>My Credits</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link 
              href="/subscription" 
              className="flex items-center"
            >
              <CreditCardIcon className="mr-2 h-4 w-4" />
              <span>My Subscription</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 