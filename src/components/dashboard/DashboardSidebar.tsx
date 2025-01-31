import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Account Details', href: '/account' },
  { name: 'My Artworks', href: '/dashboard' },
  { name: 'My Subscription', href: '/subscription' },
  { name: 'My Credits', href: '/credits' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 pr-8 py-12">
      <ul className="space-y-2">
        {navigation.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cn(
                'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              {item.name}
            </Link>
          </li>
        ))}
        <li className="pt-4 mt-4 border-t border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  );
} 
