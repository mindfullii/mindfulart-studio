import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ArtworkPreviewModalProps {
  artwork: {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
  };
  onClose: () => void;
}

export function ArtworkPreviewModal({ artwork, onClose }: ArtworkPreviewModalProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      // 通过 API 下载图片
      const response = await fetch('/api/artwork/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artworkId: artwork.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to download image');
      }

      // 获取 blob 数据
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${artwork.title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // 处理 ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // 处理背景点击关闭
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={handleBackgroundClick}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl"
        onClick={e => e.stopPropagation()} // 防止点击内容区域时关闭
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>

        <div className="p-6">
          {/* Image container */}
          <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-4">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-contain"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>

          {/* Info and actions */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-900">{artwork.title}</h3>
              <p className="text-sm text-gray-500">{formatDate(artwork.createdAt)}</p>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`flex items-center space-x-2 px-4 py-2 bg-[#6DB889] text-white rounded-lg hover:bg-[#5CA978] transition-colors ${
                downloading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 