import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const categories = [
  {
    title: 'Mindful Coloring Pages',
    description: 'Discover printable coloring pages designed for mindfulness and relaxation.',
    href: '/explore/mindfulcoloringpages',
    image: '/images/explore/coloring.jpg'
  },
  {
    title: 'Visual Journal Artworks',
    description: 'Explore artistic expressions of daily mindfulness practice.',
    href: '/explore/visualjournalartworks',
    image: '/images/explore/journal.jpg'
  },
  {
    title: "Editor's Picks",
    description: 'Curated collection of our most inspiring artworks.',
    href: '/explore/editorspicks',
    image: '/images/explore/picks.jpg'
  }
];

export default function ExplorePage() {
  return (
    <Container className="py-12">
      <h1 className="text-4xl font-heading mb-8">Explore Mindful Art</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link 
            key={category.title} 
            href={category.href}
            className="group relative overflow-hidden rounded-lg aspect-[3/4]"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <h2 className="text-xl font-heading text-white mb-2">
                {category.title}
              </h2>
              <p className="text-sm text-white/80 font-body line-clamp-2">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
} 