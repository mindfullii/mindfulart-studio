'use client';

import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';
import { ArtworkCategory } from '@prisma/client';

interface Artwork {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  type: ArtworkCategory;
  tags: string[];
  relatedTo: {
    id: string;
    title: string;
    imageUrl: string;
  }[];
}

interface ArtworkGridProps {
  artworks: Artwork[];
}

export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {artworks.map((artwork) => (
        <Link key={artwork.id} href={`/explore/artworks/${artwork.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-square">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 line-clamp-2">{artwork.title}</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 