import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/Container'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

interface Props {
  params: {
    id: string
  }
}

interface DownloadUrls {
  png: string
  pdf?: string
}

export default async function ArtworkPage({ params }: Props) {
  const artwork = await prisma.exploreArtwork.findUnique({
    where: {
      id: params.id
    },
    include: {
      relatedTo: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
          type: true
        }
      }
    }
  })

  if (!artwork) {
    notFound()
  }

  const downloadUrls = artwork.downloadUrls as unknown as DownloadUrls

  return (
    <Container className="py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧：图片 */}
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* 右侧：信息 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: artwork.description || '' }} />
            </div>

            <div className="flex gap-4">
              <Button asChild>
                <a
                  href={downloadUrls.png}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  下载 PNG
                </a>
              </Button>
              {downloadUrls.pdf && (
                <Button asChild variant="outline">
                  <a
                    href={downloadUrls.pdf}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    下载 PDF
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 相关作品 */}
        {artwork.relatedTo.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">相关作品</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artwork.relatedTo.map((related) => (
                <Link
                  key={related.id}
                  href={`/explore/artworks/${related.id}`}
                  className="group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                    <Image
                      src={related.imageUrl}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium line-clamp-2">{related.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  )
} 
