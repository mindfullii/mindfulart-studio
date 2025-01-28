'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Download, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExploreArtwork {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  downloadUrls: {
    png: string;
    pdf?: string;
  };
}

interface ImageViewerProps {
  artwork: ExploreArtwork;
  artworks?: ExploreArtwork[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageViewer({ 
  artwork, 
  artworks, 
  currentIndex = 0, 
  onIndexChange,
  isOpen,
  onOpenChange
}: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [localIndex, setLocalIndex] = useState(currentIndex);

  useEffect(() => {
    setLocalIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (artworks && artworks.length > 1) {
            const newIndex = (localIndex - 1 + artworks.length) % artworks.length;
            handleThumbnailClick(newIndex);
          }
          break;
        case 'ArrowRight':
          if (artworks && artworks.length > 1) {
            const newIndex = (localIndex + 1) % artworks.length;
            handleThumbnailClick(newIndex);
          }
          break;
        case 'Escape':
          onOpenChange(false);
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, localIndex, artworks]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
  };

  const handleThumbnailClick = (index: number) => {
    setLocalIndex(index);
    onIndexChange?.(index);
    setScale(1); // Reset zoom when switching images
  };

  const currentArtwork = artworks ? artworks[localIndex] : artwork;
  const buttonClass = "bg-white/10 hover:bg-white/20 text-white border-white/20";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
        <div className="relative h-[90vh] w-full overflow-hidden bg-black/95">
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <div className="bg-white/10 px-3 py-1.5 rounded-md text-white text-sm mr-2">
              {artworks ? `${localIndex + 1}/${artworks.length}` : '1/1'}
            </div>
            <Button size="sm" variant="outline" className={buttonClass} onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className={buttonClass} onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className={buttonClass} onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className={buttonClass} onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <Button 
              size="sm" 
              variant="outline" 
              className={cn(buttonClass, "hover:bg-primary/20")}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/api/download?url=${encodeURIComponent(currentArtwork.downloadUrls.png)}&view=true`, '_blank');
              }}
            >
              <Download className="w-4 h-4 mr-1" />
              <span>View Original</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className={cn(buttonClass, "hover:bg-primary/20")}
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/api/download?url=${encodeURIComponent(currentArtwork.downloadUrls.png)}&type=png`;
              }}
            >
              <Download className="w-4 h-4 mr-1" />
              <span>Save PNG</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className={cn(buttonClass, "hover:bg-primary/20")}
              onClick={(e) => {
                e.stopPropagation();
                const pdfUrl = currentArtwork.downloadUrls.png;
                window.location.href = `/api/artwork/download?url=${encodeURIComponent(pdfUrl)}&format=pdf`;
              }}
            >
              <Download className="w-4 h-4 mr-1" />
              <span>Print PDF</span>
            </Button>
          </div>
          <div 
            className="h-[calc(100%-100px)] w-full flex items-center justify-center p-4"
            style={{ 
              transform: `scale(${scale})`,
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <Image
              src={currentArtwork.imageUrl}
              alt={currentArtwork.title}
              width={1200}
              height={1200}
              className="object-contain max-w-full max-h-full"
              style={{ 
                width: 'auto',
                height: 'auto'
              }}
              priority
            />
          </div>
          {artworks && artworks.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-black/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-4 py-2 h-full overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {artworks.map((art, index) => (
                  <button
                    key={art.id}
                    onClick={() => handleThumbnailClick(index)}
                    className={cn(
                      "relative overflow-hidden flex-shrink-0 transition-all duration-200",
                      localIndex === index 
                        ? "w-[100px] h-[100px] ring-2 ring-white ring-offset-2 ring-offset-black/50 rounded-lg" 
                        : "w-[80px] h-[80px] opacity-50 hover:opacity-100 rounded-md"
                    )}
                  >
                    <Image
                      src={art.imageUrl}
                      alt={art.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-1 right-1 text-xs text-white bg-black/50 px-1.5 rounded">
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {currentArtwork.title && (
            <div className="absolute bottom-[108px] left-1/2 -translate-x-1/2 bg-white/10 px-4 py-2 rounded-full">
              <p className="text-white text-sm">{currentArtwork.title}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 