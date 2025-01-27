import { prisma } from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { CollectionDetail } from '../../coloringpages/[id]/CollectionDetail';
import { ArtworkCategory } from '@prisma/client';
import { notFound } from 'next/navigation';

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
  params: {
    id: string;
  };
}

export default async function VisualJournalArtworkDetailPage({ params }: Props) {
  const collection = await prisma.exploreCollection.findUnique({
    where: {
      id: params.id,
      type: ArtworkCategory.COLORFULVISUAL,
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