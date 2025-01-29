'use client'

import { EditArtworkForm } from '@/components/admin/explore/EditArtworkForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface Props {
  params: {
    id: string
  }
}

export default function EditArtworkPage({ params }: Props) {
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>编辑作品</CardTitle>
          <CardDescription>
            编辑作品信息，包括标题、描述、标签和相关作品。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditArtworkForm artworkId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
} 