import { Container } from '@/components/ui/Container';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ImageViewer } from '@/components/explore/ImageViewer';
import { ZoomIn } from 'lucide-react';
import { CollectionDetail } from './CollectionDetail';
import { ArtworkCategory } from '@prisma/client';

interface Props {
  params: {
    id: string;
  };
}

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

export default async function CollectionDetailPage({ params }: Props) {
  const collection = await prisma.exploreCollection.findUnique({
    where: {
      id: params.id,
    },
    include: {
      artworks: true,
    },
  }) as ExploreCollection | null;

  if (!collection) {
    notFound();
  }

  return (
    <Container className="py-12">
      <CollectionDetail collection={collection} />
    </Container>
  );
} 