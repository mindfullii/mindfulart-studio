'use client';

import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  downloadUrl?: string; // 添加下载链接字段
}

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onTagClick?: (tag: string) => void;
}

export function ArtworkModal({ artwork, onClose, onTagClick }: ArtworkModalProps) {
  const router = useRouter();

  if (!artwork) return null;

  // 处理下载
  const handleDownload = () => {
    if (!artwork.downloadUrl) return;
    
    // 创建一个隐藏的 a 标签并触发下载
    const link = document.createElement('a');
    link.href = artwork.downloadUrl;
    link.download = artwork.title + '.jpg'; // 或者根据实际文件类型设置扩展名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={!!artwork} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[1200px] p-6 bg-white min-h-[600px]">
        <div className="flex gap-6 h-full">
          {/* 左侧：图片区域 */}
          <div className="flex-[2] bg-gray-50 rounded-lg overflow-hidden">
            <div className="relative w-full h-full min-h-[500px]">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* 右侧：信息区域 */}
          <div className="flex-1 min-w-[300px] flex flex-col">
            {/* 标题和描述 */}
            <div className="mb-8">
              <h2 className="text-2xl font-heading mb-3">{artwork.title}</h2>
              <p className="text-text-secondary whitespace-pre-wrap">
                {artwork.description}
              </p>
            </div>

            {/* 标签 */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick?.(tag)}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 固定在底部的按钮和许可信息 */}
            <div className="mt-auto pt-4 border-t">
              <div className="space-y-3 mb-4">
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-[#82C3A9] text-white hover:bg-[#82C3A9]/90"
                >
                  Download
                </Button>
                <Link href={`/create?ref=${artwork.id}`} className="block">
                  <Button variant="outline" className="w-full border-gray-200">
                    Create Similar
                  </Button>
                </Link>
              </div>
              <Link 
                href="/license" 
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
              >
                Use for free, anywhere.
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 