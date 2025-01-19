import { Container } from '@/components/ui/Container';
import { ArtworkGrid } from '@/components/explore/ArtworkGrid';
import { CategoryHeader } from '@/components/explore/CategoryHeader';

// 测试数据
const mockArtworks = [
  {
    id: '1',
    title: 'Peaceful Garden',
    description: 'A serene garden scene perfect for mindful coloring.',
    imageUrl: '/images/explore/coloring/garden.jpg',
    downloadUrl: '/images/explore/coloring/garden.jpg',
    tags: ['nature', 'garden', 'peaceful']
  },
  {
    id: '2',
    title: 'Ocean Waves',
    description: 'Calming ocean waves pattern for relaxation.',
    imageUrl: '/images/explore/coloring/waves.jpg',
    downloadUrl: '/images/explore/coloring/waves.jpg',
    tags: ['ocean', 'waves', 'relaxing']
  },
  // ... 可以添加更多测试数据
];

export default function MindfulColoringPages() {
  return (
    <Container className="py-12">
      <CategoryHeader 
        title="Mindful Coloring Pages"
        description="Discover our collection of printable coloring pages designed to help you practice mindfulness through art. Each page is carefully crafted to promote relaxation and focus."
      />
      
      <ArtworkGrid 
        category="mindfulcoloringpages"
        initialArtworks={mockArtworks}
      />
    </Container>
  );
} 