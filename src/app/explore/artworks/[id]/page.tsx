import { prisma } from '@/lib/prisma'
import { Container } from '@/components/ui/Container'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Prisma } from '@prisma/client'
import { ArtworkGrid } from '@/components/explore/ArtworkGrid'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'

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
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.email === 'kevinkang604@gmail.com'

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
          type: true,
          description: true,
          tags: true,
          relatedTo: {
            select: {
              id: true,
              title: true,
              imageUrl: true
            }
          }
        }
      }
    }
  })

  if (!artwork) {
    notFound()
  }

  const downloadUrls = artwork.downloadUrls as unknown as DownloadUrls

  // 处理文件名：移除特殊字符，替换空格为下划线
  const safeFileName = artwork.title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase()

  return (
    <Container className="py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-8 items-start">
          {/* 左侧：图片 (70%) */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-contain"
              priority
              sizes="(min-width: 768px) 70vw, 100vw"
            />
          </div>

          {/* 右侧：信息 (30%) */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{artwork.title}</h1>
                {isAdmin && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/explore/artworks/${artwork.id}/edit`}>
                      编辑
                    </Link>
                  </Button>
                )}
              </div>
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
              <div className="prose max-w-none prose-headings:font-heading prose-h1:text-[2.8em] prose-h1:leading-[1.2] prose-h1:font-semibold prose-h2:font-subheading prose-h2:text-[1.8em] prose-h2:leading-[1.3] prose-h2:font-medium prose-h3:font-subheading prose-h3:text-[1.5em] prose-h3:leading-[1.4] prose-h3:font-normal prose-p:font-body prose-p:text-base prose-p:leading-[1.6] prose-p:text-text-primary" dangerouslySetInnerHTML={{ __html: artwork.description || '' }} />
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full">
                <a
                  href={`/api/artwork/download?url=${encodeURIComponent(artwork.imageUrl)}&format=png&title=${encodeURIComponent(safeFileName)}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PNG
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <a
                  href={`/api/artwork/download?url=${encodeURIComponent(artwork.imageUrl)}&format=pdf&title=${encodeURIComponent(safeFileName)}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* 相关作品 */}
        {artwork.relatedTo.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Artworks</h2>
            <ArtworkGrid artworks={artwork.relatedTo} />
          </div>
        )}
      </div>
    </Container>
  )
} 
