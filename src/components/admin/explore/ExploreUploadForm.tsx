'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from 'sonner'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from '@/components/ui/Card'
import { ArtworkCategory } from '@prisma/client'

interface UploadedArtwork {
  file: File
  previewUrl: string
  title: string
  description?: string
}

export function ExploreUploadForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [collectionTitle, setCollectionTitle] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')
  const [collectionType, setCollectionType] = useState<ArtworkCategory | ''>('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [artworks, setArtworks] = useState<UploadedArtwork[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const url = URL.createObjectURL(file)
      setCoverPreview(url)
    }
  }

  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newArtworks = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      title: file.name.split('.')[0],
      description: ''
    }))
    setArtworks([...artworks, ...newArtworks])
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!coverFile || !collectionTitle || !collectionType || artworks.length === 0) {
      toast.error('请填写所有必填字段并上传至少一个作品')
      return
    }

    setIsUploading(true)
    
    try {
      // 1. 创建作品集
      const collectionFormData = new FormData()
      collectionFormData.append('title', collectionTitle)
      collectionFormData.append('description', collectionDescription)
      collectionFormData.append('type', collectionType)
      collectionFormData.append('cover', coverFile)
      collectionFormData.append('tags', JSON.stringify(tags))
      
      const response = await fetch('/api/admin/explore/collection', {
        method: 'POST',
        body: collectionFormData
      })

      if (!response.ok) {
        throw new Error('Failed to create collection')
      }

      const { collectionId } = await response.json()

      // 2. 上传作品
      for (const artwork of artworks) {
        const artworkFormData = new FormData()
        artworkFormData.append('collectionId', collectionId)
        artworkFormData.append('title', artwork.title)
        artworkFormData.append('description', artwork.description || '')
        artworkFormData.append('image', artwork.file)
        
        const artworkResponse = await fetch('/api/admin/explore/artwork', {
          method: 'POST',
          body: artworkFormData
        })

        if (!artworkResponse.ok) {
          throw new Error(`Failed to upload artwork: ${artwork.title}`)
        }
      }

      toast.success('作品集上传成功')
      
      // Reset form
      setCollectionTitle('')
      setCollectionDescription('')
      setCollectionType('')
      setCoverFile(null)
      setCoverPreview(null)
      setArtworks([])
      setTags([])
      setTagInput('')
      
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('上传失败')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="作品集标题"
          value={collectionTitle}
          onChange={(e) => setCollectionTitle(e.target.value)}
          className="input-primary"
        />

        <Select value={collectionType} onValueChange={(value: ArtworkCategory) => setCollectionType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COLORINGPAGES">填色页</SelectItem>
            <SelectItem value="COLORFULVISUAL">视觉艺术</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          placeholder="作品集描述"
          value={collectionDescription}
          onChange={(e) => setCollectionDescription(e.target.value)}
          rows={4}
          className="input-primary"
        />

        {/* Cover Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary">作品集封面</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-secondary/30 rounded-lg cursor-pointer bg-bg-primary hover:bg-bg-subtle transition-colors">
              {coverPreview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={coverPreview}
                    alt="Cover Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-text-secondary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-text-secondary"><span className="font-semibold">点击上传</span> 或拖放封面图片</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleCoverChange}
              />
            </label>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Input
            placeholder="输入标签并按回车添加"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInput}
            className="input-primary"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-sm bg-bg-subtle text-text-secondary rounded-full cursor-pointer hover:bg-secondary/10 transition-colors"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  {tag} ×
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Artworks Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-secondary">作品文件</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-secondary/30 rounded-lg cursor-pointer bg-bg-primary hover:bg-bg-subtle transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-text-secondary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-text-secondary"><span className="font-semibold">点击上传</span> 或拖放作品文件</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleArtworkUpload}
              />
            </label>
          </div>
        </div>

        {/* Uploaded Artworks Preview */}
        {artworks.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary">已上传作品</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {artworks.map((artwork, index) => (
                <Card key={index} className="p-4 space-y-2">
                  <div className="relative aspect-square">
                    <Image
                      src={artwork.previewUrl}
                      alt={artwork.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Input
                    placeholder="作品标题"
                    value={artwork.title}
                    onChange={(e) => {
                      const newArtworks = [...artworks]
                      newArtworks[index].title = e.target.value
                      setArtworks(newArtworks)
                    }}
                    className="input-primary"
                  />
                  <Textarea
                    placeholder="作品描述（可选）"
                    value={artwork.description}
                    onChange={(e) => {
                      const newArtworks = [...artworks]
                      newArtworks[index].description = e.target.value
                      setArtworks(newArtworks)
                    }}
                    rows={2}
                    className="input-primary"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      const newArtworks = artworks.filter((_, i) => i !== index)
                      setArtworks(newArtworks)
                    }}
                    className="w-full"
                  >
                    删除
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isUploading}
          className="w-full btn-primary"
        >
          {isUploading ? '上传中...' : '上传作品集'}
        </Button>
      </div>
    </form>
  )
} 