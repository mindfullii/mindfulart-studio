'use client';

import { useState } from 'react';
import Image from 'next/image';
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

interface Props {
  collection: ExploreCollection;
}

export function CollectionDetail({ collection }: Props) {
  const [selectedArtwork, setSelectedArtwork] = useState<ExploreArtwork | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleOpenViewer = (artwork: ExploreArtwork) => {
    setSelectedArtwork(artwork);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedArtwork(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative min-h-[400px] rounded-lg overflow-hidden bg-bg-subtle">
          <Image
            src={collection.coverUrl}
            alt={collection.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{collection.title}</h1>
          {collection.description && (
            <p className="text-text-secondary">{collection.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {collection.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-sm bg-bg-subtle text-text-secondary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collection.artworks.map((artwork) => (
          <div 
            key={artwork.id} 
            className="group relative aspect-square rounded-lg overflow-hidden bg-bg-subtle"
          >
            <Image
              src={artwork.imageUrl}
              alt={artwork.title || ''}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white"
                onClick={() => handleOpenViewer(artwork)}
              >
                <ZoomIn className="w-5 h-5 mr-2" />
                View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedArtwork && (
        <ImageViewer
          artwork={selectedArtwork}
          artworks={collection.artworks}
          currentIndex={collection.artworks.findIndex(a => a.id === selectedArtwork.id)}
          onIndexChange={(index) => setSelectedArtwork(collection.artworks[index])}
          isOpen={isViewerOpen}
          onOpenChange={setIsViewerOpen}
        />
      )}
    </div>
  );
} 