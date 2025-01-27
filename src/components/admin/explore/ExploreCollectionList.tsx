'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface ExploreCollection {
  id: string
  title: string
  description: string | null
  coverUrl: string
  type: 'COLORINGPAGES' | 'COLORFULVISUAL'
  featured: boolean
  downloads: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export function ExploreCollectionList() {
  const [collections, setCollections] = useState<ExploreCollection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/admin/explore/collection')
      if (!response.ok) {
        throw new Error('Failed to fetch collections')
      }
      const data = await response.json()
      setCollections(data)
    } catch (error) {
      console.error('Error fetching collections:', error)
      toast.error('加载作品集失败')
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/explore/collection/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured }),
      })

      if (!response.ok) {
        throw new Error('Failed to update collection')
      }

      setCollections(collections.map(collection => 
        collection.id === id ? { ...collection, featured } : collection
      ))
      
      toast.success('更新成功')
    } catch (error) {
      console.error('Error updating collection:', error)
      toast.error('更新失败')
    }
  }

  const deleteCollection = async (id: string) => {
    if (!confirm('确定要删除这个作品集吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/explore/collection/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete collection')
      }

      setCollections(collections.filter(collection => collection.id !== id))
      toast.success('删除成功')
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast.error('删除失败')
    }
  }

  if (loading) {
    return <div className="text-center py-10">加载中...</div>
  }

  if (collections.length === 0) {
    return <div className="text-center text-text-secondary py-10">暂无作品集</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <Card key={collection.id}>
          <div className="relative aspect-[4/3]">
            <Image
              src={collection.coverUrl}
              alt={collection.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          <CardHeader>
            <CardTitle>{collection.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-text-secondary">{collection.description}</p>
              <div className="flex flex-wrap gap-2">
                {collection.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-sm bg-bg-subtle text-text-secondary rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Button
                  variant={collection.featured ? "default" : "outline"}
                  onClick={() => toggleFeatured(collection.id, !collection.featured)}
                >
                  {collection.featured ? '取消推荐' : '推荐'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteCollection(collection.id)}
                >
                  删除
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 