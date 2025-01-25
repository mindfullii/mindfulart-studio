import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { toast } from "sonner";

interface ArtworkPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: {
    id: string;
    title: string;
    description: string;
    prompt: string;
    imageUrl: string;
    type: string;
  };
}

export function ArtworkPreviewModal({
  isOpen,
  onClose,
  artwork,
}: ArtworkPreviewModalProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPNG = async () => {
    try {
      const downloadUrl = `/api/coloring/download?url=${encodeURIComponent(artwork.imageUrl)}&format=png`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Failed to download image');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'coloring_page.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PNG:', error);
      toast.error('Failed to download PNG. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const downloadUrl = `/api/coloring/download?url=${encodeURIComponent(artwork.imageUrl)}&format=pdf`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'coloring_page.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-6" title="Artwork Preview">
        <div className="flex gap-8">
          {/* Left: Image Preview */}
          <div className="w-1/2">
            <div className="relative h-[calc(90vh-3rem)] border border-gray-100 rounded-lg overflow-hidden">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right: Information */}
          <div className="w-1/2 space-y-6 overflow-y-auto pr-2">
            {/* Title and Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-2">{artwork.title}</h2>
              {artwork.description && (
                <p className="text-gray-600">{artwork.description}</p>
              )}
            </div>

            {/* Prompt Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Mindful Prompt</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{artwork.prompt}</p>
            </div>

            {/* Download Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleDownloadPNG}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download PNG</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-white text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 