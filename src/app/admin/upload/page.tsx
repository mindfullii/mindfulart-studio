'use client'

import { UploadForm } from '@/components/admin/UploadForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function UploadPage() {
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>上传作品</CardTitle>
          <CardDescription>
            上传新作品到探索页面。支持富文本描述和相关作品选择。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  )
} 