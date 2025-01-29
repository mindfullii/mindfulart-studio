'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Editor } from '@tinymce/tinymce-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArtworkCategory } from '@prisma/client';

interface RelatedArtwork {
  id: string;
  imageUrl: string;
  title: string;
}

export function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ArtworkCategory | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [availableArtworks, setAvailableArtworks] = useState<RelatedArtwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);

  // 获取可选的相关作品
  useEffect(() => {
    const fetchAvailableArtworks = async () => {
      try {
        const response = await fetch('/api/admin/explore/artwork');
        if (response.ok) {
          const data = await response.json();
          setAvailableArtworks(data);
        }
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };

    fetchAvailableArtworks();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const handleArtworkSelect = (artworkId: string) => {
    setSelectedArtworks(prev => {
      if (prev.includes(artworkId)) {
        return prev.filter(id => id !== artworkId);
      } else {
        return [...prev, artworkId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title || !description || !type) {
      toast.error('请填写所有必填字段');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('tags', JSON.stringify(tags));
    formData.append('relatedArtworks', JSON.stringify(selectedArtworks));

    try {
      const response = await fetch('/api/admin/explore/artwork', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('上传成功');
        setSelectedFile(null);
        setPreviewUrl(null);
        setTitle('');
        setDescription('');
        setType('');
        setTags([]);
        setTagInput('');
        setSelectedArtworks([]);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast.error('上传失败');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* 图片上传区域 */}
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            {previewUrl ? (
              <div className="relative w-full h-[400px]">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">点击上传</span> 或拖放图片
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
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
        <Button
          type="submit"
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? '上传中...' : '上传'}
        </Button>
      </div>
    </form>
  );
} 