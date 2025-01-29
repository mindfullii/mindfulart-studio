'use client';

import Masonry from 'react-masonry-css';
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
  const breakpointColumns = {
    default: 5,
    1536: 4,
    1280: 3,
    1024: 2,
    768: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {artworks.map((artwork) => (
        <Link
          key={artwork.id}
          href={`/explore/artworks/${artwork.id}`}
          className="block mb-4 group"
        >
          <div className="relative overflow-hidden rounded-lg">
            <div className="relative aspect-[3/4]">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                sizes="(min-width: 1536px) 25vw, (min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="text-white font-medium text-lg mb-2">
                  {artwork.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-white/20 text-white rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </Masonry>
  );
} 