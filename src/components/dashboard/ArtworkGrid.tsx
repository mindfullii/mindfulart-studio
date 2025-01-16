'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

type Artwork = {
  id: string;
  title: string;
  image: string;
  createdAt: string;
};

const mockArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Mindful Deer',
    image: '/images/artworks/deer.jpg',
    createdAt: '2023-12-19'
  },
  // ... 更多示例作品
];

export function ArtworkGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockArtworks.map((artwork) => (
        <Card key={artwork.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1">{artwork.title}</h3>
            <p className="text-sm text-text-secondary">
              {formatDate(artwork.createdAt)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
} 