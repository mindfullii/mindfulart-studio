'use client'

import { Container } from '@/components/ui/Container'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/admin/explore',
    label: 'Explore 管理'
  },
  {
    href: '/admin/users',
    label: '用户管理'
  },
  {
    href: '/admin/settings',
    label: '系统设置'
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-bg-subtle py-8">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-heading">管理后台</h1>
            <Link href="/" className="text-text-secondary hover:text-primary">
              返回首页
            </Link>
          </div>

          <nav className="flex gap-4 border-b border-secondary/20">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-text-secondary hover:text-primary transition-colors',
                  pathname === item.href && 'text-primary border-b-2 border-primary -mb-[2px]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <main>{children}</main>
        </div>
      </Container>
    </div>
  )
} 