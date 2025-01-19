'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArtworkModal } from './ArtworkModal';
import { useInView } from 'react-intersection-observer';

interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

interface ArtworkGridProps {
  category: 'mindfulcoloringpages' | 'visualjournalartworks' | 'editorspicks';
  initialArtworks?: Artwork[];
}

export function ArtworkGrid({ category, initialArtworks = [] }: ArtworkGridProps) {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  });

  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      setHasMore(false);
    } catch (error) {
      console.error('Failed to load artworks:', error);
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-5 gap-4">
        {artworks.map((artwork) => (
          <div 
            key={artwork.id}
            className="break-inside-avoid mb-4 cursor-pointer group"
            onClick={() => setSelectedArtwork(artwork)}
          >
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                width={800}
                height={600}
                className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-heading text-lg mb-1">
                  {artwork.title}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2">
                  {artwork.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {loading && (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}

      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </>
  );
} 