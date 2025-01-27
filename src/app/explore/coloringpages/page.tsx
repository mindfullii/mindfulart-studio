import { prisma } from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { ArtworkCategory } from '@prisma/client';
import { CollectionGrid } from './CollectionGrid';

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

export default async function ColoringPagesPage() {
  const collections = await prisma.exploreCollection.findMany({
    where: {
      type: ArtworkCategory.COLORINGPAGES,
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
          <h1 className="text-3xl font-bold mb-4">Mindful Coloring Pages</h1>
          <p className="text-gray-600">
            Discover our curated collection of mindful coloring pages. Each piece is carefully selected 
            to help you find peace and creativity through the art of coloring.
          </p>
        </div>

        <CollectionGrid collections={collections} />
      </div>
    </Container>
  );
} 