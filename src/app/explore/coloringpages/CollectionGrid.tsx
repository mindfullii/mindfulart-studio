'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ZoomIn } from 'lucide-react';
import { ImageViewer } from '@/components/explore/ImageViewer';
import { ArtworkCategory } from '@prisma/client';

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

interface ExploreCollection {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string;
  type: ArtworkCategory;
  featured: boolean;
  downloadUrls: {
    png: string;
    pdf?: string;
  };
  artworks: ExploreArtwork[];
  tags: string[];
}

export function CollectionGrid({ collections }: { collections: ExploreCollection[] }) {
  const [selectedArtwork, setSelectedArtwork] = useState<ExploreArtwork | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleOpenViewer = (artwork: ExploreArtwork) => {
    setSelectedArtwork(artwork);
    setIsViewerOpen(true);
  };

  // 将集合分成五列，实现瀑布流
  const columns = [
    collections.filter((_, i) => i % 5 === 0),
    collections.filter((_, i) => i % 5 === 1),
    collections.filter((_, i) => i % 5 === 2),
    collections.filter((_, i) => i % 5 === 3),
    collections.filter((_, i) => i % 5 === 4),
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((collection) => (
              <Link 
                key={collection.id} 
                href={`/explore/coloringpages/${collection.id}`}
                className="group block"
              >
                <div className="relative rounded-lg overflow-hidden bg-bg-subtle">
                  <div className="relative" style={{ 
                    paddingTop: `${Math.floor(Math.random() * 40 + 100)}%`
                  }}>
                    <Image
                      src={collection.coverUrl}
                      alt={collection.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* Text Overlay */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white/10 hover:bg-white/20 text-white shadow-lg backdrop-blur-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleOpenViewer(collection.artworks[0]);
                          }}
                        >
                          <ZoomIn className="w-4 h-4 mr-1" />
                          Quick View
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-white line-clamp-2">
                          {collection.title}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {collection.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="text-xs px-1.5 py-0.5 bg-white/20 rounded-full text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-white/90">
                          {collection.artworks.length} artworks
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>

      {selectedArtwork && (
        <ImageViewer
          artwork={selectedArtwork}
          artworks={selectedArtwork ? collections.find(c => c.artworks.includes(selectedArtwork))?.artworks : undefined}
          currentIndex={selectedArtwork ? collections.find(c => c.artworks.includes(selectedArtwork))?.artworks.findIndex(a => a.id === selectedArtwork.id) : undefined}
          onIndexChange={(index) => {
            const collection = collections.find(c => c.artworks.includes(selectedArtwork));
            if (collection) {
              setSelectedArtwork(collection.artworks[index]);
            }
          }}
          isOpen={isViewerOpen}
          onOpenChange={setIsViewerOpen}
        />
      )}
    </>
  );
} 