import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="container max-w-7xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">管理员控制台</h1>
          <p className="text-muted-foreground">
            管理和监控系统的各项功能。
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 探索内容管理 */}
          <Card>
            <CardHeader>
              <CardTitle>探索内容管理</CardTitle>
              <CardDescription>
                管理展示板块的作品集和作品
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/explore">
                  管理探索内容
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* 上传管理 */}
          <Card>
            <CardHeader>
              <CardTitle>上传管理</CardTitle>
              <CardDescription>
                管理用户上传的内容
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/upload">
                  管理上传内容
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* 用户管理 */}
          <Card>
            <CardHeader>
              <CardTitle>用户管理</CardTitle>
              <CardDescription>
                管理用户账号和权限
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/users">
                  管理用户
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 