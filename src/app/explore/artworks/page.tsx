import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/Container'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArtworkGrid } from '@/components/explore/ArtworkGrid'
import { ArtworkCategory } from '@prisma/client'
import { ServerPagination } from '@/components/ui/ServerPagination'

const ITEMS_PER_PAGE = 20

export default async function ArtworksPage({
  searchParams,
}: {
  searchParams: { 
    type?: string;
    page?: string;
  }
}) {
  const type = searchParams.type as ArtworkCategory | undefined
  const page = Number(searchParams.page) || 1
  const skip = (page - 1) * ITEMS_PER_PAGE

  // 获取总数
  const total = await prisma.exploreArtwork.count({
    where: type ? { type } : undefined,
  })

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  // 获取当前页的作品
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
    },
    skip,
    take: ITEMS_PER_PAGE,
  })

  return (
    <main className="min-h-screen">
      <div className="bg-white">
        <Container>
          <div className="py-48">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-7xl font-bold mb-12 text-gray-900 font-heading">Explore Inspirations</h1>
              <div className="text-text-tertiary text-xl space-y-4 font-subheading">
                <p>Discover the beauty in every pause.</p>
                <p>Let inspiration find its way to you.</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-gray-50">
        <Container>
          <div className="py-12">
            <Tabs defaultValue={type || 'all'} className="flex flex-col items-center">
              <TabsList className="mb-6">
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

              <div className="mt-6 w-full">
                <ArtworkGrid artworks={artworks} />
                <div className="mt-12">
                  <ServerPagination
                    currentPage={page}
                    totalPages={totalPages}
                    baseUrl={type ? `/explore/artworks?type=${type}` : '/explore/artworks'}
                  />
                </div>
              </div>
            </Tabs>
          </div>
        </Container>
      </div>
    </main>
  )
} 
