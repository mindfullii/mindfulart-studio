import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/Container'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArtworkGrid } from '@/components/explore/ArtworkGrid'
import { ArtworkCategory } from '@prisma/client'
import { ServerPagination } from '@/components/ui/ServerPagination'
import Image from 'next/image'

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
          <div className="max-w-6xl mx-auto px-8 py-24 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 space-y-8">
              <h1 className="text-[2.8em] font-heading text-text-primary">
                Explore Inspirations
              </h1>
              <p></p>
              <p className="text-base font-body text-text-secondary">
                Discover the beauty in every pause.
                </p>
                <p>Let inspiration find its way to you.
              </p>
            </div>
            <div className="hidden md:block w-1/2 relative aspect-[5/4]">
              <Image
                src="/images/features/header01.jpg"
                alt="Explore Inspirations"
                fill
                className="object-cover rounded-2xl"
                priority
              />
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
                  <a href="/explore/artworks">All</a>
                </TabsTrigger>
                <TabsTrigger value={ArtworkCategory.COLORINGPAGES} asChild>
                  <a href={`/explore/artworks?type=${ArtworkCategory.COLORINGPAGES}`}>Coloring Pages</a>
                </TabsTrigger>
                <TabsTrigger value={ArtworkCategory.COLORFULVISUAL} asChild>
                  <a href={`/explore/artworks?type=${ArtworkCategory.COLORFULVISUAL}`}>Colorful Visual</a>
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
