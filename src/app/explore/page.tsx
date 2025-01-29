import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const categories = [
  {
    title: '所有作品',
    description: '浏览所有精选作品，包括填色页和视觉艺术。',
    href: '/explore/artworks',
    image: '/images/explore/all.jpg'
  },
  {
    title: '填色页',
    description: '发现专为正念练习设计的填色页。',
    href: '/explore/coloringpages',
    image: '/images/explore/coloring.jpg'
  },
  {
    title: '视觉艺术',
    description: '探索艺术表达的日常正念练习。',
    href: '/explore/visualjournalartworks',
    image: '/images/explore/journal.jpg'
  }
];

export default function ExplorePage() {
  return (
    <Container className="py-12">
      <div className="max-w-2xl mb-12">
        <h1 className="text-4xl font-bold mb-4">探索作品</h1>
        <p className="text-gray-600">
          发现我们精心策划的作品集。每一件作品都经过精心挑选，
          旨在帮助您通过艺术找到平静与创造力。
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.title} 
            href={category.href}
            className="group relative overflow-hidden rounded-lg aspect-[4/3]"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <h2 className="text-2xl font-bold text-white mb-2">
                {category.title}
              </h2>
              <p className="text-white/90 line-clamp-2">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
} 