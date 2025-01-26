import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

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
      setDownloading(true);
      const downloadUrl = `/api/artwork/download?url=${encodeURIComponent(artwork.imageUrl)}&format=png`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download image');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${artwork.title.slice(0, 30)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading PNG:', error);
      toast.error(error.message || 'Failed to download PNG. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const downloadUrl = `/api/artwork/download?url=${encodeURIComponent(artwork.imageUrl)}&format=pdf`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${artwork.title.slice(0, 30)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      toast.error(error.message || 'Failed to download PDF. Please try again.');
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-6">
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
            {/* Title */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Title</h3>
              <p className="text-base font-medium">{artwork.title}</p>
            </div>

            {/* Prompt */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Prompt</h3>
              <p className="text-base">{artwork.prompt}</p>
            </div>

            {/* Download Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleDownloadPNG}
                variant="outline"
                className="flex-1"
                disabled={downloading}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex-1"
                disabled={downloading}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 