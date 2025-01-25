'use client'

import { UploadForm } from '@/components/admin/UploadForm'

export default function UploadPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">上传作品</h1>
      <UploadForm />
    </div>
  )
} 