import { prisma } from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { ArtworkCategory } from '@prisma/client';
import { CollectionGrid } from '../coloringpages/CollectionGrid';

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

export default async function VisualJournalArtworksPage() {
  const collections = await prisma.exploreCollection.findMany({
    where: {
      type: ArtworkCategory.COLORFULVISUAL,
    },
    include: {
      artworks: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) as ExploreCollection[];

  return (
    <Container className="py-12">
      <div className="space-y-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">Colorful Visual Journal</h1>
          <p className="text-gray-600">
            Explore our vibrant collection of visual journal artworks. Each piece is thoughtfully created 
            to inspire your creative journey and artistic expression.
          </p>
        </div>

        <CollectionGrid collections={collections} />
      </div>
    </Container>
  );
} 