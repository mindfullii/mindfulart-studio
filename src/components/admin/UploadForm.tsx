'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SimilarArtwork {
  id: string;
  imageUrl: string;
  title: string;
}

const ARTWORK_TYPES = [
  { value: 'coloring', label: 'Coloring Pages' },
  { value: 'vision', label: 'Visuals' },
  { value: 'editorspick', label: 'Editors Pick' }
];

export function UploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [similarArtworks, setSimilarArtworks] = useState<SimilarArtwork[]>([]);

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
        fetchSimilarArtworks([...tags, newTag]);
      }
    }
  };

  const fetchSimilarArtworks = async (currentTags: string[]) => {
    try {
      const response = await fetch('/api/artwork/similar?' + new URLSearchParams({
        tags: currentTags.join(',')
      }));
      if (response.ok) {
        const data = await response.json();
        setSimilarArtworks(data.artworks);
      }
    } catch (error) {
      console.error('Error fetching similar artworks:', error);
    }
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

    try {
      const response = await fetch('/api/admin/artwork/upload', {
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
        setSimilarArtworks([]);
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

        <Input
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="选择类型" />
          </SelectTrigger>
          <SelectContent>
            {ARTWORK_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          placeholder="描述"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

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
                  className="px-2 py-1 text-sm bg-gray-100 rounded-full"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  {tag} ×
                </span>
              ))}
            </div>
          )}
        </div>

        {similarArtworks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">相似作品</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {similarArtworks.map((artwork) => (
                <div key={artwork.id} className="relative aspect-square">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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