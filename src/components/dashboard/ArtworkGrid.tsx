'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { ArtworkPreviewModal } from './ArtworkPreviewModal';
import { motion } from 'framer-motion';
import { Pagination } from '@/components/ui/Pagination';

const ITEMS_PER_PAGE = 12;

type ArtworkType = 'VISION' | 'COLORING' | 'MEDITATION';

type Artwork = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
  type: ArtworkType;
};

const typeLabels: Record<ArtworkType, { label: string; color: string }> = {
  VISION: { label: 'Vision Art', color: 'bg-purple-100 text-purple-800' },
  COLORING: { label: 'Coloring', color: 'bg-blue-100 text-blue-800' },
  MEDITATION: { label: 'Meditation', color: 'bg-green-100 text-green-800' },
};

// 添加测试数据
const mockArtworks: Artwork[] = Array.from({ length: 30 }, (_, i) => ({
  id: `test-${i + 1}`,
  title: `Test Artwork ${i + 1}`,
  description: 'Test description',
  prompt: 'Test prompt',
  imageUrl: '/images/generated/generated_1737585316148.png',
  createdAt: new Date().toISOString(),
  type: ['VISION', 'COLORING', 'MEDITATION'][i % 3] as ArtworkType,
}));

export function ArtworkGrid() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedType, setSelectedType] = useState<ArtworkType | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch('/api/artwork');
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        const data = await response.json();
        // 使用测试数据
        setArtworks(mockArtworks);
      } catch (err) {
        console.error('Error details:', err);
        // 发生错误时也使用测试数据
        setArtworks(mockArtworks);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const filteredArtworks = selectedType === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.type === selectedType);

  // 计算分页
  const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArtworks = filteredArtworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 切换类型时重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);

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
              ? 'bg-gray-100 text-gray-900'
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
                ? 'bg-gray-100 text-gray-900'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {paginatedArtworks.map((artwork, index) => (
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
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  {typeLabels[artwork.type] && (
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium shadow-sm backdrop-blur-sm bg-opacity-90 ${typeLabels[artwork.type].color}`}>
                      {typeLabels[artwork.type].label}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 bg-white">
                <h3 className="font-medium text-lg mb-2 group-hover:text-gray-900 transition-colors line-clamp-1">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {selectedArtwork && (
        <ArtworkPreviewModal
          isOpen={!!selectedArtwork}
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </>
  );
} 