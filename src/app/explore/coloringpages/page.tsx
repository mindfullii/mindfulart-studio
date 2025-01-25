import { Container } from '@/components/ui/Container';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export default async function ColoringPagesPage() {
  // 获取管理员上传的涂色页面
  const artworks = await prisma.artwork.findMany({
    where: {
      type: 'COLORING',
      source: 'ADMIN',
      category: 'COLORINGPAGES',
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      artistName: true,
      sourceUrl: true,
      featured: true,
      createdAt: true,
    },
  });

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork) => (
            <div 
              key={artwork.id}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <h3 className="text-white font-medium">{artwork.title}</h3>
                {artwork.artistName && (
                  <p className="text-white/80 text-sm">By {artwork.artistName}</p>
                )}
                {artwork.featured && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
} 