'use client'

import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminInitPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInit = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/init', {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      setSuccess(true)
      // 成功后3秒跳转到管理页面
      setTimeout(() => {
        router.push('/admin')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '初始化失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-24 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">初始化管理员</h1>
        <p className="text-muted-foreground">
          点击下面的按钮将当前账号升级为管理员。
        </p>
      </div>

      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 text-green-700 bg-green-100 rounded-md">
          初始化成功！3秒后跳转到管理页面...
        </div>
      )}

      <Button 
        onClick={handleInit} 
        disabled={loading || success}
      >
        {loading ? '初始化中...' : '初始化管理员'}
      </Button>
    </div>
  )
} 
