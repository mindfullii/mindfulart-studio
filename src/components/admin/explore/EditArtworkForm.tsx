'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Editor } from '@tinymce/tinymce-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArtworkCategory } from '@prisma/client'
import { useRouter } from 'next/navigation'

interface RelatedArtwork {
  id: string
  imageUrl: string
  title: string
}

interface EditArtworkFormProps {
  artworkId: string
}

export function EditArtworkForm({ artworkId }: EditArtworkFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ArtworkCategory | ''>('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [availableArtworks, setAvailableArtworks] = useState<RelatedArtwork[]>([])
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState('')

  // 加载作品数据
  useEffect(() => {
    const fetchArtwork = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/explore/artwork/${artworkId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch artwork')
        }
        const data = await response.json()
        
        setTitle(data.title)
        setDescription(data.description)
        setType(data.type)
        setTags(data.tags)
        setImageUrl(data.imageUrl)
        setSelectedArtworks(data.relatedTo.map((artwork: RelatedArtwork) => artwork.id))
      } catch (error) {
        console.error('Error fetching artwork:', error)
        toast.error('加载作品失败')
      } finally {
        setIsLoading(false)
      }
    }

    const fetchAvailableArtworks = async () => {
      try {
        const response = await fetch('/api/admin/explore/artwork')
        if (response.ok) {
          const data = await response.json()
          setAvailableArtworks(data.filter((artwork: RelatedArtwork) => artwork.id !== artworkId))
        }
      } catch (error) {
        console.error('Error fetching artworks:', error)
      }
    }

    fetchArtwork()
    fetchAvailableArtworks()
  }, [artworkId])

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setTagInput('')
      }
    }
  }

  const handleArtworkSelect = (artworkId: string) => {
    setSelectedArtworks(prev => {
      if (prev.includes(artworkId)) {
        return prev.filter(id => id !== artworkId)
      } else {
        return [...prev, artworkId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description || !type) {
      toast.error('请填写所有必填字段')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/explore/artwork/${artworkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          type,
          tags,
          relatedArtworks: selectedArtworks,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update artwork')
      }

      toast.success('保存成功')
      router.push(`/explore/artworks/${artworkId}`)
    } catch (error) {
      console.error('Error updating artwork:', error)
      toast.error('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">加载中...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* 预览图片 */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* 标题 */}
        <Input
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 类型选择 */}
        <Select value={type} onValueChange={(value: ArtworkCategory) => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COLORINGPAGES">填色页</SelectItem>
            <SelectItem value="COLORFULVISUAL">视觉艺术</SelectItem>
          </SelectContent>
        </Select>

        {/* 富文本编辑器 */}
        <div className="min-h-[400px]">
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={description}
            onEditorChange={(content) => setDescription(content)}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: `
                body { 
                  font-family: 'Quattrocento Sans', sans-serif; 
                  font-size: 1rem; 
                  line-height: 1.6;
                  color: #1A1A1A;
                }
                h1 { 
                  font-family: 'EB Garamond', serif;
                  font-size: 2.8em;
                  font-weight: 600;
                  line-height: 1.2;
                }
                h2 { 
                  font-family: 'Spectral', serif;
                  font-size: 1.8em;
                  font-weight: 500;
                  line-height: 1.3;
                }
                h3 { 
                  font-family: 'Spectral', serif;
                  font-size: 1.5em;
                  font-weight: 400;
                  line-height: 1.4;
                }
              `,
              style_formats: [
                { title: '正文', block: 'p', classes: 'body-text' },
                { title: '标题1', block: 'h1', classes: 'heading-1' },
                { title: '标题2', block: 'h2', classes: 'heading-2' },
                { title: '标题3', block: 'h3', classes: 'heading-3' }
              ],
              color_map: [
                "#1A1A1A", "主要文本",
                "#4A4A4A", "次要文本",
                "#717171", "辅助文本",
                "#6DB889", "主色",
                "#88B3BA", "次要色",
                "#4CAF50", "成功",
                "#FFA726", "警告",
                "#EF5350", "错误",
                "#42A5F5", "信息"
              ]
            }}
          />
        </div>

        {/* 标签 */}
        <div className="space-y-2">
          <Input
            placeholder="输入标签并按回车添加"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInput}
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-sm bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  {tag} ×
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 相关作品选择 */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">选择相关作品</h3>
            <ScrollArea className="h-[300px] pr-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {availableArtworks.map((artwork) => (
                  <div key={artwork.id} className="relative">
                    <div className="relative aspect-square mb-2">
                      <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={artwork.id}
                        checked={selectedArtworks.includes(artwork.id)}
                        onCheckedChange={() => handleArtworkSelect(artwork.id)}
                      />
                      <label htmlFor={artwork.id} className="text-sm truncate">
                        {artwork.title}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 提交按钮 */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
            取消
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>
    </form>
  )
} 