import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/Container'
import { ArtworkGrid } from '@/components/explore/ArtworkGrid'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArtworkCategory } from '@prisma/client'

export default async function ArtworksPage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const type = searchParams.type as ArtworkCategory | undefined

  const artworks = await prisma.exploreArtwork.findMany({
    where: type ? {
      type
    } : undefined,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      relatedTo: {
        select: {
          id: true,
          title: true,
          imageUrl: true
        }
      }
    }
  })

  return (
    <Container className="py-12">
      <div className="space-y-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-4">Explore Artworks</h1>
          <p className="text-gray-600">
            Discover our curated collection of artworks. Each piece is carefully selected 
            to help you find peace and creativity through art.
          </p>
        </div>

        <Tabs defaultValue={type || 'all'}>
          <TabsList>
            <TabsTrigger value="all" asChild>
              <a href="/explore/artworks">All Artworks</a>
            </TabsTrigger>
            <TabsTrigger value={ArtworkCategory.COLORINGPAGES} asChild>
              <a href={`/explore/artworks?type=${ArtworkCategory.COLORINGPAGES}`}>Coloring Pages</a>
            </TabsTrigger>
            <TabsTrigger value={ArtworkCategory.COLORFULVISUAL} asChild>
              <a href={`/explore/artworks?type=${ArtworkCategory.COLORFULVISUAL}`}>Visual Art</a>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <ArtworkGrid artworks={artworks} />
          </div>
        </Tabs>
      </div>
    </Container>
  )
} 
