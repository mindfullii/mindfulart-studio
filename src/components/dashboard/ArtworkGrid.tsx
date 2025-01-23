'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { ArtworkPreviewModal } from './ArtworkPreviewModal';
import { motion } from 'framer-motion';

type ArtworkType = 'vision' | 'coloring' | 'meditation';

type Artwork = {
  id: string;
  title: string;
  image: string;
  createdAt: string;
  type: ArtworkType;
};

const typeLabels: Record<ArtworkType, { label: string; color: string }> = {
  vision: { label: 'Vision Art', color: 'bg-purple-100 text-purple-800' },
  coloring: { label: 'Coloring', color: 'bg-blue-100 text-blue-800' },
  meditation: { label: 'Meditation', color: 'bg-green-100 text-green-800' },
};

export function ArtworkGrid() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedType, setSelectedType] = useState<ArtworkType | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('/api/artwork');
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        const data = await response.json();
        setArtworks(data.map((artwork: any) => ({
          id: artwork.id,
          title: artwork.title,
          image: artwork.imageUrl,
          createdAt: artwork.createdAt,
          type: artwork.type as ArtworkType,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artworks');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const filteredArtworks = selectedType === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.type === selectedType);

  if (loading) {
    return <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (artworks.length === 0) {
    return <div className="text-center py-12 text-gray-500">No artworks found. Create some!</div>;
  }

  return (
    <>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
            selectedType === 'all'
              ? 'bg-[#6DB889] text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {Object.entries(typeLabels).map(([type, { label }]) => (
          <button
            key={type}
            onClick={() => setSelectedType(type as ArtworkType)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              selectedType === type
                ? 'bg-[#6DB889] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredArtworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card 
              className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
              onClick={() => setSelectedArtwork(artwork)}
            >
              <div className="relative aspect-square">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm bg-opacity-90 ${typeLabels[artwork.type].color}`}>
                    {typeLabels[artwork.type].label}
                  </span>
                </div>
              </div>
              <div className="p-5 bg-white">
                <h3 className="font-medium text-lg mb-2 group-hover:text-[#6DB889] transition-colors line-clamp-1">
                  {artwork.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(artwork.createdAt)}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedArtwork && (
        <ArtworkPreviewModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </>
  );
} 